# Dynamic Kyc - Integration Guide

## Client Config
2 aspects are needed to make Dynamic Kyc functional.

- Every transaction need to be logged, with the logTransaction api end point. They must provide the scenarioId in the http header (http header name x-pti-scenario-id).

**Javascript Code Example**

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

- When opening a Kyc Form, the amount and scenarioId have to be provided.

**Javascript Code Example**

```js
    PTI.form({
        type: "KYC",
        requestId: requestId,
        userId: userId,
        parentElement: document.getElementById(e.id),
        callback: callback,
        metaInformation: { var3: "value3", var4: "value4"},
        scenarioId: scenarioId,
        amount: amount
    });
```

- In order to avoid calling the Kyc form for nothing, there is an endpoint that can be used to know if a kyc is needed:

**Javascript Code Example**

```js
    const callIsKycNeeded = (accessToken) => {
        const baseUrl = 'https://pti' + (ptiConfig.ptiPrefix ? ptiConfig.ptiPrefix : '') + '.apidev.pticlient.com/v0';
        const url = baseUrl + '/users/' + userId + '/kyc-needed?amount=' + amount;
        const date = new Date().toISOString();
        const headers = {
            "x-pti-request-id": requestId,
            "x-pti-client-id": ptiConfig.clientId,
            'x-pti-token': accessToken,
            'x-pti-scenario-id': scenarioId,
            'Date': date
        };
        const options = {
            method: "GET",
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
## Server Config per Client

### KYC tier scenario bracket table

Reference Document : KYC matrix and work https://docs.google.com/spreadsheets/d/1m9HdNw91vyACc1c_C9SF2-OIJJ_AgSdP7cRajm23_wk/edit#gid=0

| scenarioId | kycTiers        | Call Example                                                              |
|------|--------------|--------------------------------------------------------------------------|
| fiat_to_cc  | {"1":0,"101":0,"1900":0,"9800":0}           | <a href='#/?id=a-funding'>A</a>|
| rly_from_reward| {"1":0,"101":0,"1900":0,"9800":0}           | <a href='#/?id=a-funding'>A</a>|
| cc_to_cc  | {"1":1,"101":1,"1900":1,"9800":1}       | <a href='#/?id=b-internal-transfer'>B</a>|
| cc_to_rly  | {"1":1,"101":2,"1900":2,"9800":2}         | <a href='#/?id=b-internal-transfer'>B</a>|
| rly_to_cc  | {"1":0,"101":0,"1900":0,"9800":0}           | <a href='#/?id=b-internal-transfer'>B</a>|
| fan_to_fan_cc  | {"1":1,"101":1,"1900":1,"9800":1}           | <a href='#/?id=c-external-transfer'>C</a>|
| fiat_to_creator_cc  | {"1":1,"101":1,"1900":1,"9800":1}          | <a href='#/?id=c-external-transfer'>C</a>|
| creator_to_fan_cc  | {"1":1,"101":1,"1900":1,"9800":1}         | <a href='#/?id=c-external-transfer'>C</a>|
| creator_to_creator_cc  | {"1":1,"101":1,"1900":1,"9800":1}         | <a href='#/?id=c-external-transfer'>C</a>|
| bridge_out  | {"1":4,"101":4,"1900":4,"9800":5}       | <a href='#/?id=d-withdrawal'>D</a>|
| cc_to_nft_primary  | {"1":1,"101":1,"1900":1,"9800":1}}       | ?|
| cc_to_nft_secondary  | {"1":1,"101":1,"1900":1,"9800":1}       | ?|
| nft_sell  | {"1":1,"101":2,"1900":2,"9800":2}   | ?|
| nft_gift  | {"1":1,"101":1,"1900":1,"9800":1}       | ?|

### KYC Tier fields

| kycTier | fields
|------|--------------
|1|["FULL_NAME","EMAIL_ADDRESS","PHYSICAL_ADDRESS","BIRTH_DATE"]|
|2|["GOVERNMENT_ID"]|
|3|["TOKEN_ADDRESS"]|
|4|["SOCIAL_SECURITY_NUMBER"]|
|5|["SOURCE_OF_FUNDS"]|


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

