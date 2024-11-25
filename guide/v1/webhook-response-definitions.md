# Webhook Responses definitions

This section provides the details on the possible messages that you can receive on your webhook endpoint.

* [User Status Update](#user-status-update)
* [User assessment Result](#user-assessment-result)
* [Transaction Monitoring Result](#transaction-monitoring-result)
* [Payment Processing Update](#payment-processing-update)

## User Status Update

```json
{
  "resourceType":"USER",
    "clientId":"CLIENT_ID",
    "userId":"USER_ID",
    "status":"ACTIVE | INACTIVE | BLOCKED",
    "statusReason": "STATUS_REASON"
}
```
The `CLIENT_ID` value will be set to the Client ID provided to you during [onboarding](fiant-onboarding)

The `USER_ID` corresponds to the user for which we are providing the status udate.

Here is the meaning of the possible statuses:

 * `ACTIVE`: This is the status of a normal and valid user for which it is possible to initiate KYCs or be involved in transactions.
 * `INACTIVE`: This is the status of a user that is within our systems for tracking purposes, but it is not possible to involve inactive users in transactions or initiate KYCs on them.
 * `BLOCKED`: This is the status of a user that was blocked by Fiant for security and compliance reasons. it is not possible to involve blocked users in transactions or initiate KYCs on them.

Only Fiant personnel can modify the status of a user.

The `STATUS_REASON` value will provide more details on the reason why the status field is at the value provided.


## User assessment Result

```json
{
    "resourceType":"USER_ASSESSMENT",
    "requestId":"REQUEST_ID",
    "clientId":"CLIENT_ID",
    "userId":"USER_ID",
    "status":"ACCEPTED | REFUSED | UNDER_REVIEW | ERROR | PENDING | REQUESTED_MORE_INFORMATION",
    "tier": "KYC_TIER",
    "refusalReason": "REFUSAL_REASON"
  
}
```
The `REQUEST_ID` value will be set to the value you provided when you [initiated the user assessment](#initiating-a-user-assessment)

The `USER_ID` corresponds to the user for which we are providing the KYC status and tier.

Typically, you will receive 2 KYC result messages per KYC. The first one will have a `PENDING` status and the second one will be `ACCEPTED` or `REFUSED`.
A status of `REFUSED` means that your user has failed the KYC check and you should not allow transactions for that user. A status of `UNDER_REVIEW` means that a
compliance agent at PTI is analysing the information provided by your user and you should wait for the `ACCEPTED` status before allowing your user to perform
transactions.


## Transaction Monitoring Result

```json
{
    "resourceType":"TRANSACTION_MONITORING",
    "requestId":"REQUEST_ID",
    "clientId":"CLIENT_ID",
    "userId":"USER_ID",
    "status":"ACCEPT | MANUAL_REVIEW | DENY | ERROR | PENDING",
    "transactionDate":"TRANSACTION_DATE",
    "amount":"TRANSACTION_AMOUNT",
    "transactionType":"DEPOSIT | WITHDRAWAL | TRANSFER | MINT | BUY | SELL",
    "transactionMonitoringResultDetail":{
        "complianceProviderResponseCode" : "FRAUD_SUSPICION | TRANSACTION_VELOCITY_VIOLATION | BLOCKED_JURISDICTION | GEO_FENCING_VIOLATION | SANCTION_SCREENING"
   }
}
```

The `REQUEST_ID` value will be set to the value you provided when you [logged the transaction](#monitoring-transactions)

The `USER_ID` corresponds to the user for which we are providing the transaction status.

Typically, you will receive 2 transaction monitoring result messages per transaction. The first one will have a `PENDING` status and the second one will be `ACCEPT` or `DENY`.
A status of `DENY` means that the transaction is not allowed for that user. A status of `MANUAL_REVIEW` means that a
compliance agent at PTI is analysing the information provided and you should wait for the `ACCEPT` status before finalizing the transaction.

In the case of a `DENY` status, the `complianceProviderResponseCode` will contain more detail on the reason for denial.

The `TRANSACTION_DATE` will come in the form of an ISO 8601 compliant date string. 

## Payment processing update

```json
{
    "resourceType":"PAYMENT_PROCESSOR",
    "requestId":"REQUEST_ID",
    "clientId":"CLIENT_ID",
    "userId":"USER_ID",
    "status":"AUTHORIZED | REFUSED | ERROR | PENDING | CHARGED_BACK | CANCELED | REFUNDED | CAPTURED | SETTLED",
    "date":"TRANSACTION_DATE",
    "amount":"TRANSACTION_AMOUNT",
    "fees": "TRANSACTION_FEES",
    "currency":"TRANSACTION_CURRENCY",
    "transactionType":"DEPOSIT",
    "paymentMethod":"CRYPTO | BANK_ACCOUNT | CREDIT_CARD",
    "additionalInfos": {
        "CreditCardLast4Digits":"XXXX",
        "PaymentProviderTransactionId":"XXXX"
    },
    "transactionStatusDetail": {
        "providerResponseCode": "PTI_TECHNICAL_ERROR | PAYMENT_PROVIDER_TECHNICAL_ERROR | FRAUD_SUSPICION | BLOCKED_COUNTRY | AVS_CHECK_FAILED | CVV_CHECK_FAILED | PAYMENT_INSTRUMENT_PROBLEM | PAYMENT_PROVIDER_DECLINED",
        "providerResponseCategory":"ERROR | SOFT_DECLINE | HARD_DECLINE"
    }
}
```

The `REQUEST_ID` value will be set to the value you provided when you performed the your API call

The `USER_ID` corresponds to the user who initiated the deposit request.

You will receive multiple payment processing result messages. The first one will have a `PENDING` status will be followed by `AUTHORISZED` and `SETTLED` in the normal case.
A status of `REFUSED` means that the payment processor did not accept the transaction. The `transactionStatusDetail` field contains more details about the reason for the refusal.

The `TRANSACTION_DATE` will come in the form of an ISO 8601 compliant date string.