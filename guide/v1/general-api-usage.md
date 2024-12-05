
## Creating Fiant Users

Prior to doing any actions on the API, you must define your users on the PTI system using the [create user](https://provenancetech.github.io/pti-docs/api/v1/#/default/post_users) API call. 
We recommend that you create the Fiant user that the same time you create the user on your side.
It could also be done the first time they need to interact with Fiant.
In any case, you will need to pass a unique UUID of your choice as the value of the `id` field in the body of the request.
You need to store this `id` and associate it to the user in your system as it will be needed for most of the API calls you will make to PTI.
We will refer to this user `id` as `USER_ID` in the rest of the documentation.

## Initiating a user assessment

Once a user exists on the PTI platform, you can initiate an assessment for that user. To do so, call the [start user assessment endpoint](https://provenancetech.github.io/pti-docs/api/v1/index.html#/User%20Assessment/startUserAssessment) 
using the user `USER_ID` you passed in the [create user](https://provenancetech.github.io/pti-docs/api/v1/#/default/post_users) API call. You must also provide a `REQUEST_ID` that you must store
to be able to correlate the webhook [User assessment result](#user-assessment-result) to this specific Assessment check.

## Checking if a user assessment is required

In order to be able to perform a specific transaction in the system, your user may need to have certain assessment clearance(you can consult [the advanced kyc section](#kyc) to get more details on this).

You have 2 choices, you can either attempt the transaction, and handle 422 errors if they happen, or you can preemptively validate the transaction using the [Validate transaction endpoint](https://provenancetech.github.io/pti-docs/api/v1/index.html#/Transaction%20Assessment/transactionInformationAssessment)


## Executing Transactions

Once your user has the required assessment level acceptance, you can execute transactions.
Again, you will need the `USER_ID` of the user originating the transaction. You must also provide a `REQUEST_ID` that you must store
to be able to correlate the webhook [transaction monitoring result](#transaction-monitoring-result) and [payment processing update](#payment-processing-update)  to this specific transaction.

You may need to complete the transaction cycle, especially for some operations, like sell operations, if they require actions being taken on your proprietary infrastructure. For the cases, you should provide a feedback on the transaction once it is finalized on your side using the [transaction feedback endpoint](https://provenancetech.github.io/pti-docs/api/v1/index.html#/default/post_transactions__requestId__feedback)
You need to use the same `REQUEST_ID` you used in the log transaction API call.

## Webhooks

Most operations on the PTI API will result in asynchronous responses which will be sent to the webhook URL you provided during the [onboarding](fiant-onboarding).
The content posted on your webhook is encrypted using your public key, and signed using PTI's private key.
You have to decrypt the message using your private key, and verify that the message originated from PTI by validating the signature using PTI's public key.
This mechanism insures that nobody but you can have access to the content of those messages, even if your webhook was hijacked, and you can always be sure 
that the message originated from PTI by validating the signature of the message.
You can find the sandbox public key [here](sandbox.pub) and the production one [here](prod.pub) 
Example code (Python) that shows you how to handle webhook requests can be found [here](https://github.com/provenancetech/pti-docs/blob/master/examples/webhook-server/python/webhook_server.py).

Most webhook requests will originate form an API call you made, but it may not always be the case. For example, we may have gathered some new information about one of your users that 
allowed us to increase the level of KYC for that user. When this happens, we send you that information by posting a [Assessment result](#user-assessment-result) on your webhook.


## Status codes and Errors

PTI uses conventional HTTP response codes to indicate the success or failure of an API request. 
In general, codes in the 2xx range indicate success. Codes in the 4xx range indicate an error. 
Codes in the 5xx range indicate an error with PTI servers (these are rare and should not happen).

The following table details the meaning of the various codes that can be returned by the API:

| Code | Short                | Description                                                                                                                                                                                  |
|------|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 200  | OK                   | Everything worked as expected.                                                                                                                                                               |
| 201  | Created              | The request has been fulfilled and has resulted in one or more new resources being created.                                                                                                  |
| 202  | Accepted             | The request has been accepted for processing, but the processing has not been completed. You *might* get a response back on your Webhook eventually.                                         |
| 400  | Bad Request          | The request was unacceptable, often due to missing a required parameter.                                                                                                                     |
| 401  | Unauthorized         | No valid Signature or Token provided.                                                                                                                                                        |
| 402  | Request Failed       | The parameters were valid but the request failed.                                                                                                                                            |
| 403  | Forbidden            | The Client or the Token doesn't have permissions to perform the request.                                                                                                                     |
| 404  | Not Found            | The requested resource doesn't exist.                                                                                                                                                        |
| 422  | Unprocessable entity | One of these 2 cases: More information about the User is needed in order to approve the transaction. There is no approved assessment for this user that enables him to perform the operation |
| 409  | Conflict             | The request conflicts with another request (perhaps due to using the same `REQUEST ID` twice).                                                                                               |
| 429  | Too Many Requests    | Too many requests hit the API too quickly. We recommend an exponential backoff of your requests.                                                                                             |
| 5xx  | Server Errors        | 	Something went wrong on PTI servers. (These are rare and should not happen)                                                                                                                 |
