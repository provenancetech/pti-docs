
## Creating PTI Users

Prior to doing any actions on the API, you must define your users on the PTI system using the [create user](https://provenancetech.github.io/pti-docs/api/v1/#/default/post_users) API call. 
We recommend that you create the PTI user that the same time you create the user on your side.
It could also be done the first time they need to interact with PTI.
In any case, you will need to pass a unique UUID of your choice as the value of the `id` field in the body of the request.
You need to store this `id` and associate it to the user in your system as it will be needed for most of the API calls you will make to PTI.
We will refer to this user `id` as `USER_ID` in the rest of the documentation.

## Initiating a KYC

Once a user exists on the PTI platform, you can initiate a KYC check for that user. To do so, call the [start KYC endpoint](https://provenancetech.github.io/pti-docs/api/v1/index.html#/default/post_users__userId__kyc) 
using the user `USER_ID` you passed in the [create user](https://provenancetech.github.io/pti-docs/api/v1/#/default/post_users) API call. You must also provide a `REQUEST_ID` that you must store
to be able to correlate the webhook [KYC result](#kyc-result) to this specific KYC check.

## Checking if a KYC is required

Instead of trying to log a transaction and getting a `DENY` status because the user has not successfully completed the appropriate KYC check, you can call the [is KYC needed endpoint](https://provenancetech.github.io/pti-docs/api/v1/#/default/get_users__userId__kyc_needed)
with the desired `SCENARIO_ID` and amount of the transaction in USD. The response will be a boolean that informs you if your user should be directed to a KYC check before moving on to performing the transaction itself.


## Monitoring Transactions

Once your user has successfully passed a KYC check, you can start logging the transactions that user makes. To do so, you need to call the [log transaction endpoint](https://provenancetech.github.io/pti-docs/api/v1/index.html#/default/post_users__userId__transactionLogs).
Again, you will need the `USER_ID` of the user originating the transaction. You must also provide a `REQUEST_ID` that you must store
to be able to correlate the webhook [transaction monitoring result](#transaction-monitoring-result) to this specific transaction.

To ensure compliance, you **MUST** base your decision to proceed with the transaction only if the [transaction monitoring result](#transaction-monitoring-result) status returned is `ACCEPT`.

To complete the transaction cycle, you should provide a feedback on the transaction once it is finalized on your side using the [transaction feedback endpoint](https://provenancetech.github.io/pti-docs/api/v1/index.html#/default/post_transactions__requestId__feedback)
You need to use the same `REQUEST_ID` you used in the log transaction API call.


## Webhooks

Most operations on the PTI API will result in asynchronous responses which will be sent to the webhook URL you provided during the [onboarding](fiant-onboarding).
The content posted on your webhook is encrypted using your public key, and signed using PTI's private key.
You have to decrypt the message using your private key, and verify that the message originated from PTI by validating the signature using PTI's public key.
This mechanism insures that nobody but you can have access to the content of those messages, even if your webhook was hijacked, and you can always be sure 
that the message originated from PTI by validating the signature of the message.
The PTI public key used for signing webhook payloads can be found [here](https://github.com/provenancetech/pti-docs/blob/master/utils/pti-prod-public.jwk)
Example code that shows you how to handle webhook requests can be found [here](https://github.com/provenancetech/pti-docs/blob/master/examples/webhook-server/python/webhook_server.py).

Most webhook requests will originate form an API call you made, but it may not always be the case. For example, we may have gathered some new information about one of your users that 
allowed us to increase the level of KYC for that user. When this happens, we send you that information by posting a [KYC result](#kyc-result) on your webhook.


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
