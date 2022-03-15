# PTI Examples

PTI provides some examples to help you understand the different ways you can interact with the PTI platform.
The source code for the examples is available [here](https://github.com/provenancetech/pti-docs/tree/master/examples)


## Reference React application example

[Here](https://github.com/provenancetech/pti-docs/tree/master/examples/ReactJsSdkApp) is an example of a basic React web application that leverages the SDK to render forms
and also shows some calls to the API.

[Here](https://github.com/provenancetech/pti-docs/blob/master/examples/PythonBackendApp/client_backend.py) you will find the associated example backend that provides 2 endponints:

* `/generateToken`:  the endpoint you would put in your backend to proxy the single use token requests
* `/webhook`: the endpoint you would put in your backend to receive the [webhook responses](usage.md#webhook-responses-definitions)

Note that it is possible to connect run this example code locally and connect it to your environment on the PTI platform. 
However, if you also wish to connect to the webhook endpoint, you must find a way to serve it over a public HTTPS address.

## Webhook server example

[Here](https://github.com/provenancetech/pti-docs/tree/master/examples/webhook-server) you will find a reference implementation of a webhook server.
It shows how to handle the incoming webhook requests and verify the signature.


## Transaction monitoring call examples

Here are examples for all three possible transaction types.

### Funding

Funding transactions are used to bring in crypto assets in the client ecosystem.

```js
const callTransactionLog = (accessToken) => {
        const baseUrl = 'https://api.pearsurge.io/v0';
        const url = baseUrl + '/users/' + USER_ID + '/transactionLogs';
        const date = new Date().toISOString();
        const headers = {
            "Content-type": "application/json",
            "x-pti-request-id": REQUEST_ID,
            "x-pti-client-id": CLIENT_ID,
            'x-pti-token': ACCESS_TOKEN,
            'x-pti-scenario-id': SCENARIO_ID,
        };
        const body = {
            type: "FUNDING",
            amount: 150,
            usdValue: 150,
            initiator: {
                type: "PERSON",
                id: USER_ID
            },
            sourceMethod: {
                currency: "USD",
                paymentInformation: {
                    type: "ENCRYPTED_CREDIT_CARD",
                    creditCardNumberHash: "feead9c948a4b3393498cf17816fb289c2d4d80d4ffb5b11a7171c5f6c48f573"
                },
                paymentMethodType: "FIAT"
            },
            date: TRANSACTION_DATE
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
### Internal Transfer
Transfers are used to exchange crypto assets within the ecosystem.
```js
const callTransactionLog = (accessToken) => {
        const baseUrl = 'https://api.pearsurge.io/v0';
        const url = baseUrl + '/users/' + userId + '/transactionLogs';
        const date = new Date().toISOString();
        const headers = {
            "Content-type": "application/json",
            "x-pti-request-id": REQUEST_ID,
            "x-pti-client-id": CLIENT_ID,
            'x-pti-token': ACCESS_TOKEN,
            'x-pti-scenario-id': SCENARIO_ID,
        };
        const body = {
            type: "TRANSFER",
            amount: 150,
            usdValue: 150,
            initiator: {
                type: "PERSON",
                id: USER_ID
            },
            destination: {
                type: "PERSON",
                id: RECIPIENT_USER_ID
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
            date: TRANSACTION_DATE
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

### Withdrawal
Withdrawals are used to take assets out of the ecosystem.

```js
    const callTransactionLog = (accessToken) => {
        const baseUrl = 'https://api.pearsurge.io/v0';
        const url = baseUrl + '/users/' + userId + '/transactionLogs';
        const date = new Date().toISOString();
        const headers = {
            "x-pti-request-id": REQUEST_ID,
            "x-pti-client-id": CLIENT_ID,
            'x-pti-token': ACCESS_TOKEN,
            'x-pti-scenario-id': SCENARIO_ID,
        };
        const body = {
            type: "WITHDRAWAL",
            amount: 150,
            usdValue: 150,
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
            date: TRANSACTION_DATE
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
In the examples, these values must be set as follows:

* `REQUEST_ID`: Unique UUID that will identify the request. The `REQUEST_ID` will be part of the response returned on the webhook and must be stored on your end.
* `CLIENT_ID`: UUID provided to you by PTI when you did your onboarding. It identifies your account on the PTI platform.
* `ACCESS_TOKEN`: Single use token you generated via your token generation endpoint, as detailed [here](auth.md#single-use-tokens)
* `SCENARIO_ID`: Scenario under which the transaction is made. It will have an impact on how much user information is required to allow the transaction to go through. More details about scenarios can be found [here](kyc.md#kyc)
* `USER_ID`: UUID uniquely identifying the user on the PTI platform. It corresponds to the value you passed in at user creation time. More details about user creation can be found [here](usage.md#creating-pti-users)
