import csv
import os
import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Optional, Dict, List, TextIO

import coinaddr
from coinaddr.validation import ValidationResult
from jwcrypto.jwk import JWK
from pydantic import BaseModel, Field, EmailStr

from pti_tools import make_signed_request

import logging

root_logger = logging.getLogger()
logging_level = os.environ.get("LOG_LEVEL", logging.DEBUG)
root_logger.setLevel(logging_level)

log = logging.getLogger(__name__)


class PaymentMethodType(str, Enum):
    FIAT = "FIAT"
    TOKEN = "TOKEN"


class PaymentInformationType(str, Enum):
    CREDIT_CARD = "CREDIT_CARD"
    PAYPAL = "PAYPAL"
    TOKEN = "TOKEN"
    BANK_ACCOUNT = "BANK_ACCOUNT"
    ENCRYPTED_CREDIT_CARD = "ENCRYPTED_CREDIT_CARD"


class PaymentInformation(BaseModel):
    type: PaymentMethodType
    billingEmail: EmailStr


class PaymentMethod(BaseModel):
    paymentMethodType: PaymentMethodType
    paymentInformation: PaymentInformation


class TokenPaymentInformation(PaymentInformation):
    type = PaymentMethodType.TOKEN
    tokenAddress: str
    tokenType: str



class TransactionTypes(str, Enum):
    TRANSFER = 'TRANSFER'
    WITHDRAWAL = 'WITHDRAWAL'
    FUNDING = 'FUNDING'


class PersonInitiator(BaseModel):
    type = "PERSON"
    id: uuid.UUID


class LogWithdrawlTransactionBody(BaseModel):
    destinationMethod: PaymentMethod
    type: str = TransactionTypes.WITHDRAWAL
    date: datetime
    requestId: Optional[str]
    status: Optional[str]
    usdValue: Optional[float]
    amount: Optional[float]
    initiator: PersonInitiator
    ptiMeta: Optional[Dict[str, str]]
    clientMeta: Optional[Dict[str, str]]


class LogWithdrawlTransactionHeaders(BaseModel):
    request_id: uuid.UUID = Field(..., alias="x-pti-request-id")
    scenario_id: Optional[uuid.UUID] = Field(alias="x-pti-scenario-id")
    profile_id: Optional[uuid.UUID] = Field(alias="x-pti-profile-id")

    class Config:
        allow_population_by_field_name = True


class WithdrawlTransaction(BaseModel):
    user_id: uuid.UUID
    headers: LogWithdrawlTransactionHeaders
    body: LogWithdrawlTransactionBody

    @classmethod
    def new(cls, date: str, user_id: str, email: str, coin: str, amount_usd: float, amount_coin: float,
            transaction_type: str,
            eth_add: str) -> 'WithdrawlTransaction':
        instance = cls(
            user_id=uuid.UUID(user_id),
            headers=LogWithdrawlTransactionHeaders(request_id=uuid.uuid4()),
            body=LogWithdrawlTransactionBody(
                destinationMethod=PaymentMethod(
                    paymentMethodType=PaymentMethodType.TOKEN,
                    paymentInformation=TokenPaymentInformation(
                        billingEmail=EmailStr(email),
                        tokenType=coin,
                        tokenAddress=eth_add)
                ),
                initiator=PersonInitiator(id=uuid.UUID(user_id), type="PERSON"),
                date=date,
                usdValue=amount_usd,
                amount=amount_coin,
                ptiMeta={"transaction creator": "transaction_importer.py"}
            )
        )
        return instance


class Transactions(BaseModel):
    withdrawls: List[WithdrawlTransaction]


class ParseError(BaseModel):
    line_num: int
    line_content: str
    error_messages: List[str]


class RequestError(BaseModel):
    request_id: uuid.UUID
    status_code: int
    content: str


class Errors(BaseModel):
    parse_errors: List[ParseError] = Field(default_factory=list)
    request_errors: List[RequestError] = Field(default_factory=list)


class CsvHeaders(str, Enum):
    DATE = 'Created Date'
    USER_ID = 'rnbUserId'
    FIRST_NAME = 'firstName'
    LAST_NAME = 'lastName'
    EMAIL = 'Email'
    COIN = 'coinKind'
    TRANSACTION_TYPE = 'TxnType'
    AMOUNT_USD = 'Amount'
    AMOUNT_COIN = 'Coins'
    ETH_ADD = 'ETHAddress'


class TransactionImporter:

    def __init__(self):
        self.csv_filepath = None
        self.errors = Errors()
        self.row_errors: Optional[ParseError] = None
        self.row_warnings: Optional[ParseError] = None
        self.transactions = Transactions(withdrawls=[])
        self.private_key: Optional[JWK] = None

    def load_csv_file(self, csv_filepath):
        self.csv_filepath = csv_filepath
        self.errors = Errors()
        self.transactions = Transactions(withdrawls=[])

        with open(csv_filepath, newline='') as f:
            self.read_csv_stream(f)

    def read_csv_stream(self, stream: TextIO):
        reader = csv.DictReader(stream)
        for row in reader:
            self.row_errors = None
            self.row_warnings = None
            transaction_date = self._extract_mandatory_field(row, reader.line_num, CsvHeaders.DATE)
            user_id = self._extract_mandatory_field(row, reader.line_num, CsvHeaders.USER_ID)
            first_name = self._extract_optional_field(row, reader.line_num, CsvHeaders.FIRST_NAME)
            last_name = self._extract_optional_field(row, reader.line_num, CsvHeaders.LAST_NAME)
            email = self._extract_mandatory_field(row, reader.line_num, CsvHeaders.EMAIL)
            coin = self._extract_mandatory_field(row, reader.line_num, CsvHeaders.COIN)
            tx_type = self._extract_mandatory_field(row, reader.line_num, CsvHeaders.TRANSACTION_TYPE)
            amount_usd = self._extract_mandatory_field(row, reader.line_num, CsvHeaders.AMOUNT_USD)
            amount_coin = self._extract_mandatory_field(row, reader.line_num, CsvHeaders.AMOUNT_COIN)
            eth_add = self._extract_mandatory_field(row, reader.line_num, CsvHeaders.ETH_ADD)

            try:
                txn_date = datetime.fromisoformat(transaction_date).astimezone(tz=timezone.utc)

                txn = WithdrawlTransaction.new(date=txn_date, user_id=user_id, email=email, coin=coin,
                                               amount_usd=float(amount_usd), amount_coin=float(amount_coin),
                                               transaction_type=tx_type, eth_add=eth_add)
                self.transactions.withdrawls.append(txn)
            except Exception as e:
                self._update_row_errors(row=row, line_num=reader.line_num,
                                        error_message=f"Failed to instantiate transaction {e}")

            if self.row_warnings:
                self.errors.parse_errors.append(self.row_warnings)

            if self.row_errors:
                self.errors.parse_errors.append(self.row_errors)
                continue

    def dump_transactions_json(self, json_filepath: str):
        with open(json_filepath, 'wt', encoding='utf-8') as f:
            txn_json = self.transactions.json(by_alias=True, exclude_unset=True, indent=2)
            f.write(txn_json)

    def dump_results(self, json_filepath):
        with open(json_filepath, 'wt', encoding='utf-8') as f:
            err_json = self.errors.json(indent=2)
            f.write(err_json)

    def clear_transactions(self):
        self.transactions = Transactions(withdrawls=[])

    def clear_errors(self):
        self.errors = Errors()

    def load_json_file(self, json_filepath):
        with open(json_filepath, 'rt', encoding='utf-8') as f:
            self.load_from_json_stream(f)

    def load_from_json_stream(self, stream: TextIO):
        log.debug("Loading json stream {}", stream)
        json = stream.read()
        try:
            self.transactions = Transactions.parse_raw(json)
        except Exception as e:
            self._update_row_errors({}, 0, f"Could not instantiate transaction list: {e}")

    def log_transactions_via_api(self, client_id: str, api_base_url: str):
        for txn in self.transactions.withdrawls:
            url = f"/v0/users/{txn.user_id}/transactionLogs"
            method = "POST"
            resp = make_signed_request(client_id=client_id, request_id=str(txn.headers.request_id), key=self.private_key, url=api_base_url.rstrip('/') + url,
                                       method=method, data=txn.body.json(by_alias=True, indent=2))
            if not resp.ok:
                self._update_request_errors(RequestError(request_id=txn.headers.request_id, status_code=resp.status_code, content=resp.text))

    def load_private_key_json_file(self, priv_key_filepath: str) -> JWK:
        with open(priv_key_filepath, "rb") as f:
            self.private_key = JWK.from_json(f.read())
        return self.private_key

    @property
    def has_errors(self):
        return self.errors.parse_errors or self.errors.request_errors

    def _extract_mandatory_field(self, row: Dict, line_num: int, field_name: str) -> Optional[str]:
        field_value = row.get(field_name)
        if not field_value:
            self._update_row_errors(row, line_num, f"Mandatory field {field_name} not found")
        else:
            self._run_validator(field_name, field_value, row, line_num)

        return field_value

    def _extract_optional_field(self, row: Dict, line_num: int, field_name: str) -> Optional[str]:
        field_value = row.get(field_name)
        if not field_value:
            self._update_row_warnings(row, line_num, f"Optional field {field_name} not found")
        else:
            self._run_validator(field_name, field_value, row, line_num)
        return field_value

    def _run_validator(self, field_name, field_value, row: Dict[str, str], line_num: int):
        validator_func = None
        if field_name == CsvHeaders.DATE:
            validator_func = datetime.fromisoformat
        elif field_name == CsvHeaders.EMAIL:
            validator_func = EmailStr.validate
        elif field_name in [CsvHeaders.AMOUNT_USD, CsvHeaders.AMOUNT_COIN]:
            validator_func = float
        elif field_name == CsvHeaders.ETH_ADD:
            validator_func = self._eth_validate

        if validator_func:
            try:
                validator_func(field_value)
            except Exception as e:
                self._update_row_errors(row=row, line_num=line_num,
                                        error_message=f"Could not validate {field_name} - {field_value}: {e}")

    def _eth_validate(self, eth_add: str):
        result: ValidationResult = coinaddr.validate('eth', eth_add)
        if result.valid is False:
            raise ValueError

    def _update_row_errors(self, row: Dict[str, str], line_num: int, error_message: str):
        self._update_row_error_attr('row_errors', row=row, line_num=line_num, error_message=error_message)

    def _update_row_warnings(self, row: Dict[str, str], line_num: int, error_message: str):
        self._update_row_error_attr('row_warnings', row=row, line_num=line_num, error_message=error_message)

    def _update_row_error_attr(self, attr_name: str, row: Dict[str, str], line_num: int, error_message: str):
        row_attr: Optional[ParseError] = getattr(self, attr_name)
        if row_attr:
            row_attr.error_messages.append(error_message)
        else:
            setattr(self, attr_name,
                    ParseError(line_num=line_num, line_content=",".join(row.values()), error_messages=[error_message]))

    def _update_request_errors(self, error: RequestError):
        self.errors.request_errors.append(error)


if __name__ == "__main__":
    BASE_URL = os.environ.get("PTI_API_BASE_URL", "https://pti.apidev.pticlient.com")
    CLIENT_ID = '3450582c-1955-11eb-adc1-0242ac120002'
    PRIVATE_KEY = 'private1.jwk'
    importer = TransactionImporter()
    importer.load_csv_file('bridgeouts1.csv')
    importer.dump_results('bridgeout1.csvparser.results.json')
    importer.dump_transactions_json('bridgeouts1.json')
    importer.load_json_file("bridgeouts1.json")
    importer.dump_results('bridgeout1.jsonparser.results.json')
    importer.load_private_key_json_file(PRIVATE_KEY)
    importer.log_transactions_via_api(client_id=CLIENT_ID, api_base_url=BASE_URL)
    importer.dump_results("bridgeouts1.request.results.json")
