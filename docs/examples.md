# PTI Examples

PTI provides some examples to help you understand the different ways you can interact with the PTI platform.
The source code for the examples is available (here)[https://github.com/provenancetech/pti-docs/tree/master/examples]


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
