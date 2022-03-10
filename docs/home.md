# Provenance Technologies Documentation

Welcome to Provenance Technologies (PTI) documentation site. Here, you will find all the relevant information needed for integrating with and leveraging the PTI platform.

# Overview

The PTI platform provides you with components that will allow you to achieve compliance while minimizing the amount of effort needed on your end to do so.

# Definitions
### Compliance
Being in compliance means acting in accordance to local laws and regulations. Ensuring that all the required information is collected, all value transfers are appropriately licensed is all part of achieving compliance. The PTI platform aims to simplify this process as much as possible, but ultimately, PTI clients also have their role to play and are responsible for using the PTI platform correctly to achieve compliance.

### KYC         
Acronym for Know Your Customer. In this documentation, "performing a KYC" means collecting as set of information about a person and returning a status.

### KYC Tier
The KYC tier, also referred to as the KYC level, is a grouping of information about a person associated to a numeric value. 
Depending on the information collected and the returned status, a person will be considered to have reached a KYC level. 
Higher tiers will require all the information from the lower levels.

### Transaction
A transaction, in its general form, represents a transfer of assets from an originator to a recipient. Here are the 3 types of transactions that exist:
- **Funding**: Transaction used to add funds to a user account.
- **Transfer**: Transaction used to transfer or convert crypto assets between the originator and the recipient.
- **Withdrawal**: Transaction used to sell crypto assets and convert them to a government issued currency.


# Components

## Hosted Forms
In order to simplify a secure integration to the PTI platform, hosted forms are provided for the following use cases:
* Collection of information for the KYC flow
* Payment for a Deposit transaction

## Web SDK
The web sdk is a publicly available Javascript library provided to simplify the integration of the Hosted Forms in the client UI. It also enables the tracking of user devices and UI interactions to improve the detection of malicious behaviour.

## REST API
The REST API is the central part of the PTI platform. Its endpoints focus around these main areas:

- User creation and management
- KYC cycle management
- Transaction management and logging

# Integration

## Onboarding

Follow our [onboarding guide](./onboarding.md) to learn about the steps to follow in order to get access to and start using the PTI platform.

## Authentication and authorization

The [authentication page](./auth.md) provides all the information required and steps to follow in order to be able to securely interact with the PTI platform.

## Configuring KYC flows

The [KYC page](./kyc.md) details the different ways the KYC flow can be configured and customized to suit various use cases.


## Leveraging the SDK

The [SDK page](./sdk.md) contains guidance on how to use the PTI SDK to simplify the embedding of the hosted forms and track UI events.

## API Usage

The [API usage page](./usage.md) demonstrates how communicate via the PTI API and associated webhooks.
