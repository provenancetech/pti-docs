# Fiant infrastructure use-cases

## User management
Fiant enables you to manage your user base with us enabling you to initiate regulated activities on their behalf
### 1.Create a user
```java

```
### 2.Add user information
```java

```
### 3.Register some payment information(Bank, Crypto)
You can register your users payment information via our API, or you can use our <a>elements</a> to do so, you absolutely need to use the element for credit cards.
You can use the payment information id to perform operations afterward.
```java

```
## Initiating user assessment
Fiant provides drop in <a>elements</a> for you to perform user assessment, however, we also allow the usage of custom client forms.
### 1.Perform user assessment
```java

```
### 2.Receive assessment webhook
Please refer to the <a>webhook</a> guide to learn how to receive a webhook.
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

```
## Deposit some funds to custodial account
### 1.Create user wallet
```java

```
### 2.Create deposit instruction(USD)
```java

```
### 3.User sends funds via ACH
User uses the deposit instructions and sends USD via his financial institution.
```java

```
### 4.Receive webhook confirming the deposit
```js

```
### 5.Check wallet balance
```java

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