---
title: "User Assessment"
slug: "user-assessment-2"
excerpt: ""
hidden: false
createdAt: "Fri Dec 13 2024 14:10:24 GMT+0000 (Coordinated Universal Time)"
updatedAt: "Thu Dec 19 2024 20:22:02 GMT+0000 (Coordinated Universal Time)"
---
In order to limit the amount of fraud and other nefarious activities, Fiant offers the possibility of performing a User assessment ( KYC, Know Your Customer ) flow for a specific user.  
A KYC flow will require a set of information about the user and return a status. The status returned should be used to allow or deny the user to perform transactions.  
KYCs are configurable with these two elements:

- **Tier**: A KYC tier is a numerical value associated to a set of user information
- **Scenario**: A scenario is defined by a name an array of price brackets that map to an Assessment tier

This implies that for a given amount and scenario, the required user information is determined via the mapped tier. The following tables illustrate the default configuration  
for tiers and an example for scenario mappings.  
These can be configured by PTI to suit your specific needs

<br />

## Default Tier Configuration

| Tier | Required User Information                                      |
| ---- | -------------------------------------------------------------- |
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

| Scenario/Nominal value | 0$ - 100$ | 100$ - 1000$ | 1000$ - 10K$ | 10K$ and up |
| ---------------------- | --------- | ------------ | ------------ | ----------- |
| Deposit                | 1         | 2            | 2            | 2           |
| Transfer               | 1         | 1            | 1            | 1           |
| Withdrawal             | 3         | 3            | 4            | 5           |

With the above configuration, a user who wishes to do a 150$ transaction associated to the Crypto Sell scenario  
would have to successfully have executed a KYC flow providing all the information required by KYC tier 3.

Also note that the amount brackets represent cumulative amounts per scenario. For example, if a user does multiple transactions  
associated to the `Withdrawal` scenario, it is the total of all these transactions that will be used to select the KYC tier for that scenario.

## Performing KYC flows

### KYC using the SDK and Hosted Forms

To simplify the collection of user information needed to perform the KYC checks, it is possible to display the KYC Hosted form. Here is a code  
example using the SDK form function to display the KYC form.

[block:tutorial-tile]
{
  "backgroundColor": "#018FF4",
  "emoji": "✅",
  "id": "674f67f6d6479e0017cf602a",
  "link": "https://fiant.readme.io/v1.0.184/recipes/handling-user-assessment",
  "slug": "handling-user-assessment",
  "title": "Handling User assessment"
}
[/block]


In the above example, the KYC form displayed will collect all the missing information on the user. 

Under the hood, all the user information will be collected, the single-use token fetched and the call to the [Start user Assessment endpoint](https://fiant.readme.io/reference/startuserassessment) . The [usdValue](https://fiant.readme.io/docs/definitions#usdvalue) parameter is extremely important here because the element will call the [transaction validation endpoint](https://fiant.readme.io/reference/transactioninformationassessment) to populate itself.

### User Assessment via API calls

The [transaction assessment endpoint](https://fiant.readme.io/reference/transactioninformationassessment)is very useful if you want to know which information you need to collect to make the assessment call. [The assessment endpoint ](https://fiant.readme.io/reference/startuserassessment)will automatically calculate the tier it can achieve according to the available user pieces of information.

[block:tutorial-tile]
{
  "backgroundColor": "#018FF4",
  "emoji": "✅",
  "id": "6751b2256b3cb30073c694b3",
  "link": "https://fiant.readme.io/v1.0.184/recipes/element-perform-user-assessment-1",
  "slug": "element-perform-user-assessment-1",
  "title": "Element - Perform User Assessment"
}
[/block]
