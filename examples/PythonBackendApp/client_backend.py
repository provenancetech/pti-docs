import argparse
import logging

from flask import Flask, request

from pti_tools import make_signed_request, environ_or_default, environ_or_required, set_logging_level, JWKType

p = argparse.ArgumentParser()
p.add_argument('-l', '--log-level', help='Output debug information to stderr', **environ_or_default('LOG_LEVEL', 'DEBUG'))
p.add_argument('-sk', '--private-key', help='Path to the private/secret key', type=JWKType(), **environ_or_required('PRIVATE_KEY_PATH'))
p.add_argument('-c', '--client-id', help='PTI Client ID', **environ_or_required('CLIENT_ID'))
p.add_argument('-u', '--pti-api-base-url', help='PTI API base URL', **environ_or_default('PTI_API_BASE_URL', 'https://pti.apidev.pticlient.com/v0'))
args = p.parse_args()
set_logging_level(args.log_level)

app = Flask('example_passthrough', static_url_path='', static_folder='web/static', template_folder='web/templates')

@app.route('/generateToken', methods=['POST'])
def generate_token():
    payload = request.get_json()
    logging.info(payload)
    logging.info(payload['x-pti-token-payload'])
    response = make_signed_request(args.client_id, args.private_key, f'{args.pti_api_base_url}/auth/userToken', method="POST", data=str(payload['x-pti-token-payload']))
    logging.info(response)
    return response.json()['accessToken']

def run_server():
    app.run(port=8000, threaded=True, host='0.0.0.0')

if __name__ == "__main__":
    run_server()

