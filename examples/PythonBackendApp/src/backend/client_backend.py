import argparse
import logging
import json
import uuid

from flask import Flask, request
from flask_socketio import SocketIO

from pti_tools import make_signed_request, environ_or_default, environ_or_required, set_logging_level, JWKType, decrypt_verify_and_get_payload

p = argparse.ArgumentParser()
p.add_argument('-l', '--log-level', help='Output debug information to stderr',
               **environ_or_default('LOG_LEVEL', 'DEBUG'))
p.add_argument('-pk', '--public-key', help='Path to PTI\'s public key', type=JWKType(), **environ_or_required('PUBLIC_KEY_PATH'))
p.add_argument('-sk', '--private-key', help='Path to the private/secret key', type=JWKType(),
               **environ_or_required('PRIVATE_KEY_PATH'))
p.add_argument('-c', '--client-id', help='PTI Client ID', **environ_or_required('CLIENT_ID'))
p.add_argument('-u', '--pti-api-base-url', help='PTI API base URL',
               **environ_or_default('PTI_API_BASE_URL', 'https://pti.apidev.pticlient.com/v0'))
args = p.parse_args()
set_logging_level(args.log_level)

app = Flask('example_backend', static_url_path='')
socketio = SocketIO(app, cors_allowed_origins='*')

@app.route('/generateToken', methods=['POST'])
def generate_token():
    payload = request.get_json()
    json_data = json.dumps(payload['x-pti-token-payload'])
    response = make_signed_request(args.client_id, str(uuid.uuid4()), args.private_key, f'{args.pti_api_base_url}/auth/userToken',
                                   method="POST", data=json_data)
    if response.status_code != 200:
        return '', response.status_code

    return response.json()

@app.route('/webhook', methods=['POST'])
def webhook():
    #this would typically be running elsewhere
    logging.warning('Got webhook POST')
    encrypted_and_signed = request.get_json()

    payload = decrypt_verify_and_get_payload(args.private_key, args.public_key, json.dumps(encrypted_and_signed))
    json_payload = json.loads(payload)
    if type(json_payload) is str:
        json_payload = json.loads(json_payload)
    logging.warning(f'Payload:\n{json_payload}')
    logging.warning('Successfully decrypted and verified payload')
    socketio.emit(json_payload['requestId'], json_payload)
    return '', 204

def run_server():
    socketio.run(app, host='::', port=5100)

if __name__ == "__main__":
    run_server()
