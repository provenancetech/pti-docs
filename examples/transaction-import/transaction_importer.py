""" Transaction Importer

Usage:
    transaction_importer.py convert CSV_INPUT_FILE JSON_OUTPUT_FILE
    transaction_importer.py import --input=<json_input_file> --client_id=<client_id> --private_key=<pk_file> --endpoint=<api_endpoint>
    transaction_importer.py -h | --help

Arguments:
    CSV_INPUT_FILE      csv input file to convert to json
    JSON_OUTPUT_FILE    name of the json ouptut file containing the result of the conversion

Options
    -h --help       Show this screen
    --input         Path to json input to use for importation
    --client_id     Client ID to be used for importation calls to the API
    --private_key   Path to a private key file in json format to be used to sign API requests
    --endpoint      Root endpoint of the API

"""
import csv
import logging
import os
import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Optional, Dict, List, TextIO

import coinaddr
from coinaddr.validation import ValidationResult
from docopt import docopt
from jwcrypto.jwk import JWK
from pydantic import BaseModel, Field, EmailStr

from pti_tools import make_signed_request

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


class LogWithdrawalTransactionBody(BaseModel):
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


class LogWithdrawalTransactionHeaders(BaseModel):
    request_id: uuid.UUID = Field(..., alias="x-pti-request-id")
    scenario_id: Optional[uuid.UUID] = Field(alias="x-pti-scenario-id")
    profile_id: Optional[uuid.UUID] = Field(alias="x-pti-profile-id")

    class Config:
        allow_population_by_field_name = True


class WithdrawalTransaction(BaseModel):
    user_id: uuid.UUID
    headers: LogWithdrawalTransactionHeaders
    body: LogWithdrawalTransactionBody

    @classmethod
    def new(cls, date: str, user_id: str, email: str, coin: str, amount_usd: float, amount_coin: float,
            transaction_type: str,
            eth_add: str) -> 'WithdrawalTransaction':
        instance = cls(
            user_id=uuid.UUID(user_id),
            headers=LogWithdrawalTransactionHeaders(request_id=uuid.uuid4()),
            body=LogWithdrawalTransactionBody(
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
    withdrawals: List[WithdrawalTransaction]


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
        self.transactions = Transactions(withdrawals=[])
        self.private_key: Optional[JWK] = None

    def load_csv_file(self, csv_filepath):
        self.csv_filepath = csv_filepath
        self.errors = Errors()
        self.transactions = Transactions(withdrawals=[])

        with open(csv_filepath, newline='') as f:
            self.read_csv_stream(f)

    def read_csv_stream(self, stream: TextIO):
        reader = csv.DictReader(stream)
        for row in reader:
            self.row_errors = None
            self.row_warnings = None
            transaction_date = self._extract_mandatory_field(row, reader.line_num, CsvHeaders.DATE)
            user_id = self._extract_mandatory_field(row, reader.line_num, CsvHeaders.USER_ID)
            email = self._extract_mandatory_field(row, reader.line_num, CsvHeaders.EMAIL)
            coin = self._extract_mandatory_field(row, reader.line_num, CsvHeaders.COIN)
            tx_type = self._extract_mandatory_field(row, reader.line_num, CsvHeaders.TRANSACTION_TYPE)
            amount_usd = self._extract_mandatory_field(row, reader.line_num, CsvHeaders.AMOUNT_USD)
            amount_coin = self._extract_mandatory_field(row, reader.line_num, CsvHeaders.AMOUNT_COIN)
            eth_add = self._extract_mandatory_field(row, reader.line_num, CsvHeaders.ETH_ADD)

            try:
                txn_date = datetime.fromisoformat(transaction_date).astimezone(tz=timezone.utc)

                txn = WithdrawalTransaction.new(date=txn_date, user_id=user_id, email=email, coin=coin,
                                                amount_usd=float(amount_usd), amount_coin=float(amount_coin),
                                                transaction_type=tx_type, eth_add=eth_add)
                self.transactions.withdrawals.append(txn)
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
            txn_json = self.transactions.json(by_alias=True, exclude_none=True, indent=2)
            f.write(txn_json)

    def dump_results(self, json_filepath):
        with open(json_filepath, 'wt', encoding='utf-8') as f:
            err_json = self.errors.json(indent=2)
            f.write(err_json)

    def clear_transactions(self):
        self.transactions = Transactions(withdrawals=[])

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
            self.errors.parse_errors.append(self.row_errors)

    def log_transactions_via_api(self, client_id: str, api_base_url: str):
        log.info(
            f"Importing {self.transactions.withdrawals} via api calls to {api_base_url} for client_id: {client_id}")
        for txn in self.transactions.withdrawals:
            url = f"/v0/users/{txn.user_id}/transactionLogs"
            method = "POST"
            resp = make_signed_request(
                client_id=client_id,
                request_id=str(txn.headers.request_id),
                key=self.private_key,
                url=api_base_url.rstrip('/') + url,
                method=method,
                data=txn.body.json(by_alias=True, indent=2)
            )
            if not resp.ok:
                self._update_request_errors(RequestError(
                    request_id=txn.headers.request_id,
                    status_code=resp.status_code,
                    content=resp.text)
                )

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
        # some ETH addresses seem to fail the checksum check but are still valid and found on etherscan
        # elif field_name == CsvHeaders.ETH_ADD:
        #     validator_func = self._eth_validate

        if validator_func:
            try:
                validator_func(field_value)
            except Exception as e:
                self._update_row_errors(row=row, line_num=line_num,
                                        error_message=f"Could not validate {field_name}={field_value} info:{e}")

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
    # generate cli from module docstring
    args = docopt(__doc__)
    if args.get("convert"):
        csv_input = args.get("CSV_INPUT_FILE")
        json_output = args.get("JSON_OUTPUT_FILE")
        importer = TransactionImporter()
        importer.load_csv_file(csv_input)
        importer.dump_transactions_json(json_output)
        if importer.has_errors:
            result_file = csv_input + ".errors.json"
            log.error(f"Some errors occurred during conversion, see {result_file}")
            importer.dump_results(result_file)
    elif args.get("import"):
        json_input = args.get("--input")
        private_key_file = args.get("--private_key")
        client_id = args.get("--client_id")
        endpoint = args.get("--endpoint")
        importer = TransactionImporter()
        importer.load_json_file(json_input)
        importer.load_private_key_json_file(private_key_file)
        importer.log_transactions_via_api(client_id=client_id, api_base_url=endpoint)
        if importer.has_errors:
            result_file = json_input + ".errors.json"
            log.error(f"Some errors occurred during importation, see {result_file}")
            importer.dump_results(result_file)
