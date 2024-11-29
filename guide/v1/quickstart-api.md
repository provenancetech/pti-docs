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
sdk.collectUserData().addUserPaymentInformation("userId", OneOfExternalPaymentInformation.bankAccount(BankAccountPaymentInformation.builder().
        bankAccountNumber("1234567890").accountBankName("Acme Bank").bankRoutingNumber("026009593").bankRoutingCheckDigit("9").
        bankAccountType(BankAccountPaymentInformationBankAccountType.CHECKING).build()));
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
### 2.Trade USD to BTC
### 3.Collecting fees
Fiant is able to collect fees on your behalf.
### 4.Receive webhook confirming the trade
### 5.Check wallets balances

## Transacting digital assets
### 1.Create a digital asset
### 2.Buy Operation
### 3.Sell Operation
### 4.Collect commissions
Fiant has the ability to collect commissions on behalf of your users.
### 5.Check recipient wallet balance
### 6.Check buyer digital asset

## Transfer funds between users
### 1.Create recipient's wallet
### 2.Collecting fees
Fiant is able to collect fees on your behalf.
### 3.Receive webhook confirming the transfer 

## Withdrawing some funds
### 1.Withdrawal operation(USD)
### 2.Withdrawal operation(Crypto)