# Fiant infrastructure use-cases

## Using Platform SDKs
https://github.com/provenancetech/pti-platform-sdks

## User management
Fiant enables you to manage your user base with us enabling you to initiate regulated activities on their behalf
### 1.Create a user
```java
Person person = Person.builder().id("userId").name(Name.builder()
        .firstName("John").lastName("Smith")
        .build()).build();
sdk.collectUserData().addAUser(OneOfUserSubTypes.person(person));
```
### 2.Add user information
```java
Person person = Person.builder().id("userId").emails(List.of(Email.builder().address("john.smith@hotmail.com").build())).piis(
        List.of(OneOfPiiSubTypes.of(Ssn.builder().value("416-14-5209").build()))).build();
sdk.collectUserData().mergeUserInfo(OneOfUserSubTypes.person(person));
```
### 3.Register some payment information(Bank, Crypto)
You can register your users payment information via our API, or you can use our [elements](quickstart-elements.md) to do so, you absolutely need to use the element for credit cards.
You can use the payment information id to perform operations afterward.
```java
BankAccountPaymentInformation bankAccountPaymentInformation = testContext.wrapSDKCall((sdk) -> {
        sdk.collectUserData().addUserPaymentInformation("userId", OneOfExternalPaymentInformation.bankAccount(BankAccountPaymentInformation.builder().
        bankAccountNumber("1234567890").accountBankName("Acme Bank").bankRoutingNumber("026009593").bankRoutingCheckDigit("9").
        bankAccountType(BankAccountPaymentInformationBankAccountType.CHECKING).build())).getBankAccount().get();
```
## Initiating user assessment
Fiant provides drop in [elements](quickstart-elements.md) for you to perform user assessment, however, we also allow the usage of custom client forms.
### 1.Perform user assessment
```java
Person person = Person.builder().id("userId").
        dateOfBirth("1988-12-12").addresses(List.of(Address.builder().
                        streetAddress("1, main street").city("New York").stateCode("US-NY").
                        postalCode("10001").country("US").build()));
sdk.userAssessment().startUserAssessment(StartUserAssessmentRequest.builder().ptiRequestId("1234").
        ptiScenarioId("acme_deposit").body(KycRequest.person(person)).build());
```
### 2.Receive assessment webhook
Please refer to the [webhooks](quickstart-receiving-webhooks.md) guide to learn how to receive a webhook.
```json
{
    "resourceType": "USER_ASSESSMENT",
    "clientId": "4121df47-7a05-4b42-9db3-d1ff8a29abf0",
    "userId": "5121df47-7a05-4b42-9db3-d1ff8a29abf0",
    "requestId": "3121df47-7a05-4b42-9db3-d1ff8a29abf0",
    "assessment": "REFUSED",
    "tier": 1,
    "date": "2021-09-01T00:00:00.000Z",
    "refusalReason": "FRAUD_SUSPICION"
}
```
### 3.Get user assessment status
```java
UserAssessStatusObject userAssessStatusObject = sdk.userAssessment().getLastKyc("userId");
System.out.println(userAssessStatusObject.getAssessment().get()); // prints "REFUSED"
System.out.println(userAssessStatusObject.getRefusalReason().get()); //prints "SANCTION_SCREENING"
```
## Deposit some funds to custodial account
### 1.Create user wallet(USD)
```java
sdk.wallets().createWallet("userId", WalletCreation.builder().currency(CurrencyEnum.USD).
        walletId("287a78cc-a887-4021-9bd6-bb1854cc82a8").label("myUsdWallet").build());
```
### 2.Create deposit instruction(USD)
```java
sdk.wallets().createWalletVirtualBankAccount("userId", "287a78cc-a887-4021-9bd6-bb1854cc82a8");
```
### 3.User sends funds via ACH
User uses the deposit instructions and sends USD via his financial institution.

### 4.Receive webhook confirming the deposit
```json
{
  "resourceType": "TRANSACTION_STATUS",
  "clientId": "clientId",
  "userId": "userId",
  "requestId": "3121df47-7a05-4b42-9db3-d1ff8a29abf0",
  "status": "SETTLED",
  "date": "2024-09-01T00:00:00.000Z",
  "amount": 100.01,
  "currency": "USD",
  "transactionType": "DEPOSIT",
  "meta": {
    "transactionId": "3121df47-7a05-4b42-9db3-d1ff8a29abf0"
  },
  "total": {
    "fee": {
      "amount": 0.01,
      "currency": "USD"
    },
    "total": {
      "amount": 100.01,
      "currency": "USD"
    },
    "subtotal": {
      "amount": 100,
      "currency": "USD"
    }
  }
}
```
### 5.Check wallet balance
```java
Wallet wallet = sdk.wallets().getWallet("userId", "287a78cc-a887-4021-9bd6-bb1854cc82a8");
System.out.println(wallet.getBalance()); // // prints "100"
```

## Trading currencies
### 1.Create crypto wallet
```java
sdk.wallets().createWallet("userId", WalletCreation.builder().currency(CurrencyEnum.BTC).
        walletId("3aca65e0-9359-4490-9e4c-803daab5de1b").label("myBTCWallet").build());
```        
### 2.Trade USD to BTC
```java
WalletPaymentMethod source = WalletPaymentMethod.builder().paymentInformation(Wallet.builder().walletId("287a78cc-a887-4021-9bd6-bb1854cc82a8").build()).build();

WalletPaymentMethod destination = WalletPaymentMethod.builder().paymentInformation(Wallet.builder().walletId("3aca65e0-9359-4490-9e4c-803daab5de1b").build()).build();

ExecuteTradeTransaction tradeTransaction = ExecuteTradeTransaction.builder().type(TransactionTypeEnum.TRADE).usdValue(100).amount(100).
    date(DateTime.now().toString()).initiator(initiator).ptiRequestId(UUID.randomUUID().toString()).
    ptiScenarioId("acme_trade").sourceMethod(source).destinationMethod(destination).build();
``` 

### 3.Collecting fees(Optional)
Fiant is able to collect fees on your behalf.
If we take again the previous example, but we add a fee that will be collected to the "client_fees" wallet, that belongs to your root user "00000000-00000000-00000000-00000000"

```java
Cost total = Cost.builder().amount(50.01).currency(CurrencyEnum.USD.toString()).build();
Cost subtotal = Cost.builder().amount(50.00).currency(CurrencyEnum.USD.toString()).build();
Cost fee = Cost.builder().amount(0.01).currency(CurrencyEnum.USD.toString()).build();
Total transactionTotal = Total.builder().total(total).subtotal(subtotal).fee(fee).build();

ExecuteTradeTransaction tradeTransaction = ExecuteTradeTransaction.builder().type(TransactionTypeEnum.TRADE).usdValue(100).amount(50.01).
        date(DateTime.now().toString()).initiator(initiator).ptiRequestId(UUID.randomUUID().toString()).
        ptiScenarioId("acme_trade").sourceMethod(source).destinationMethod(destination).transactionTotal(transactionTotal).build();
```                     

### 4.Receive webhook confirming the trade
```json
{
    "resourceType":"TRANSACTION_STATUS",
    "requestId":"REQUEST_ID",
    "clientId":"CLIENT_ID",
    "userId":"USER_ID",
    "status":"SETTLED",
    "date":"TRANSACTION_DATE",
    "amount":"50.01",
    "fees": "0.01",
    "currency":"USD",
    "transactionType":"TRADE",
    "additionalInfos": {
      "avgFillPrice": "101000.87"
    },
    "total": {
      "subTotal": {
        "amount": 50,
        "currency": "USD"
      },
      "fee": {
        "amount": 0.01,
        "currency": "USD"
      },
      "total": {
        "amount": 50.01,
        "currency": "CURRENCY"
      }
    }
      
}
```


### 5.Check wallets balances
```java
sdk.wallets().getWallet("00000000-00000000-00000000-00000000", "client_fees").getBalance().get(); // 0.01
sdk.wallets().getWallet("userId", "287a78cc-a887-4021-9bd6-bb1854cc82a8").getBalance().get(); // 0
sdk.wallets().getWallet("userId", "3aca65e0-9359-4490-9e4c-803daab5de1b").getBalance().get(); // X amount of bitcoins
``` 

## Transacting digital assets
Fiant can manage your marketplace to power your digital economy. 
You can perform buy/sell operations and track ownership of digital assets that resides in your system.
### 1.Create a digital asset
```java
DigitalItem digitalItem = DigitalItem.builder().itemReference(UUID.randomUUID().toString())
        .itemTitle("Acme playing card #1234")
        .itemDescription("Super powerful").digitalItemType(DigitalItemType.NFT).itemUsdValue(100.0).build();
sdk.marketplace().createDigitalItems("userId", List.of(digitalItem));
``` 
### 2.Buy Operation
```java
String transactionGroupId = UUID.randomUUID().toString();
WalletPaymentMethod source = WalletPaymentMethod.builder().
        paymentInformation(Wallet.builder().walletId(usdWallet.getWalletId()).
                build()).build();
ExecuteBuyTransaction executeBuyTransaction = ExecuteBuyTransaction.builder().type(TransactionTypeEnum.BUY).
        usdValue(100.00).amount(100.00).date(new Date().toString()).initiator(buyer).
        ptiRequestId(UUID.randomUUID().toString()).ptiScenarioId("acme_buy").
        sourceMethod(OneOfPaymentMethod.wallet(source)).seller(seller).digitalItem(digitalItem).transactionGroupId(transactionGroupId).build();

sdk.marketplace().digitalItemBuy(executeBuyTransaction);
``` 
### 3.Sell Operation
```java
WalletPaymentMethod destination = WalletPaymentMethod.builder().
        paymentInformation(Wallet.builder().walletId(sellerWallet.getWalletId()).build()).build();

Total total = Total.builder().total(Cost.builder().amount(100.00).currency(CurrencyEnum.USD.toString()).build()).
        subtotal(Cost.builder().amount(98.00).currency(CurrencyEnum.USD.toString()).build()).
        fee(Cost.builder().amount(2.00).currency(CurrencyEnum.USD.toString()).build()).build();

ExecuteSellTransaction executeSellTransaction = ExecuteSellTransaction.builder().type(TransactionTypeEnum.SELL).
        usdValue(98.00).amount(100.00).date(new Date().toString()).initiator(seller).
        ptiRequestId(UUID.randomUUID().toString()).ptiScenarioId("acme_sell").
        destinationMethod(OneOfPaymentMethod.wallet(destination)).buyer(buyer).digitalItem(digitalItem).
        transactionTotal(total).transactionGroupId(transactionGroupId).digitalItem(digitalItem).build();
``` 
### 4.Collect commissions(Optional)
Fiant has the ability to collect commissions on behalf of your users.
```java
FeeRecipient feeRecipient = FeeRecipient.builder().feeRecipientId("creator_user_id").
         walletId("creator_comission_wallet_id").currency("USD").
         amount(10.0).feeRecipientType(FeeRecipientFeeRecipientType.COMMISSION).build();
            
ExecuteSellTransaction executeSellTransaction = ExecuteSellTransaction.builder().type(TransactionTypeEnum.SELL).
        usdValue(98.00).amount(100.00).date(new Date().toString()).initiator(seller).
        ptiRequestId(UUID.randomUUID().toString()).ptiScenarioId("acme_sell").
        destinationMethod(OneOfPaymentMethod.wallet(destination)).buyer(buyer).digitalItem(digitalItem).
        transactionTotal(total).transactionGroupId(transactionGroupId).digitalItem(digitalItem).
        feeRecipients(List.of(feeRecipient)).build();
```                   

### 5.Check fee recipient and seller wallet balance
```java
sdk.wallets().getWallet("creator_user_id", "creator_comission_wallet_id").getBalance().get();//2.00
sdk.wallets().getWallet(seller.getPerson().get().getId(), sellerWallet.getWalletId()).getBalance().get();//96.00
sdk.wallets().getWallet("00000000-00000000-00000000-00000000", "client_fees").getBalance().get(); // 2.00
``` 
### 6.Check buyer digital asset
```java
sdk.marketplace().getDigitalItems(buyer.getPerson().get().getId());//[{your digital item}]
``` 

## Transfer funds between users
### 1.Create recipient's wallet
```java
Wallet wallet = sdk.wallets().createWallet("userId", WalletCreation.builder().
	currency(CurrencyEnum.USD).walletId(UUID.randomUUID().toString()).build());

Wallet wallet2 = sdk.wallets().createWallet("userId2", WalletCreation.builder().
	currency(CurrencyEnum.USD).walletId(UUID.randomUUID().toString()).build());
``` 
### 2.Perform transfer and collect fees(Optional)
Fiant is able to collect fees on your behalf.
```java
WalletPaymentMethod sourceWallet = WalletPaymentMethod.builder().
    paymentInformation(Wallet.builder().walletId(wallet.getWalletId()).
    build()).build();

WalletPaymentMethod destinationWallet = WalletPaymentMethod.builder().
    paymentInformation(Wallet.builder().walletId(wallet2.getWalletId()).
    build()).build();


Total transferTotal = Total.builder().total(Cost.builder().amount(1.0).
  currency(CurrencyEnum.BTC.toString()).build()).
  subtotal(Cost.builder().amount(0.999).currency(CurrencyEnum.BTC.toString()).build()).
  fee(Cost.builder().amount(0.001).currency(CurrencyEnum.USD.toString()).build()).build();

ExecuteTransferTransaction executeTransferTransaction = ExecuteTransferTransaction.
  builder().type(TransactionTypeEnum.TRANSFER).
  usdValue(100000.00).amount(0.999).date(new Date().toString()).initiator(initiator).
  ptiRequestId(UUID.randomUUID().toString()).ptiScenarioId("acme_transfer").
  sourceTransferMethod(sourceWallet).destinationTransferMethod(destinationWallet).
  destination(receiver).transactionTotal(transferTotal).build();

sdk.executeTransaction().transfer(executeTransferTransaction);
``` 
### 3.Receive webhook confirming the transfer 
```json
{
  "resourceType": "TRANSACTION_STATUS",
  "requestId": "REQUEST_ID",
  "clientId": "CLIENT_ID",
  "userId": "userId",
  "status": "SETTLED",
  "date": "TRANSACTION_DATE",
  "amount": "0.999",
  "fees": "0.001",
  "currency": "BTC",
  "transactionType": "TRANSFER",
  "paymentMethod": "WALLET",
  "total": {
    "subTotal": {
      "amount": 0.999,
      "currency": "BTC"
    },
    "fee": {
      "amount": 0.001,
      "currency": "BTC"
    },
    "total": {
      "amount": 1,
      "currency": "BTC"
    }
  }
}
```
### 4.Check wallet balances
```java
sdk.wallets().getWallet("userId1", sourceWallet.getPaymentInformation().get().getWalletId().get()); // 0
sdk.wallets().getWallet("userId2", destinationWallet.getPaymentInformation().get().getWalletId().get()); // 0.999
sdk.wallets().getWallet("00000000-00000000-00000000-00000000", "client_fees").getBalance().get(); // 0.001
``` 
## Withdrawing funds
### 1.Withdrawal operation(USD)
```java
BankAccountPaymentInformation destinationBankAccount = BankAccountPaymentInformation.builder().bankAccountType(BankAccountPaymentInformationBankAccountType.CHECKING).
        bankAccountNumber("1234567890").accountBankName("Acme Bank").bankRoutingNumber("026009593").bankRoutingCheckDigit("9").build();           
OneOfExternalPaymentMethod destinationPaymentMethod =  OneOfExternalPaymentMethod.ach(AchPaymentMethod.builder().paymentInformation(
        OneOfFiatPaymentInformation.bankAccount(destinationBankAccount)).build());
WalletPaymentMethod walletPaymentMethod = WalletPaymentMethod.builder().paymentInformation(Wallet.builder().walletId(usdWallet.getWalletId()).build()).build(); 

ExecuteWithdrawalTransaction executeWithdrawalTransaction = ExecuteWithdrawalTransaction.builder().type(TransactionTypeEnum.WITHDRAWAL).
        usdValue(100.55).amount(100.00).date(new Date().toString()).initiator(initiator).
        ptiRequestId(UUID.randomUUID().toString()).ptiScenarioId("acme_withdrawal").
        destinationMethod(destinationPaymentMethod).sourceMethod(walletPaymentMethod).transactionTotal(transferTotal).build();
```       
### 2.Withdrawal operation(Crypto)
```java
WalletPaymentMethod cryptoWalletPaymentMethod = WalletPaymentMethod.builder().paymentInformation(Wallet.builder().walletId(cryptoWallet.getWalletId()).build()).build();

CryptoPaymentInformation destinationCryptoWalletPI = CryptoPaymentInformation.builder().walletAddress("0x71C7656EC7ab88b098defB751B7401B5f6d8976F").currency("ETH").network("Ethereum").build();

OneOfExternalPaymentMethod destinationCryptoWallet = OneOfExternalPaymentMethod.crypto(CryptoPaymentMethod.builder().
        paymentInformation(destinationCryptoWalletPI).build());

ExecuteWithdrawalTransaction executeWithdrawalTransaction = ExecuteWithdrawalTransaction.builder().type(TransactionTypeEnum.WITHDRAWAL).
        usdValue(100.55).amount(100.00).date(new Date().toString()).initiator(initiator).
        ptiRequestId(UUID.randomUUID().toString()).ptiScenarioId("acme_withdrawal").
        destinationMethod(destinationCryptoWallet).sourceMethod(cryptoWalletPaymentMethod).transactionTotal(transferTotal).build();
```