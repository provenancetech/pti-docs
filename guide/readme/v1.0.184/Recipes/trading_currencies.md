### Trading currencies

#### Setup users and wallets
```java
Person person = Person.builder().id(UUID.randomUUID().toString()).name(Name.builder().
  lastName("Doe").firstName("John").build()).build();
WalletCreation wallet =  WalletCreation.builder().currency(CurrencyEnum.USD).
  label("My USD Wallet").walletId(UUID.randomUUID().toString()).build();
Wallet createdWallet = sdk.wallets().createWallet(person.getId(), wallet);
WalletCreation wallet2 =  WalletCreation.builder().currency(CurrencyEnum.BTC).
  label("My BTC Wallet").walletId(UUID.randomUUID().toString()).build();
Wallet createdWallet2 = sdk.wallets().createWallet(person.getId(), wallet2);
```

```curl
```curl --location 'https://api.staging.fiant.io/v1/users/5tdqs6b4uuceqi-aigtg5o1og23zafbwil7kba8lq3iaxk2bibas5ms3smr9f1awsay0cat1an-8spmyn649j3ni0ewv6gfv7vv/wallets' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'Date;' \
--header 'x-pti-signature;' \
--data '{
  "currency": "USD",
  "type": "WALLET",
  "walletId": "1ede814a-a698-44ba-9050-da23e99de7ee",
  "label": "My USD Wallet"
}'

curl --location 'https://api.staging.fiant.io/v1/users/5tdqs6b4uuceqi-aigtg5o1og23zafbwil7kba8lq3iaxk2bibas5ms3smr9f1awsay0cat1an-8spmyn649j3ni0ewv6gfv7vv/wallets' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'Date;' \
--header 'x-pti-signature;' \
--data '{
  "currency": "BTC",
  "type": "WALLET",
  "walletId": "999e814a-a698-44ba-9050-da23e99de7ee",
  "label": "My BTC Wallet"
}'
```
#### Execute Trade
```java
ExecuteTradeTransaction executeTradeTransaction = ExecuteTradeTransaction.builder().
  type(TransactionTypeEnum.TRADE).amount(100.00).date(new Date().toString()).
  initiator(OneOfUserSubTypes.person(person)).ptiRequestId(UUID.randomUUID().toString()).
  ptiScenarioId("acme_trade").sourceMethod(WalletPaymentMethod.builder().
  paymentInformation(createdWallet).build()).destinationMethod(
  WalletPaymentMethod.builder().paymentInformation(createdWallet2).build()).build();

sdk.executeTransaction().trade(executeTradeTransaction);
```
```curl
curl --location 'https://api.staging.fiant.io/v1/transactions/trade' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'x-pti-signature: eyJraWQiOiJ5bUJhUlBqSGlfQzVwcldHWGFhaVNwYV91cFZjZVpzWUJRSGR6S083N2NjIiwiY2lkIjoiOTg1N2VmOTAtMjJmNy00OTA0LTkwODUtZGY3NmVjYmNlNTljIiwiYWxnIjoiUlM1MTIifQ.UE9TVAoxQkJGMTJDQ0JGM0VEQjVDNTU0NTZCQzNERTNBRTgyMjQ5REEzNUNFRUFFNDBEMjVCREI4Qjg1MDQ3NjYwNzc0CmNvbnRlbnQtdHlwZTphcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04CmRhdGU6TW9uLCAxOCBOb3YgMjAyNCAyMToyNDo1NiBHTVQKeC1wdGktY2xpZW50LWlkOjk4NTdlZjkwLTIyZjctNDkwNC05MDg1LWRmNzZlY2JjZTU5YwovdjEvdXNlcnMvJTdCJTdCdXNlcjQtaWQlN0QlN0QvcGF5bWVudC1pbmZvcm1hdGlvbg.pKg0OstNq-e61IP0Uoq-VnUp-3XjYyd-G8zu6WXba2xlEvCK8GalJWCmKwPf4spXz2d8EQ75rCP897bymGaqp5JFqkUyOCypFl1a5gUGoG6r_2BWW1JaPJEr2qUoaJevn6iKoGTaBCmD07GJIANjB17c5KE2I5m2SRUQUDuwMlDCMwjF6gMxCswA0Gz2bLUyCE2tCfUn2OqRcGR-1cj1t3zy4etJohZ5ajOMKMLiz3zT1m4n_ghcGlwAveq9iA5orU7dXmbT5Izuf8nf7faCv8UmSynfc4Zr-XCfyIeW2DvEdY6wLOXqA3NcJIhtDE3sFMb0ltMfAVJx3Dbaet_TQLuOaBwUoaVpNQRge464UkZHw7UoQdVv5OwMoJPr3r1BBv06q0k6S7wupfUFr6Zq5cmPjNA75nD5LnxocI761qIOpEZCe7-Z6mrcRThm_BwuwLAGGlImPzHjUKN6L1E4aVPKDJBOyzEUsph1EYR9Zwqk6kMdxfWyHqVCJJ1yj4OU4JZJ-u5M2cEJwoMdwgQHZ2SBLHpxREVoWUDAQSFOIFFLALSxTNVqOobDIkbR-jtRA3shzAKiT5gENSYjsnLWmb25KrzAZtasLzSU5-FTLcctnsznP3n5fR6rhE_lAf673lRFhU4mauS-QO-WxkGneMvcCJo2VNR77TV7aEF8e7Q' \
--header 'x-pti-request-id: 2f8128ae-0148-4345-ae0a-c376e083d538' \
--header 'x-pti-scenario-id: acme_trade' \
--header 'Content-Type: application/json; charset=utf-8' \
--data '{
    "initiator": {
        "id": "5tdqs6b4uuceqi-aigtg5o1og23zafbwil7kba8lq3iaxk2bibas5ms3smr9f1awsay0cat1an-8spmyn649j3ni0ewv6gfv7vv",
        "type": "PERSON"
    },
    "sourceTransferMethod": {
        "paymentMethodType": "WALLET",
        "paymentInformation": {
            "type": "WALLET",
            "walletId": "1ede814a-a698-44ba-9050-da23e99de7ee"
        }
    },
    "destinationTransferMethod": {
        "paymentMethodType": "WALLET",
        "paymentInformation": {
            "type": "WALLET",
            "walletId": "999e814a-a698-44ba-9050-da23e99de7ee"
        }
    },
    "amount": 100,
    "date": "2024-11-18T21:24:56+00:00",
    "type": "TRADE"
}'
```

#### Receive Webhook
```json
{
  "resourceType": "TRANSACTION_STATUS",
  "requestId": "REQUEST_ID",
  "clientId": "CLIENT_ID",
  "userId": "USER_ID",
  "status": "SETTLED",
  "date": "TRANSACTION_DATE",
  "additionalInfos":{
    "destinationCurrencyAmount":0.0004,
    "avgFillPrice":100000
  },
  "amount": 100,
  "currency": "USD",
  "transactionType": "TRADE",
  "paymentMethod": "WALLET",
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

#### Check Wallet Balances
```java
sdk.wallets().getWallet(person.getId(), createdWallet.getWalletId().get()).
  getBalance().get();//0.00
sdk.wallets().getWallet(person.getId(), createdWallet2.getWalletId().get()).
  getBalance().get();//Amount of bitcoin you get
```
```curl
curl --location --request GET 'https://api.staging.fiant.io/v1/users/5tdqs6b4uuceqi-aigtg5o1og23zafbwil7kba8lq3iaxk2bibas5ms3smr9f1awsay0cat1an-8spmyn649j3ni0ewv6gfv7vv/wallets/1ede814a-a698-44ba-9050-da23e99de7ee' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'Date;' \
--header 'x-pti-signature;' \
--data '{}'

curl --location --request GET 'https://api.staging.fiant.io/v1/users/5tdqs6b4uuceqi-aigtg5o1og23zafbwil7kba8lq3iaxk2bibas5ms3smr9f1awsay0cat1an-8spmyn649j3ni0ewv6gfv7vv/wallets/999e814a-a698-44ba-9050-da23e99de7ee' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'Date;' \
--header 'x-pti-signature;' \
--data '{}'
```