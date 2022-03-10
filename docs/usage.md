## PTI API Reference

You can find the PTI API Reference [here](https://provenancetech.github.io/pti-docs/api/v0/)

## Creating PTI Users
Prior to doing any actions on the API, you must define your users on the PTI system.

This can be done either from the front end or the backend. Typically, you could create PTI users as part of the same flow as your user creation process. It could be also done the first time they need to interact with PTI. Ideally, you should use an id that enables you to easily map this user with your own users.

Here is the call reference

https://provenancetech.github.io/pti-docs/api/v0/index.html#/paths/~1users/post

## Webhooks

A lot of operations on the PTI API may result in asynchronous responses; for example, maybe we gathered, behind the scene, some new information about one of your Users that allowed us to have a better level of KYC on that user. When this happens, we send you that information by posting the information to your Webhook.

Your webhook is a URL that you provide to PTI which accepts POST requests. The data that is posted is encrypted using your public key, and signed using PTI's private key. You can then decrypt the message using your private key, and verify that the message originated from PTI by validating the signature using PTI's public key.

This mechanism insures that nobody but you can ever have access to the content of those messages, even if your Webhook was hijacked, and you can always be sure that the message originated from PTI by validating the signature of the message.

### Example webhook

!> You can find the source code for the example webhook server, along with a tool to make mock requests to your webhook server, [here](https://github.com/provenancetech/pti-docs/blob/master/examples/python/webhook_server).

```python
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import requests
import sys
from jwcrypto import jws, jwk, jwe

class PTIWebhookRequestHandler(BaseHTTPRequestHandler):
    def decrypt_and_verify(self, content):
      # decrypt
      jwetoken = jwe.JWE()
      jwetoken.deserialize(content, key=encryption_private_key)
      if json.loads(jwetoken.objects['protected'])['alg'] != 'RSA-OAEP-256' or json.loads(jwetoken.objects['protected'])['enc'] != 'A256CBC-HS512':
        raise Exception('Unsupported encryption') # we have to check those, otherwise other encryptions can be used as an attack vector

      # verify
      jwstoken = jws.JWS()
      jwstoken.deserialize(jwetoken.payload)

      if signature_public_key is None:
        jku = json.loads(jwstoken.objects['protected'])['jku']
        kid = json.loads(jwstoken.objects['protected'])['kid']

        #NOTE: to be certain to use a valid public key, one would have to check the
        #      domain name and SSL certificate's Common Name against a whitelisted list
        keys = requests.get(jku).content
        keyset = jwk.JWKSet()
        keyset.import_keyset(keys)
        verification_key = keyset.get_key(kid)
      else:
        verification_key = signature_public_key

      if json.loads(jwstoken.objects['protected'])['alg'] != 'RS512':
        raise Exception('Unsupported signature algorithm') # we have to check, otherwise other algorithms can be used as an attack vector

      jwstoken.verify(verification_key) # if there's no exception, the signature is valid
      return jwstoken.payload

    def do_POST(self):
      content_length = int(self.headers['Content-Length'])
      post_data = self.rfile.read(content_length)
      decrypted_and_verified = self.decrypt_and_verify(post_data)

      print(decrypted_and_verified) # TODO: do something useful with the decrypted payload

      self.send_response(200)
      self.send_header('Content-type', 'application/json')
      self.end_headers()
      self.wfile.write('{"status": "OK"}'.encode('utf-8'))

with open(sys.argv[1], "rb") as private_key_file:
    encryption_private_key = jwk.JWK.from_json(private_key_file.read())

if len(sys.argv) > 2:
  with open(sys.argv[2], "rb") as public_key_file:
      signature_public_key = jwk.JWK.from_json(public_key_file.read())

httpd = HTTPServer(('0.0.0.0', 8000), PTIWebhookRequestHandler)
httpd.serve_forever()
```


### Webhook Responses definitions
Here is what you can receive on your webhook:

#### KYC Result

```json
{
   "resourceType":"KYC",
   "requestId":"$YOUR_REQUEST_ID",
   "clientId":"$YOUR_CLIENT_ID",
   "userId":"$YOUR_USER_ID",
   "status":"ACCEPTED/REFUSED/UNDER_REVIEW/ERROR/PENDING",
   "tier": "Integer"
}
```

#### Transaction monitoring

```json
{
   "resourceType":"TRANSACTION_MONITORING",
   "requestId":"$YOUR_REQUEST_ID",
   "clientId":"$YOUR_CLIENT_ID",
   "userId":"$YOUR_USER_ID",
   "status":"ACCEPT/MANUAL_REVIEW/DENY/ERROR/PENDING",
   "transactionDate":"iso8601 date",
   "amount":"$TRANSACTION_AMOUNT",
   "transactionType":"FUNDING, WITHDRAWAL, TRANSFER",
   "transactionMonitoringResultDetail":{
     "complianceProviderResponseCode" : "FRAUD_SUSPICION, TRANSACTION_VELOCITY_VIOLATION, BLOCKED_JURISDICTION, GEO_FENCING_VIOLATION, SANCTION_SCREENING"
   }
}
```

#### Payment processing

```json
{
   "resourceType":"PAYMENT_PROCESSOR",
   "requestId":"$YOUR_REQUEST_ID",
   "clientId":"$YOUR_CLIENT_ID",
   "userId":"$YOUR_USER_ID",
   "status":"AUTHORIZED/REFUSED/ERROR/PENDING",
   "date":"iso8601 date",
   "amount":"$TRANSACTION_AMOUNT",
   "fees": "$TRANSACTION_FEES",
   "currency":"$TRANSACTION_CURRENCY",
   "transactionType":"FUNDING, WITHDRAWAL, TRANSFER",
   "paymentMethod":"PAYPAL, TOKEN, BANK_ACCOUNT, ENCRYPTED_CREDIT_CARD",
   "additionalInfos" {
      "CreditCardLast4Digits":"XXXX",
      "PaymentProviderTransactionId":"XXXX"
   },
   "transactionStatusDetail": {
      "providerResponseCode":"PTI_TECHNICAL_ERROR, PAYMENT_PROVIDER_TECHNICAL_ERROR, 
      FRAUD_SUSPICION, BLOCKED_COUNTRY, AVS_CHECK_FAILED, 
      CVV_CHECK_FAILED, PAYMENT_INSTRUMENT_PROBLEM, PAYMENT_PROVIDER_DECLINED",
      "providerResponseCategory":"ERROR, SOFT_DECLINE, HARD_DECLINE"
   }
}
```

#### Payment processing subsequent update

```json
{
   "resourceType":"PAYMENT_PROCESSOR",
   "requestId":"$YOUR_REQUEST_ID",
   "clientId":"$YOUR_CLIENT_ID",
   "userId":"$YOUR_USER_ID",
   "status":"AUTHORIZED/REFUSED/ERROR/CHARGED_BACK/CANCELED/REFUNDED/CAPTURED/SETTLED",
   "date":"iso8601 date",
   "amount":"$TRANSACTION_AMOUNT",
   "fees": "$TRANSACTION_FEES",
   "currency":"$TRANSACTION_CURRENCY",
   "transactionType":"FUNDING, WITHDRAWAL, TRANSFER"
   "paymentMethod":"PAYPAL, TOKEN, BANK_ACCOUNT, ENCRYPTED_CREDIT_CARD",
   "additionalInfos" {
      "CreditCardLast4Digits":"XXXX"
   },
   "transactionStatusDetail": {
      "providerResponseCode":"PTI_TECHNICAL_ERROR, PAYMENT_PROVIDER_TECHNICAL_ERROR, 
      FRAUD_SUSPICION, BLOCKED_COUNTRY, AVS_CHECK_FAILED, 
      CVV_CHECK_FAILED, PAYMENT_INSTRUMENT_PROBLEM, PAYMENT_PROVIDER_DECLINED",
      "providerResponseCategory":"ERROR, SOFT_DECLINE, HARD_DECLINE"
   }
}
```

## Status codes and Errors

PTI uses conventional HTTP response codes to indicate the success or failure of an API request. In general: Codes in the 2xx range indicate success. Codes in the 4xx range indicate an error that failed given the information provided (e.g., a required parameter was omitted, a charge failed, etc.). Codes in the 5xx range indicate an error with PTI servers (these are rare).

Some 4xx errors that could be handled programmatically (e.g., the User provided is invalid) include an error code that briefly explains the error reported.

| Code | Short        | Description                                                              |
|------|--------------|--------------------------------------------------------------------------|
| 200  | OK           | Everything worked as expected.                                           |
| 201  | Created      | The request has been fulfilled and has resulted in one or more new resources being created.                       |
| 202  | Accepted     |  The request has been accepted for processing, but the processing has not been completed. You *might* get a response back on your Webhook eventually.                        |
| 400  | Bad Request  | The request was unacceptable, often due to missing a required parameter. |
| 401  | Unauthorized | No valid Signature or Token provided.                                    |
| 402  | Request Failed | The parameters were valid but the request failed.                                    |
| 403  | Forbidden | The Client or the Token doesn't have permissions to perform the request.                                    |
| 404  | Not Found | The requested resource doesn't exist.                                  |
| 409  | Conflict | The request conflicts with another request (perhaps due to using the same idempotent key).                                    |
| 429  | Too Many Requests | Too many requests hit the API too quickly. We recommend an exponential backoff of your requests.                                  |
| 5xx  | Server Errors | 	Something went wrong on PTI's end. (These are rare.)                              |


The API reference documentation can be found [here](https://provenancetech.github.io/pti-docs/api/v0)

### Create a user and initiate a KYC

* Post to the [create user endpoint](https://provenancetech.github.io/pti-docs/api/v0/index.html#/default/post_users) with the user ID of your choice.
* Post to the [start KYC endpoint](https://provenancetech.github.io/pti-docs/api/v0/index.html#/default/post_users__userId__kyc) using the user ID you selected in the previous call.
* Wait for the [KYC result](#kyc-result) to come back on your webhook and react according to the status received
*


### Log a transaction, get the transaction details and provide feedback

* Post to the [log transaction endpoint](https://provenancetech.github.io/pti-docs/api/v0/index.html#/default/post_users__userId__transactionLogs) with the user ID originating the transaction as well as a request ID that needs to be stored for future reference to the transaction
* Wait for the [transaction monitoring result](#transaction-monitoring) on your webhook, and react on the status received
* Get the all the details about the transaction using the [get transcation endpoint](https://provenancetech.github.io/pti-docs/api/v0/index.html#/default/get_users__userId__transactions__requestId_) with the request ID used for the log transaction step above
* Provide feedback on the transaction once all the operations on your side have completed using the [transaction feedback endpoint](https://provenancetech.github.io/pti-docs/api/v0/index.html#/default/post_transactions__requestId__feedback) using the request ID used in the first API call


### Perform a fiat funding

* Post to the [fiat funding endpoint](https://provenancetech.github.io/pti-docs/api/v0/index.html#/default/post_users__userId__transactions_fiat_funding) with the user ID for which you want to fund the account. You also need to pass in a request ID that needs to be stored for future reference to the transaction
* Wait for the [payment processing result](#payment-processing) on your webhook and react on the satus received

The fiat funding leverages the transaction monitoring feature as well as a payment processor connected to PTI. The SDK payment form calls the fiat funding endpoint under the hood.


### Logging transfer transactions

* 



## Call examples

### A - Funding
```js
const callTransactionLog = (accessToken) => {
        const baseUrl = 'https://pti' + (ptiConfig.ptiPrefix ? ptiConfig.ptiPrefix : '') + '.apidev.pticlient.com/v0';
        const url = baseUrl + '/users/' + userId + '/transactionLogs';
        const date = new Date().toISOString();
        const headers = {
            "Content-type": "application/json",
            "x-pti-request-id": requestId,
            "x-pti-client-id": ptiConfig.clientId,
            'x-pti-token': accessToken,
            'x-pti-scenario-id': scenarioId,
            'Date': date
        };
        const body = {
            type: "FUNDING",
            amount: amount,
            usdValue: amount,
            initiator: {
                type: "PERSON",
                id: userId
            },
            sourceMethod: {
                currency: "USD",
                paymentInformation: {
                    type: "ENCRYPTED_CREDIT_CARD",
                    creditCardNumberHash: "feead9c948a4b3393498cf17816fb289c2d4d80d4ffb5b11a7171c5f6c48f573"
                },
                paymentMethodType: "FIAT"
            },
            date: date
        }
        const options = {
            method: "POST",
            body: JSON.stringify(body),
        };
        const config = {
            ...options,
            headers
        }
        return fetch(url, config).then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(response.statusText);
        });
    }

```
### B - Internal Transfer
```js
const callTransactionLog = (accessToken) => {
        const baseUrl = 'https://pti' + (ptiConfig.ptiPrefix ? ptiConfig.ptiPrefix : '') + '.apidev.pticlient.com/v0';
        const url = baseUrl + '/users/' + userId + '/transactionLogs';
        const date = new Date().toISOString();
        const headers = {
            "Content-type": "application/json",
            "x-pti-request-id": requestId,
            "x-pti-client-id": ptiConfig.clientId,
            'x-pti-token': accessToken,
            'x-pti-scenario-id': scenarioId,
            'Date': date
        };
        const body = {
            type: "TRANSFER",
            amount: amount,
            usdValue: amount,
            initiator: {
                type: "PERSON",
                id: userId
            },
            destination: {
                type: "PERSON",
                id: userId
            },            
            sourceTransferMethod: {
                paymentInformation: {
                    type: "TOKEN",
                    tokenType: "ETH",
                    tokenAddress: "0x0000000000000000000000000000000000000000"
                },
                paymentMethodType: "TOKEN"
            },
            destinationTransferMethod: {
                paymentInformation: {
                    type: "TOKEN",
                    tokenType: "ETH",
                    tokenAddress: "0x0000000000000000000000000000000000000000"
                },
                paymentMethodType: "TOKEN"
            },
            date: date
        }
        const options = {
            method: "POST",
            body: JSON.stringify(body),
        };
        const config = {
            ...options,
            headers
        }
        return fetch(url, config).then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(response.statusText);
        });
    }
```
### C - External transfer
```js
const callTransactionLog = (accessToken) => {
        const baseUrl = 'https://pti' + (ptiConfig.ptiPrefix ? ptiConfig.ptiPrefix : '') + '.apidev.pticlient.com/v0';
        const url = baseUrl + '/users/' + userId + '/transactionLogs';
        const date = new Date().toISOString();
        const headers = {
            "Content-type": "application/json",
            "x-pti-request-id": requestId,
            "x-pti-client-id": ptiConfig.clientId,
            'x-pti-token': accessToken,
            'x-pti-scenario-id': scenarioId,
            'Date': date
        };
        const body = {
            type: "TRANSFER",
            amount: amount,
            usdValue: amount,
            initiator: {
                type: "PERSON",
                id: userId
            },
            destination: {
                type: "PERSON",
                id: userId
            },
            sourceTransferMethod: {
                paymentInformation: {
                    type: "TOKEN",
                    tokenType: "ETH",
                    tokenAddress: "0x0000000000000000000000000000000000000000"
                },
                paymentMethodType: "TOKEN"
            },
            destinationTransferMethod: {
                paymentInformation: {
                    type: "TOKEN",
                    tokenType: "ETH",
                    tokenAddress: "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
                },
                paymentMethodType: "TOKEN"
            },
            date: date
        }
        const options = {
            method: "POST",
            body: JSON.stringify(body),
        };
        const config = {
            ...options,
            headers
        }
        return fetch(url, config).then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(response.statusText);
        });
    }
```
### D - Withdrawal
```js
    const callTransactionLog = (accessToken) => {
        const baseUrl = 'https://pti' + (ptiConfig.ptiPrefix ? ptiConfig.ptiPrefix : '') + '.apidev.pticlient.com/v0';
        const url = baseUrl + '/users/' + userId + '/transactionLogs';
        const date = new Date().toISOString();
        const headers = {
            "Content-type": "application/json",
            "x-pti-request-id": requestId,
            "x-pti-client-id": ptiConfig.clientId,
            'x-pti-token': accessToken,
            'x-pti-scenario-id': scenarioId,
            'Date': date
        };
        const body = {
            type: "WITHDRAWAL",
            amount: amount,
            usdValue: amount,
            initiator: {
                type: "PERSON",
                id: userId,
                name: {
                    firstName: "John",
                    lastName: "Doe"
                }
            },
            destinationMethod: {
                paymentInformation: {
                    type: "TOKEN",
                    tokenType: "ETH",
                    tokenAddress: "0x0000000000000000000000000000000000000000"
                },
                paymentMethodType: "TOKEN"
            },
            date: date
        }
        const options = {
            method: "POST",
            body: JSON.stringify(body),
        };
        const config = {
            ...options,
            headers
        }
        return fetch(url, config).then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(response.statusText);
        });
    }

```
