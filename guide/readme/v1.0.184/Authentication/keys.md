---
title: "Access & Keys"
slug: "keys"
excerpt: "This page details the steps to follow to get access to the Fiant platform."
hidden: false
createdAt: "Thu Dec 05 2024 14:50:12 GMT+0000 (Coordinated Universal Time)"
updatedAt: "Mon Dec 09 2024 19:53:26 GMT+0000 (Coordinated Universal Time)"
---
## Generating a key pair

The Fiant Core API uses asymmetric cryptography and signed tokens.  
To get access to the PTI API and other services you first need to create yourself a set of credentials.  
The PTI API makes extensive use of the [JWT](https://tools.ietf.org/html/rfc7519), [JWE](https://datatracker.ietf.org/doc/rfc7516) and [JWS](https://tools.ietf.org/html/rfc7515) standards.

Using the Python script provided [here](https://github.com/provenancetech/pti-docs/tree/master/utils/keygen.py), generate a keypair by running the following command, replacing `$CLIENT_NAME` with the name of your company.

```shell
python keygen.py ${CLIENT_NAME}
```

This will create a pair of files in the form of `${CLIENT_NAME}_private_key.jwk` and `${CLIENT_NAME}_public_key.jwk`.

**It is your responsibility** to make sure that your private key ( contents of `${CLIENT_NAME}_private_key.jwk` ) is handled and stored securely.

## Opening your account with Fiant

Once you are ready to start interacting with the Fiant platform,  
write an email to [Fiant customer service](mailto:customerservice@provenancetech.io) requesting an account.  
You need to provide these 2 pieces of information:

- **Your public key**: ( attach your `${CLIENT_NAME}_public_key.jwk` to the email)
- **Your webhook URL**: This must be an HTTPS URL under your control. You will receive all transactions and KYC statuses on it as POST requests.

As soon as your account application is approved, you will receive a Client ID that will uniquely identify your account.

With your client ID and private key on hand, you are ready start using the platform.
