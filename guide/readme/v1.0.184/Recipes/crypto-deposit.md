### Wire Deposit
#### Create Wallet
```java
Person person = Person.builder().id(UUID.randomUUID().toString()).name(Name.builder().
	lastName("Doe").firstName("John").build()).build();

sdk.collectUserData().addAUser(OneOfUserSubTypes.person(person));
WalletCreation wallet =  WalletCreation.builder().currency(CurrencyEnum.USD).label("My USD Wallet").walletId(UUID.randomUUID().toString()).build();

WalletCreation wallet =  WalletCreation.builder().currency(CurrencyEnum.BTC).label("My BTC Wallet").
    network(BlockChainEnum.BITCOIN).walletId(UUID.randomUUID().toString()).build();
    
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
  "network":"BITCOIN",
  "walletId": "1ede814a-a698-44ba-9050-da23e99de7ee",
  "label": "My BTC Wallet"
}'
```

#### Create Deposit Address
```java
Wallet updatedWallet = sdk.wallets().createWalletDepositAddress(person.getId(), createdWallet.getWalletId().get());
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
#### User Sends Crypto
User Sends crypto to the Deposit address
```java
updatedWallet.getDepositInstruction().get(); //Deposit address
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
	createdWallet.getWalletId().get()).getBalance().get();//1
```

```curl
curl --location --request GET 'https://api.staging.fiant.io/v1/users/5tdqs6b4uuceqi-aigtg5o1og23zafbwil7kba8lq3iaxk2bibas5ms3smr9f1awsay0cat1an-8spmyn649j3ni0ewv6gfv7vv/wallets/1ede814a-a698-44ba-9050-da23e99de7ee' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'Date;' \
--header 'x-pti-signature;' \
--data '{}'

curl --location --request GET 'https://api.staging.fiant.io/v1/users/47d564d7-3ab4-42b7-b67a-f9a2321c4711/wallets/999e814a-a698-44ba-9050-da23e99de7ee' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'Date;' \
--header 'x-pti-signature;' \
--data '{}'
```