import csv
import uuid
from datetime import datetime
from enum import Enum
from typing import Optional, Dict, List, Callable

import coinaddr
from coinaddr.validation import ValidationResult
from pydantic import BaseModel, Field, EmailStr


class PaymentMethod(BaseModel):
    address: str
    tokenType: str
    billingEmail: EmailStr
    type: str


class PaymentInformation(BaseModel):
    paymentInformation: PaymentMethod = Field(..., alias="paymentInformation")


class TransactionTypes(str, Enum):
    TRANSFER = 'TRANSFER'
    WITHDRAWAL = 'WITHDRAWAL'
    FUNDING = 'FUNDING'


class LogWithdrawlTransactionBody(BaseModel):
    destinationMethod: PaymentInformation
    type: str = TransactionTypes.WITHDRAWAL
    date: str
    requestId: Optional[str]
    status: Optional[str]
    usdValue: Optional[float]
    amount: Optional[float]
    # initiator: Optional[Any]  # TODO: figure this out
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
            eth_add: str) -> 'WithdrawlTransaction':
        instance = cls(
            user_id=uuid.UUID(user_id),
            headers=LogWithdrawlTransactionHeaders(request_id=uuid.uuid4()),
            body=LogWithdrawlTransactionBody(
                destinationMethod=PaymentInformation(
                    paymentInformation=PaymentMethod(
                        address=eth_add,
                        tokenType=coin,
                        billingEmail=EmailStr(email),
                        type='TODO'
                    )
                ),
                date=date,
                usdValue=amount_usd,
                amount=amount_coin,
                ptiMeta={"transaction creator": "transaction_importer.py"}
            )
        )
        return instance


class WithdrawlTransactions(BaseModel):
    __root__ = List[WithdrawlTransaction]

    class Config:
        arbitrary_types_allowed = True


class WithdrawlTransactions2(BaseModel):
    withdrawls: List[WithdrawlTransaction]


class ParseError(BaseModel):
    line_num: int
    line_content: str
    error_messages: List[str]


class ParseErrors(BaseModel):
    errors: List[ParseError]


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

    def __init__(self, csv_filepath: str):
        self.load_csv_file(csv_filepath)

    def load_csv_file(self, csv_filepath):
        self.csv_fliepath = csv_filepath
        self.parse_errors = ParseErrors(errors=[])
        self.row_errors: Optional[ParseError] = None
        self.row_warnings: Optional[ParseError] = None
        self.transactions = WithdrawlTransactions2(withdrawls=[])

        with open(csv_filepath, newline='') as f:
            reader = csv.DictReader(f)
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
                    txn = WithdrawlTransaction.new(date=transaction_date, user_id=user_id, email=email, coin=coin,
                                                   amount_usd=amount_usd, amount_coin=amount_coin, eth_add=eth_add)
                    self.transactions.withdrawls.append(txn)
                except Exception as e:
                    self._update_row_errors(row=row, line_num=reader.line_num,
                                            error_message=f"Failed to instantiate transaction {e}")

                if self.row_warnings:
                    self.parse_errors.errors.append(self.row_warnings)

                if self.row_errors:
                    self.parse_errors.errors.append(self.row_errors)
                    continue

    def dump_transactions_json(self, json_filepath: str):
        with open(json_filepath, 'wt', encoding='utf-8') as f:
            txn_json = self.transactions.json(by_alias=True, exclude_unset=True, indent=2)
            f.write(txn_json)

    def dump_results(self, json_filepath):
        with open(json_filepath, 'wt', encoding='utf-8') as f:
            err_json = self.parse_errors.json(exclude_unset=True, indent=2)
            f.write(err_json)

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
        validator_func: Callable = None
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
        if self.row_errors:
            self.row_errors.error_messages.append(error_message)
        else:
            self.row_errors = ParseError(line_num=line_num, line_content=",".join(row.values()),
                                         error_messages=[error_message])

    def _update_row_warnings(self, row: Dict[str, str], line_num: int, error_message: str):
        row_err_warn: Optional[ParseError] = getattr(self, 'row_warnings')
        if row_err_warn:
            row_err_warn.error_messages.append(error_message)
        else:
            setattr(self, 'row_warnings',
                    ParseError(line_num=line_num, line_content=",".join(row.values()), error_messages=[error_message]))


if __name__ == "__main__":
    importer = TransactionImporter("bridgeouts1.csv")
    importer.dump_transactions_json("bridgeouts1.json")
    importer.dump_results("bridgeouts1.results.json")
