### Ach Withdrawal
#### Execute transaction
```java
Wallet wallet = sdk.wallets().getWallet(person.getId(), createdWallet.getWalletId().get()).getBalance().get();//100.00

BankAccountPaymentInformation bankAccountPaymentInformation = BankAccountPaymentInformation.builder().
    bankAccountType(BankAccountPaymentInformationBankAccountType.CHECKING).accountBankName("Acme Bank").
    bankAccountNumber("123456789").bankRoutingNumber("123456789").bankRoutingCheckDigit("0").build();

AchPaymentMethod achPaymentMethod = AchPaymentMethod.builder().
    paymentInformation(OneOfFiatPaymentInformation.bankAccount(bankAccountPaymentInformation)).build();

ExecuteWithdrawalTransaction executeWithdrawalTransaction = ExecuteWithdrawalTransaction.builder().
    type(TransactionTypeEnum.WITHDRAWAL).amount(100.00).date(new Date().toString()).
    initiator(OneOfUserSubTypes.person(person)).ptiRequestId(UUID.randomUUID().toString()).
    ptiScenarioId("acme_withdrawal").sourceMethod(WalletPaymentMethod.builder().paymentInformation(wallet).build()).
    destinationMethod(OneOfExternalPaymentMethod.wire(achPaymentMethod)).build();

sdk.executeTransaction().withdrawal(executeWithdrawalTransaction);
```

```curl
curl --location 'https://api.staging.fiant.io/v1/transactions/withdrawals' \
--header 'x-pti-request-id;' \
--header 'x-pti-scenario-id: x_ebq_oofr260yvikz7lymdajw-w529rh2pqmu_sbhboe7_4-wki7q58qge4f' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'x-pti-signature;' \
--data '{
    "sourceMethod": {
        "paymentMethodType": "WALLET",
        "paymentInformation": {
            "type": "WALLET",
            "walletId": "{{WALLET_ID}}"
        }
    },
    "destinationMethod": {
        "paymentMethodType": "ACH",
        "paymentInformation": {
            "type": "BANK_ACCOUNT",
            "bankAccountNumber": "1234567890",
            "accountBankName": "Acme Bank",
            "bankRoutingNumber": "123456789",
            "bankRoutingCheckDigit": "0"
        }
    },
    "date": "2024-11-18T21:24:56+00:00",
    "amount": 100,
    "type": "WITHDRAWAL"
}'
```

#### Receive Webhook
```java
sdk.decodeWebhookPayload(payload);
```
```json
{
  "resourceType": "TRANSACTION_STATUS",
  "requestId": "REQUEST_ID",
  "clientId": "CLIENT_ID",
  "userId": "USER_ID",
  "status": "SETTLED",
  "date": "TRANSACTION_DATE",
  "amount": 100,
  "currency": "USD",
  "transactionType": "WITHDRAWAL",
  "paymentMethod": "BANK_ACCOUNT",
  "total": {
    "subTotal": {
      "amount": 100,
      "currency": "USD"
    },
    "fee": {
      "amount": 0,
      "currency": "USD"
    },
    "total": {
      "amount": 100,
      "currency": "USD"
    }
  }
}
```