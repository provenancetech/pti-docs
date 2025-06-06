---
title: "Receiving webhooks"
slug: "receiving-webhooks"
excerpt: "You need to expose a publicly accessible endpoint so Fiant can send you webhooks to update status of various operations that you initiate with the platform.\n\nFiant provides robust ways to protect your webhook against external attacks:"
hidden: false
createdAt: "Fri Dec 13 2024 14:10:24 GMT+0000 (Coordinated Universal Time)"
updatedAt: "Thu Dec 19 2024 20:27:14 GMT+0000 (Coordinated Universal Time)"
---
## Webhook content decryption

You need to use your private key to decrypt the message's content.

### Raw code example

```python
 def decrypt(payload, private_key):
 jwetoken = jwe.JWE()
        jwetoken.deserialize(payload, private_key, pub_key)
        if json.loads(jwetoken.objects['protected'])['alg'] != 'RSA-OAEP-256' or \
                json.loads(jwetoken.objects['protected'])[
                    'enc'] != 'A256CBC-HS512':
            raise Exception('Unsupported encryption')

        jwstoken = jws.JWS()
        jwstoken.deserialize(jwetoken.payload)

        if json.loads(jwstoken.objects['protected'])['alg'] != 'RS512':
            raise Exception('Unsupported signature algorithm')
        
        verify_signature(jwstoken, pub_key)

        return jwstoken.payload
```

### SDK code example

The simplest way to receive webhook is to use one of our SDK.

```java
Sting content = sdk.decodeWebhookPayload(payload); 
```

## Verify Fiant signature in the messages

This step is optional but highly recommended, that enables you to ensure that the message really originates from Fiant.

### Raw code example

```python
def verify_signature(jwstoken, pub_key):
      jwstoken.verify(pub_key)
```

### SDK code example

```java
Sting content = sdk.decodeWebhookPayload(payload); 
// This decrypts the webhook content and verify the PTI signature.
```
