## PTI API Reference

You can find the PTI API Reference [here](https://provenancetech.github.io/pti-docs/api/v0/) which shows all the available endpoints and detailed schemas.

## Creating PTI Users

Prior to doing any actions on the API, you must define your users on the PTI system using the [create user](https://provenancetech.github.io/pti-docs/api/v0/#/default/post_users) API call. 
We recommend that you create the PTI user that the same time you create the user on your side.
It could also be done the first time they need to interact with PTI.
In any case, you will need to pass a unique UUID of your choice as the value of the `id` field in the body of the request.
You need to store this `id` and associate it to the user in your system as it will be needed for most of the API calls you will make to PTI.
We will refer to this user `id` as `USER_ID` in the rest of the documentation.

## Initiating a KYC

Once a user exists on the PTI platform, you can initiate a KYC check for that user. To do so, call the [start KYC endpoint](https://provenancetech.github.io/pti-docs/api/v0/index.html#/default/post_users__userId__kyc) 
using the user `USER_ID` you passed in the [create user](https://provenancetech.github.io/pti-docs/api/v0/#/default/post_users) API call. You must also provide a `REQUEST_ID` that you must store
to be able to correlate the webhook [KYC result](#kyc-result) to this specific KYC check.

## Checking if a KYC is required

Instead of trying to log a transaction and getting a `DENY` status because the user has not successfully completed the appropriate KYC check, you can call the [is KYC needed endpoint](https://provenancetech.github.io/pti-docs/api/v0/#/default/get_users__userId__kyc_needed)
with the desired `SCENARIO_ID` and amount of the transaction in USD. The response will be a boolean that informs you if your user should be directed to a KYC check before moving on to performing the transaction itself.


## Monitoring Transactions

Once your user has successfully passed a KYC check, you can start logging the transactions that user makes. To do so, you need to call the [log transaction endpoint](https://provenancetech.github.io/pti-docs/api/v0/index.html#/default/post_users__userId__transactionLogs).
Again, you will need the `USER_ID` of the user originating the transaction. You must also provide a `REQUEST_ID` that you must store
to be able to correlate the webhook [transaction monitoring result](#transaction-monitoring-result) to this specific transaction.

To ensure compliance, you **MUST** base your decision to proceed with the transaction only if the [transaction monitoring result](#transaction-monitoring-result) status returned is `ACCEPT`.

To complete the transaction cycle, you should provide a feedback on the transaction once it is finalized on your side using the [transaction feedback endpoint](https://provenancetech.github.io/pti-docs/api/v0/index.html#/default/post_transactions__requestId__feedback)
You need to use the same `REQUEST_ID` you used in the log transaction API call.


## Webhooks

Most operations on the PTI API will result in asynchronous responses which will be sent to the webhook URL you provided during the [onboarding](onboarding.md).
The content posted on your webhook is encrypted using your public key, and signed using PTI's private key.
You have to decrypt the message using your private key, and verify that the message originated from PTI by validating the signature using PTI's public key.
This mechanism insures that nobody but you can have access to the content of those messages, even if your webhook was hijacked, and you can always be sure 
that the message originated from PTI by validating the signature of the message.
The PTI public key used for signing webhook payloads can be found [here](https://github.com/provenancetech/pti-docs/blob/master/utils/pti-prod-public.jwk)
Example code that shows you how to handle webhook requests can be found [here](https://github.com/provenancetech/pti-docs/blob/master/examples/webhook-server/python/webhook_server.py).

Most webhook requests will originate form an API call you made, but it may not always be the case. For example, we may have gathered some new information about one of your users that 
allowed us to increase the level of KYC for that user. When this happens, we send you that information by posting a [KYC result](#kyc-result) on your webhook.


### Webhook Responses definitions

This section provides the details on the possible messages that you can receive on your webhook endpoint.

* [User Status Update](#user-status-update)
* [KYC Result](#kyc-result)
* [Transaction Monitoring Result](#transaction-monitoring-result)
* [Payment Processing Update](#payment-processing-update)

#### User Status Update

```json
{
  "resourceType":"USER",
    "clientId":"CLIENT_ID",
    "userId":"USER_ID",
    "status":"ACTIVE | INACTIVE | BLOCKED",
    "statusReason": "STATUS_REASON"
}
```
The `CLIENT_ID` value will be set to the Client ID provided to you during [onboarding](onboarding.md)

The `USER_ID` corresponds to the user for which we are providing the status udate.

Here is the meaning of the possible statuses:

 * `ACTIVE`: This is the status of a normal and valid user for which it is possible to initiate KYCs or be involved in transactions.
 * `INACTIVE`: This is the status of a user that is within our systems for tracking purposes, but it is not possible to involve inactive users in transactions or initiate KYCs on them.
 * `BLOCKED`: This is the status of a user that was blocked by PTI for security and compliance reasons. it is not possible to involve blocked users in transactions or initiate KYCs on them.

Only PTI personnel can modify the status of a user.

The `STATUS_REASON` value will provide more details on the reason why the status field is at the value provided.


#### KYC Result

```json
{
    "resourceType":"KYC",
    "requestId":"REQUEST_ID",
    "clientId":"CLIENT_ID",
    "userId":"USER_ID",
    "status":"ACCEPTED | REFUSED | UNDER_REVIEW | ERROR | PENDING | REQUESTED_MORE_INFORMATION",
    "tier": "KYC_TIER",
    "refusalReason": "REFUSAL_REASON"
  
}
```
The `REQUEST_ID` value will be set to the value you provided when you [initiated the KYC](#initiating-a-kyc)

The `USER_ID` corresponds to the user for which we are providing the KYC status and tier.

Typically, you will receive 2 KYC result messages per KYC. The first one will have a `PENDING` status and the second one will be `ACCEPTED` or `REFUSED`.
A status of `REFUSED` means that your user has failed the KYC check and you should not allow transactions for that user. A status of `UNDER_REVIEW` means that a
compliance agent at PTI is analysing the information provided by your user and you should wait for the `ACCEPTED` status before allowing your user to perform
transactions.


#### Transaction Monitoring Result

```json
{
    "resourceType":"TRANSACTION_MONITORING",
    "requestId":"REQUEST_ID",
    "clientId":"CLIENT_ID",
    "userId":"USER_ID",
    "status":"ACCEPT | MANUAL_REVIEW | DENY | ERROR | PENDING",
    "transactionDate":"TRANSACTION_DATE",
    "amount":"TRANSACTION_AMOUNT",
    "transactionType":"FUNDING | WITHDRAWAL | TRANSFER",
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

#### Payment processing update

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
    "transactionType":"FUNDING",
    "paymentMethod":"PAYPAL | TOKEN | BANK_ACCOUNT | ENCRYPTED_CREDIT_CARD",
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

The `REQUEST_ID` value will be set to the value you provided when you performed the [fiat funding call](https://provenancetech.github.io/pti-docs/api/v0/#/default/post_users__userId__transactions_fiat_funding)

The `USER_ID` corresponds to the user who initiated the funding request.

You will receive multiple payment processing result messages. The first one will have a `PENDING` status will be followed by `AUTHORISZED` and `SETTLED` in the normal case.
A status of `REFUSED` means that the payment processor did not accept the transaction. The `transactionStatusDetail` field contains more details about the reason for the refusal.

The `TRANSACTION_DATE` will come in the form of an ISO 8601 compliant date string.


## Status codes and Errors

PTI uses conventional HTTP response codes to indicate the success or failure of an API request. 
In general, codes in the 2xx range indicate success. Codes in the 4xx range indicate an error. 
Codes in the 5xx range indicate an error with PTI servers (these are rare and should not happen).

The following table details the meaning of the various codes that can be returned by the API:

| Code | Short        | Description                                                                                                                                          |
|------|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| 200  | OK           | Everything worked as expected.                                                                                                                       |
| 201  | Created      | The request has been fulfilled and has resulted in one or more new resources being created.                                                          |
| 202  | Accepted     | The request has been accepted for processing, but the processing has not been completed. You *might* get a response back on your Webhook eventually. |
| 400  | Bad Request  | The request was unacceptable, often due to missing a required parameter.                                                                             |
| 401  | Unauthorized | No valid Signature or Token provided.                                                                                                                |
| 402  | Request Failed | The parameters were valid but the request failed.                                                                                                    |
| 403  | Forbidden | The Client or the Token doesn't have permissions to perform the request.                                                                             |
| 404  | Not Found | The requested resource doesn't exist.                                                                                                                |
| 409  | Conflict | The request conflicts with another request (perhaps due to using the same `REQUEST ID` twice).                                                       |
| 429  | Too Many Requests | Too many requests hit the API too quickly. We recommend an exponential backoff of your requests.                                                     |
| 5xx  | Server Errors | 	Something went wrong on PTI servers. (These are rare and should not happen)                                                                         |
