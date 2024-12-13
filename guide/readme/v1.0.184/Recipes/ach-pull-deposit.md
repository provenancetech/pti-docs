### Wire Deposit
#### Create Wallet
```java
Person person = Person.builder().id(UUID.randomUUID().toString()).name(Name.builder().
	lastName("Doe").firstName("John").build()).build();

sdk.collectUserData().addAUser(OneOfUserSubTypes.person(person));
WalletCreation wallet =  WalletCreation.builder().currency(CurrencyEnum.USD).label("My USD Wallet").walletId(UUID.randomUUID().toString()).build();

Wallet createdWallet = sdk.wallets().createWallet(person.getId(), wallet);
```

```curl
curl --location 'https://api.staging.fiant.io/v1/users/5tdqs6b4uuceqi-aigtg5o1og23zafbwil7kba8lq3iaxk2bibas5ms3smr9f1awsay0cat1an-8spmyn649j3ni0ewv6gfv7vv/wallets' \
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
```

#### Create Virtual Bank Account
```java
sdk.wallets().createWalletVirtualBankAccount(person.getId(), 
	createdWallet.getWalletId().get(), null);
```

```curl
curl --location 'https://api.staging.fiant.io/v1/users/5tdqs6b4uuceqi-aigtg5o1og23zafbwil7kba8lq3iaxk2bibas5ms3smr9f1awsay0cat1an-8spmyn649j3ni0ewv6gfv7vv/wallets/1ede814a-a698-44ba-9050-da23e99de7ee/virtual-bank-account' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'Date;' \
--header 'x-pti-signature;' \
--data '{}'
```
#### Ach Pull

```java                      
updatedWallet.getDepositInstruction().get(); //Bank account details

BankAccountPaymentInformation bankAccountPaymentInformation = BankAccountPaymentInformation.builder().
        bankAccountType(BankAccountPaymentInformationBankAccountType.CHECKING).accountBankName("Acme Bank").
        bankAccountNumber("123456789").bankRoutingNumber("123456789").bankRoutingCheckDigit("0").build();

AchPaymentMethod achPaymentMethod = AchPaymentMethod.builder().
        paymentInformation(OneOfFiatPaymentInformation.bankAccount(bankAccountPaymentInformation)).build();

ExecuteDepositTransaction executeDepositTransaction = ExecuteDepositTransaction.builder().
        type(TransactionTypeEnum.DEPOSIT).amount(100.00).date(new Date().toString()).
        initiator(OneOfUserSubTypes.person(person)).ptiRequestId(UUID.randomUUID().toString()).
        ptiScenarioId("acme_deposit").sourceMethod(OneOfExternalPaymentMethod.ach(achPaymentMethod)).
        destinationMethod(WalletPaymentMethod.builder().paymentInformation(updatedWallet).build()).build();

sdk.executeTransaction().deposit(executeDepositTransaction);
```
```curl     
curl --location 'https://api.staging.fiant.io/v1/transactions/deposits' \
--header 'x-pti-request-id;' \
--header 'x-pti-scenario-id: acme_deposit' \
--header 'x-pti-session-id;' \
--header 'x-pti-disable-webhook: <boolean>' \
--header 'x-pti-provider-name: -dixilNUh8LblPEX59f_0xftwwn7QgQKSMA-D' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'Date;' \
--header 'x-pti-signature;' \
--data '{
    "initiator": {
        "id": "5tdqs6b4uuceqi-aigtg5o1og23zafbwil7kba8lq3iaxk2bibas5ms3smr9f1awsay0cat1an-8spmyn649j3ni0ewv6gfv7vv",
        "type": "PERSON"
    },
    "sourceMethod": {
        "paymentInformation": {
            "type": "BANK_ACCOUNT",
            "bankAccountNumber": "123456789",
            "accountBankName": "Acme Bank",
            "bankRoutingNumber": "123456789",
            "bankRoutingCheckDigit": "0"
        },
        "paymentMethodType": "ACH"
    },
    "destinationMethod": {
        "paymentMethodType": "WALLET",
        "paymentInformation": {
            "type": "WALLET",
            "walletId": "1ede814a-a698-44ba-9050-da23e99de7ee"
        }
    },
    "date": "2024-11-18T21:24:56+00:00",
    "amount": 100,
    "type": "DEPOSIT"
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
  "transactionType": "DEPOSIT",
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

#### Check Wallet Balance
```java
sdk.wallets().getWallet(person.getId(), 
	createdWallet.getWalletId().get()).getBalance().get();//100.00
```

```curl
curl --location --request GET 'https://api.staging.fiant.io/v1/users/5tdqs6b4uuceqi-aigtg5o1og23zafbwil7kba8lq3iaxk2bibas5ms3smr9f1awsay0cat1an-8spmyn649j3ni0ewv6gfv7vv/wallets/1ede814a-a698-44ba-9050-da23e99de7ee' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'Date;' \
--header 'x-pti-signature;' \
--data '{}'
```