---
title: "Overview"
slug: "definitions"
excerpt: "Here are the general definitions of the terms that will be used in this guide."
hidden: false
createdAt: "Fri Dec 13 2024 14:10:24 GMT+0000 (Coordinated Universal Time)"
updatedAt: "Fri Dec 13 2024 14:10:26 GMT+0000 (Coordinated Universal Time)"
---
### Compliance

Complying means acting in accordance to local laws and regulations. Ensuring that all the required information is collected, all value transfers are appropriately licensed is all part of achieving compliance. The Fiant(PTI) platform aims to simplify this process as much as possible, but ultimately, Fiant clients also have their role to play and are responsible for using the platform correctly to achieve compliance.

### User

A user is either a person or a business for which an assessment can be initiated or that is part of a transaction. Users must be created via the create user route of the API before KYCs or transactions  
involving them can be initiated. Users have a status of `ACTIVE` when all is fine, but may also be `BLOCKED` for various reasons. Attempting API calls involving `BLOCKED` users will trigger an error.

### KYC / User Assessment

Acronym for Know Your Customer. In this documentation, "performing a KYC" means collecting as set of information about a person, having the Fiant system collect it, analyzing it for approval and finally returning a status.

### KYC Tier

The User Assessment(KYC) tier, also referred to as the KYC level, is a grouping of information about a person associated to a numeric value.  
Depending on the information collected and the returned status, a person will be considered to have reached a KYC level.  
Higher tiers will require all the information from the lower levels. Certain tiers will be required to execute activities in the system, requirements on those are configurable and will be communicated to the client.

### Transaction assessment

All transactions will be assessed by Fiant's risk engine before being executed. The assessment can be triggered individually via the API, but is also enforced prior to execution of any transaction.

### Transaction

A transaction, in its general form, represents a transfer of assets from an originator to a recipient. Here are the 3 types of transactions that exist:

- **Deposit**: Transaction used to add funds to a user account.
- **Transfer**: Transfer of funds between users that exists in your Fiant account.
- **Withdrawal**: Transaction used to withdraw funds(fiat or crypto) from our ecosystem back to your user.
- **Trade**: Transaction used to let a user convert their funds from one asset to another (Fiat or Crypto).

### Scenarios

For KYC and transaction operations, you need to provide a header called `x-pti-scenario-id`

The purpose of this header is to indicate the type of activity your user is pursuing. The Fiant team will configure these scenarios for your account, and they will be tied to the KYC tier, and the payment rails that should be used to perform a given operation if it is a transaction.

### USDValue

This is the notional value of an asset. This value does not need to be provided if you are performing or assessing transactions on assets that Fiant supports.

However, if you are transacting assets hosted within your ecosystem, you must provide the notional value in your call to fulfill compliance requirements.

### Transaction Total, Amount and Fee Recipients

The "transactionTotal" object is used to express the transaction details, including the fees that have been perceived on behalf of the integrator. If the object is not provided, the value of the "amount" property will be used, and the fees will be set to 0. The subtotal is the amount that will go to the seller, and the fee goes to the root user of the integrator's platform.

The "feeRecipients" structure enables the integrator to pay certain actor in their ecosystem commissions on the sale of digital assets. These amounts should **not** be included in the transaction total object.

The "amount" property is the sum of the TransactionTotal.total property + the sum of all fee recipients.
