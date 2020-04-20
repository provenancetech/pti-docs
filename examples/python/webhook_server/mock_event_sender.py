import json
import sys
import argparse
import requests
from jwcrypto import jws, jwk, jwe
from jwcrypto.common import json_encode, json_decode

parser = argparse.ArgumentParser()
parser.add_argument("-e", "--encryption-public-key", required=True, help="Path to the JWK public key used for encryption")
parser.add_argument("-s", "--signature-private-key", required=True, help="Path to the JWK private key used for signing the payload")
parser.add_argument("--jku", default="https://devnull-as-a-service.com/.well-known/jwks.json.", help="URL to set for the JWK Keyset (JKU)")
parser.add_argument("--data", required=True, help="The data to post to the Webhook server.")
parser.add_argument("--content-type", default="application/json", help="The content-type of the data to post.")
parser.add_argument("url", help="The URL of the Webhook server.")
parser.add_argument("--debug", action='store_true')
args = parser.parse_args()


def encrypt_payload(payload, public_key, compact=False):
    protected_header = {
        "alg": "RSA-OAEP-256",
        "enc": "A256CBC-HS512",
        "kid": public_key.thumbprint(),
    }
    jwetoken = jwe.JWE(payload,
                        recipient=public_key,
                        protected=protected_header)
    encypted_payload = jwetoken.serialize(compact)
    return encypted_payload

def sign(payload, private_key, jku, compact=False):
    jwstoken = jws.JWS(payload)
    jwstoken.add_signature(private_key, None,
                            json_encode({"alg": "RS512",
                                         "kid": private_key.public().thumbprint(),
                                         "jku": jku}))
    signed_payload = jwstoken.serialize(compact)
    return signed_payload

def get_encrypted_signed_payload(payload, public_key_content, private_key_content, jku_url, compact=False):
    #RFC 7519 recommends signing then encrypting: https://tools.ietf.org/html/rfc7519#section-11.2
    signed = sign(payload, private_key_content, jku_url, compact)
    encrypted = encrypt_payload(signed, public_key_content, compact)
    return encrypted

with open(args.encryption_public_key, "rb") as encryption_key_file:
    encryption_public_key = jwk.JWK.from_json(encryption_key_file.read()).public()

with open(args.signature_private_key, "rb") as signature_key_file:
    signature_private_key = jwk.JWK.from_json(signature_key_file.read())

payload = get_encrypted_signed_payload(args.data, encryption_public_key, signature_private_key, args.jku)
print(payload)
resp = requests.post(args.url, data = payload, headers={"Content-Type": args.content_type})
print(resp.text)