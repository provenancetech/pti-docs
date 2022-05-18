from hashlib import sha256
from time import gmtime
import urllib.parse
import argparse
import uuid
from jwcrypto import jwk, jws
from jwcrypto.common import json_encode, json_decode
import requests


parser = argparse.ArgumentParser()
parser.add_argument("-k", "--key-path", help="Path to the JWK private key.")
parser.add_argument("-d", "--data", help="The body of the request.")
parser.add_argument("-c", "--client-id", help="PTI client ID (UUID)")
parser.add_argument("--url", help="Where to send the request")
parser.add_argument("--http-method", help="HTTP method used to make the request", default="GET")
args = parser.parse_args()

def get_http_gmt():
    """ Gets http gmt time. Returns a string."""
    days = {0: "Mon", 1: "Tue", 2: "Wed", 3: "Thu", 4: "Fri", 5: "Sat", 6: "Sun"}
    months = {1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct",
              11: "Nov", 12: "Dec"}
    time = gmtime()
    http_time = ["{day},".format(day=days[time.tm_wday])]
    http_time.append("{:02}".format(time.tm_mday))
    http_time.append("{month}".format(month=months[time.tm_mon]))
    http_time.append("{year}".format(year=time.tm_year))
    http_time.append("{:02}:{:02}:{:02}".format(time.tm_hour, time.tm_min, time.tm_sec))
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


def get_signature(client_id, private_key, url, method, data, date):
    payload = method + "\n"
    if method in ["POST", "PUT", "PATCH"]:
        payload = payload + get_content_sha256(data.encode('UTF-8')) + "\n"
        payload = payload + "content-type:application/json" + "\n"
    else:
        payload += "\n\n"

    payload = payload + 'date:' + date + '\n'
    payload = payload + f'x-pti-client-id:{client_id}' + '\n'
    payload = payload + urllib.parse.urlparse(url).path
    signature = sign_payload(client_id, private_key, payload.encode('UTF-8'))

    return signature


def make_signed_request(client_id: str, request_id: str, key: jwk.JWK, url: str, method: str, data=None):
    date = get_http_gmt()
    signature = get_signature(client_id, key, url, method, data, date)
    headers = {"Date": date, "x-pti-signature": signature, "x-pti-client-id": client_id, "x-pti-request-id": request_id}
    if method in ["POST", "PATCH", "PUT"]:
        headers.update({"Content-Type": "application/json"})
        params = {
            "url": url,
            "headers": headers,
            "data": data.encode("UTF-8")
        }
    else:
        params = {
            "url": url,
            "headers": headers,
        }

    request_func = getattr(requests, method.lower())

    resp = request_func(**params)

    return resp


def load_private_key_from_file(private_key_filepath: str) -> jwk.JWK:
    with open(private_key_filepath, mode="rt", encoding="utf-8") as f:
        return jwk.JWK.from_json(f.read())


if __name__ == "__main__":
    private_key = load_private_key_from_file(args.key_path)
    resp = make_signed_request(
        client_id=args.client_id,
        request_id=str(uuid.uuid4()),
        key=private_key,
        url=args.url,
        method=args.http_method,
        data=args.data
    )
    print(resp.json())
