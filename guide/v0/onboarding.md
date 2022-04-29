# Onboarding

This page details the steps to follow in order to get access to the PTI platform.

## Generating a key pair

The PTI API uses asymmetric cryptography and singed tokens.
In order to get access to the PTI API and other services you first need to create yourself a set of credentials.
The PTI API makes extensive use of the [JWT](https://tools.ietf.org/html/rfc7519), [JWE](https://datatracker.ietf.org/doc/rfc7516) and [JWS](https://tools.ietf.org/html/rfc7515) standards.

Using the Python script provided [here](https://github.com/provenancetech/pti-docs/tree/master/utils/keygen.py), generate a keypair by running the following command, replacing `$CLIENT_NAME` with the name of your company.

```shell
python keygen.py ${CLIENT_NAME}
```

This will create a pair of files in the form of `${CLIENT_NAME}_private_key.jwk` and `${CLIENT_NAME}_public_key.jwk`.

**It is your responsibility** to make sure that your private key ( contents of `${CLIENT_NAME}_private_key.jwk` ) is handled and stored in a secure fashion.

## Opening your account with PTI

Once you are ready to start interacting with the PTI platform,
write an email to [PTI customer service](mailto:customerservice@provenancetech.io) requesting an account.
You need to provide these 2 pieces of information:

- **Your public key**: ( attach your `${CLIENT_NAME}_public_key.jwk` to the email)
- **Your webhook URL**: This must be an HTTPS URL under your control. You will receive all transaction and KYC statuses on it as POST requests.

As soon as your account application is approved, you will receive a client ID that will uniquely identify your account.

With your client ID and private key on hand, you are ready start using the PTI platform.

Visit the [SDK guide](sdk.md) to learn how to leverage PTI's hosted forms or the [authentication page](auth.md) to learn how to
interact securely with the PTI API.
