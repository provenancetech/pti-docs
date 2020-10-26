from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import requests
import sys
from jwcrypto import jws, jwk, jwe

class PTIWebhookRequestHandler(BaseHTTPRequestHandler):
    def decrypt_and_verify(self, content):
      # decrypt
      jwetoken = jwe.JWE()
      jwetoken.deserialize(content, key=encryption_private_key)
      if json.loads(jwetoken.objects['protected'])['alg'] != 'RSA-OAEP-256' or json.loads(jwetoken.objects['protected'])['enc'] != 'A256CBC-HS512':
        raise Exception('Unsupported encryption') # we have to check those, otherwise other encryptions can be used as an attack vector

      # verify
      jwstoken = jws.JWS()
      jwstoken.deserialize(jwetoken.payload)

      if signature_public_key is None:
        jku = json.loads(jwstoken.objects['protected'])['jku']
        kid = json.loads(jwstoken.objects['protected'])['kid']

        #NOTE: to be certain to use a valid public key, one would have to check the
        #      domain name and SSL certificate's Common Name against a whitelisted list
        keys = requests.get(jku).content
        keyset = jwk.JWKSet()
        keyset.import_keyset(keys)
        verification_key = keyset.get_key(kid)
      else:
        verification_key = signature_public_key

      if json.loads(jwstoken.objects['protected'])['alg'] != 'RS512':
        raise Exception('Unsupported signature algorithm') # we have to check, otherwise other algorithms can be used as an attack vector

      jwstoken.verify(verification_key) # if there's no exception, the signature is valid
      return jwstoken.payload

    def do_POST(self):
      content_length = int(self.headers['Content-Length'])
      post_data = self.rfile.read(content_length)
      decrypted_and_verified = self.decrypt_and_verify(post_data)

      print(decrypted_and_verified) # TODO: do something useful with the decrypted payload

      self.send_response(200)
      self.send_header('Content-type', 'application/json')
      self.end_headers()
      self.wfile.write('{"status": "OK"}'.encode('utf-8'))

with open(sys.argv[1], "rb") as private_key_file:
    encryption_private_key = jwk.JWK.from_json(private_key_file.read())

if len(sys.argv) > 2:
  with open(sys.argv[2], "rb") as public_key_file:
      signature_public_key = jwk.JWK.from_json(public_key_file.read())

httpd = HTTPServer(('0.0.0.0', 8005), PTIWebhookRequestHandler)
httpd.serve_forever()
