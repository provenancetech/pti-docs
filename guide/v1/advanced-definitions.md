# Fiant Core API Documentation

Welcome Fiant documentation site. Here, you will find all the relevant information needed
for integrating with, and leveraging the Fiant platform.

## Definitions

### Compliance

Being in compliance means acting in accordance to local laws and regulations. Ensuring that all the required information is collected, all value transfers are appropriately licensed is all part of achieving compliance. The Fiant(PTI) platform aims to simplify this process as much as possible, but ultimately, Fiant clients also have their role to play and are responsible for using the platform correctly to achieve compliance.

### User

A user is either a person or a business for which a KYC can be initiated or that is part of a transaction. Users must be created via the create user route of the API before KYCs or transactions
involving them can be initiated. Users have a status of `ACTIVE` when all is fine, but may also be `BLOCKED` for various reasons. Attempting API calls involving `BLOCKED` users will trigger an error.

### KYC / User Assessment

Acronym for Know Your Customer. In this documentation, "performing a KYC" means collecting as set of information about a person and returning a status.

### Tier

The User Assessment(KYC) tier, also referred to as the KYC level, is a grouping of information about a person associated to a numeric value.
Depending on the information collected and the returned status, a person will be considered to have reached a KYC level.
Higher tiers will require all the information from the lower levels.

### Client Ecosystem

The ecosystem represents a closed market of crypto assets. The ecosystem assets cannot be traded publicly outside the ecosystem.

### Transaction

A transaction, in its general form, represents a transfer of assets from an originator to a recipient. Here are the 3 types of transactions that exist:

- **Funding**: Transaction used to add funds to a user account.
- **Transfer**: Transaction used to transfer or convert crypto assets between the originator and the recipient within the client ecosystem.
- **Withdrawal**: Transaction used to sell crypto assets and withdraw them from the ecosystem.

## Components

The Fiant platform provides you with components that will allow you to achieve compliance while minimizing the amount of effort needed on your end to do so.

### Elements

In order to simplify a secure integration to the Fiant platform, hosted forms are provided for the following use cases:

- Collection of information for the User Assessment(KYC) flow
- Collecting payment information
- Onboarding users

### Web SDK

The web sdk is a publicly available Javascript library provided to simplify the integration of the Fiant Elements in the client UI.
It also enables the tracking of user devices and UI interactions to improve the detection of malicious behaviour.
The [SDK page](./advanced-frontend-sdk) contains guidance on how to leverage the Fiant Web SDK.

### REST API

The REST API is the central part of the Fiant platform. Its endpoints focus around these main areas:

- User creation and management
- User Assessment cycle management
- Transaction execution and assessment

## Integration

In order to start using the Fiant platform, follow our [onboarding guide](./fiant-onboarding).

The [authentication page](./advanced-auth) provides all the information required and steps to follow in order to be able to securely interact with the Fiant Core API.

The [User Assessment page](./advanced-user-assessment) details the different ways the KYC flow can be configured and customized to suit various use cases.

The [SDK page](./advanced-user-assessment) shows you how to initialize and use the SDK.

The [API usage page](./advanced?usage) demonstrates how communicate via the Fiant Core API and associated webhooks.

## Contributing

If you feel that this documentation is incomplete or needs some improvements, do not hesitate to open a PR on the
documentation repository that can be found [here](https://github.com/provenancetech/pti-docs)
