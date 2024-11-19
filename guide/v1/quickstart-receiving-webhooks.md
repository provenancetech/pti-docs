# How to receive webhooks
You need to expose a publicly accessible endpoint so Fiant can send you webhooks to update status of various operations that you initiate with the platform.

Fiant provides robust ways to protect your webhook against external attacks:

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
```java

```

## Verify Fiant signature in the messages
This step is optional but highly recommended, that enables you to ensure that the message really originates from Fiant.
You can find the sandbox public key [here](sandbox.pub) and the production one [here](prod.pub) 

### Raw code example
```python
def verify_signature(jwstoken, pub_key):
      jwstoken.verify(pub_key)
```
### SDK code example
```java
```