import json
import logging
import os
import sys
import urllib.parse
from hashlib import sha256
from time import gmtime

import requests
from jwcrypto import jwk, jws, jwe
from jwcrypto.common import json_encode, json_decode


def environ_or_required(key):
    return (
        {'default': os.environ.get(key)} if os.environ.get(key)
        else {'required': True}
    )

def environ_or_default(key, default):
    return (
        {'default': os.environ.get(key)} if os.environ.get(key)
        else {'default': default}
    )

def get_http_gmt():
    """ Gets http gmt time. Returns a string."""
    days = {0: "Mon", 1: "Tue", 2: "Wed", 3: "Thu", 4: "Fri", 5: "Sat", 6: "Sun"}
    months = {1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"}
    time = gmtime()
    http_time = ["{day},".format(day = days[time.tm_wday])]
    http_time.append("{:02}".format(time.tm_mday))
    http_time.append("{month}".format(month = months[time.tm_mon]))
    http_time.append("{year}".format(year = time.tm_year))
    http_time.append("{:02}:{:02}:{:02}"          .format(time.tm_hour, time.tm_min, time.tm_sec))
    http_time.append("GMT")
    return " ".join(http_time)

def get_content_sha256(data):
    m = sha256(data)
    return m.hexdigest().upper()

def sign_payload(client_id, key, payload, compact=True):
    public_key = jwk.JWK()
    public_key.import_key(**json_decode(key.export_public()))
    jwstoken = jws.JWS(payload)
    jwstoken.add_signature(key, None,
                            json_encode({"alg": "RS512",
                                         "cid": client_id,
                                         "kid": public_key.thumbprint()}), None)
    signed_payload = jwstoken.serialize(compact)
    return signed_payload

def get_signature(client_id, private_key, url, method, data=None, content_type="application/json", date=get_http_gmt()):
    method = "GET"
    if data:
        method = "POST"

    logging.debug(f'Data: {data}')

    payload = method + "\n"
    if method == "POST":
        payload = payload + get_content_sha256(data.encode('UTF-8')) + "\n"
        payload = payload + 'content-type:' + content_type + "\n"
    else:
        payload + "\n\n"

    payload = payload + 'date:' + date + '\n'
    payload = payload + f'x-pti-client-id:{client_id}' + '\n'
    payload = payload + urllib.parse.urlparse(url).path
    signature = sign_payload(client_id, private_key, payload.encode('UTF-8'))

    logging.debug(f'Payload: {payload}', file=sys.stderr)
    logging.debug(f'Signature (JWS): {signature}', file=sys.stderr)

    return signature

def make_signed_request(client_id, request_id, key, url, method, data=None, content_type="application/json"):
    date = get_http_gmt()
    signature = get_signature(client_id, key, url, method, data, content_type, date)
    if method == "POST":
        resp = requests.post(url, data=data.encode('UTF-8'), headers={"Content-Type": content_type, "Date": date, "x-pti-signature": signature, "x-pti-client-id": client_id, "x-pti-request-id": request_id })
    else:
        resp = requests.get(url, headers={"Date": date, "x-pti-signature": signature,  "x-pti-client-id": client_id, "x-pti-request-id": request_id})

    return resp

def decrypt_verify_and_get_payload(private_encryption_key, public_signature_key, content):
      # decrypt
      jwetoken = jwe.JWE()
      jwetoken.deserialize(content, key=private_encryption_key)
      logging.debug(f'Payload correctly decrypted using our private key')
      if json.loads(jwetoken.objects['protected'])['alg'] != 'RSA-OAEP-256' or json.loads(jwetoken.objects['protected'])['enc'] != 'A256CBC-HS512':
        raise Exception('Unsupported encryption') # we have to check those, otherwise other encryptions can be used as an attack vector

      logging.debug(f'JWE payload: {jwetoken.payload}')
      # verify
      jwstoken = jws.JWS()
      jwstoken.deserialize(jwetoken.payload)

      if json.loads(jwstoken.objects['protected'])['alg'] != 'RS512':
        raise Exception('Unsupported signature algorithm') # we have to check, otherwise other algorithms can be used as an attack vector

      jwstoken.verify(public_signature_key) # if there's no exception, the signature is valid
      return jwstoken.payload

def set_logging_level(log_level):
    numeric_level = getattr(logging, log_level.upper(), None)
    if not isinstance(numeric_level, int):
        raise ValueError(f'Invalid log level: {log_level}')
    logging.basicConfig(level=numeric_level)
    logging.info(f'Log level is: {log_level.upper()}')

class JWKType(object):
    """Factory for creating JWK object types
    """

    def __init__(self):
        pass

    def __call__(self, path):
        with open(path, "rb") as private_key_file:
            encryption_private_key = jwk.JWK.from_json(private_key_file.read())
            return encryption_private_key
