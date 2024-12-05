# User Assessment

In order to limit the amount of fraud and other nefarious activities, Fiant offers the possibility of performing a User assessment ( KYC, Know Your Customer ) flow for a specific user.
A KYC flow will require a set of information about the user and return a status. The status returned should be used to allow or deny the user to perform transactions.
KYCs are configurable with these two elements:

* **Tier**: A KYC tier is a numerical value associated to a set of user information
* **Scenario**: A scenario is defined by a name an array of price brackets that map to an Assessment tier

This implies that for a given amount and scenario, the required user information is determined via the mapped tier. The following tables illustrate the default configuration 
for tiers and an example for scenario mappings.
These can be configured by PTI to suit your specific needs

## Default Tier Configuration

| Tier | Required User Information                                      |
|------|----------------------------------------------------------------|
| 0    | No user information required                                   |  
| 1    | full Name, email address, street address, date of birth        |  
| 2    | ID with Picture ( Passport or Driver License ), liveness check |
| 3    | cryptocurrency address                                         |
| 4    | social security number                                         |
| 5    | linked bank account or source of funds                         |

Tiers are cumulative. For example, the information required by tier 3 includes all the information required by tier 1 and 2.

## Example Scenario Configuration

This table illustrates how a scenario and an amount bracket maps to a Assessment tier.
This is only an example, discuss with PTI to set up your desired configuration. 

| Scenario/Nominal value | 0$ - 100$                              | 100$ - 1000$ | 1000$ - 10K$ | 10K$ and up |
|------------------------|----------------------------------------|--------------|--------------|-------------|
| Deposit                | 1                                      | 2            | 2            | 2           |  
| Transfer               | 1                                      | 1            | 1            | 1           |
| Withdrawal             | 3                                      | 3            | 4            | 5           |

With the above configuration, a user who wishes to do a 150$ transaction associated to the Crypto Sell scenario 
would have to successfully have executed a KYC flow providing all the information required by KYC tier 3.

Also note that the amount brackets represent cumulative amounts per scenario. For example, if a user does multiple transactions
associated to the `Withdrawal` scenario, it is the total of all these transactions that will be used to select the KYC tier for that scenario.


## Performing KYC flows

### KYC using the SDK and Hosted Forms

In order to simplify the collection of user information needed to perform the KYC checks, it is possible to display the KYC Hosted form. Here is a code
example using the SDK form function to display the KYC form. Note that only the fields missing for the selected scenario and amount will be displayed in an iframe.

```js
    PTI.form({
        type: "KYC",
        requestId: "REQUEST_ID",
        userId: "USER_ID",
        parentElement: document.getElementById("root"),
        scenarioId: "Crypto Sell",
        usdValue: 150
    });
```

In the above example, the KYC form displayed will collect all the missing information on the user identified by `USER_ID`. Again, assuming that this
is the first transaction under the `Crypto Sell` scenario from our example configuration above, the form will collect all the missing fields in tier 3.

Under the hood, all the user information will be collected, the single use token fetched and the call to the [initiate Assessment endpoint](https://provenancetech.github.io/pti-docs/api/v1/#/User%20Assessment/startUserAssessment) made.

Please note that the amount passed in the above example must be in USD.

The usdValue parameter is extremely important here because the element will call the [transaction validation endpoint](https://fiant.readme.io/reference/transactioninformationassessment) to populate itself.

### User Assessment via API calls

Another way to perform a user assessment flows is to use the API directly.

#### Initiate a check

The [transaction assessment endpoint](https://fiant.readme.io/reference/transactioninformationassessment)is very useful if you want 
to know which information you need to collect to make the assessment call. 
[The assessment endpoint ](https://fiant.readme.io/reference/startuserassessment)will 
automatically calculate the tier it can achieve according to the available user pieces of
information.


Using the [initiate Assessment endpoint](https://provenancetech.github.io/pti-docs/api/v1/#/User%20Assessment/startUserAssessment), it is possible to start the KYC check.
Note that all the user information needed for the selected scenario and amount must be either provided in the call or have been previously provided for the
selected user. The result of the KYC check will be returned asynchronously over your webhook. Please note that if a liveness check is required by the selected
tier, the user will receive a notification on his device to complete it.

### User assessment in the context of transactions

When calling any transactions endpoint, passing in the scenario as well as the amount will result in the initiation of a KYC check using the
KYC tier mapped by the configuration. The following example shows a call to the transaction monitoring endpoint for a transaction of 150$ done with
the `CC Deposit` scenario. Assuming that this is the first transaction of that kind for a user and that the scenario configuration was exactly as the example above, 
this would lead to a KYC check with a KYC tier of 2. A transaction request that fails a KYC cycle will **NOT** return an `ACCEPTED` status.

```js
const callTransactionLog = (accessToken) => {
        const baseUrl = 'https://api.staging.fiant.io/v1';
        const url = baseUrl + '/users/' + userId + '/transactionLogs';
        const date = new Date().toISOString();
        const headers = {
            "Content-type": "application/json",
            "x-pti-request-id": requestId,
            "x-pti-client-id": "${YOUR_CLIENT_ID}",
            'x-pti-token': accessToken,
            'x-pti-scenario-id': "CC Deposit",
            'Date': date
        };
        const body = {
            type: "DEPOSIT",
            amount: 150,
            usdValue: 150,
            initiator: {
                type: "PERSON",
                id: userId
            },
            sourceMethod: {
                currency: "USD",
                paymentInformation: {
                    type: "ENCRYPTED_CREDIT_CARD",
                    id: "credit_card_id"
                },
                paymentMethodType: "CREDIT_CARD"
            },
            destinationMethod:{
                paymentMethodType: "WALLET",
                walletId:"my_wallet"
            }
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

Please note that it is the `usdValue` field that is used for mapping to the KYC tier.
