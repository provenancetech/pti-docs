import datetime

from flask import Flask, render_template, send_from_directory, request, redirect, url_for
from datetime import datetime, timezone
import json
import argparse
import logging
from pti_tools import make_signed_request, environ_or_default, environ_or_required, set_logging_level, JWKType, decrypt_verify_and_get_payload

p = argparse.ArgumentParser()
p.add_argument('-l', '--log-level', help='Output debug information to stderr', **environ_or_default('LOG_LEVEL', 'WARNING'))
p.add_argument('-sk', '--private-key', help='Path to the private/secret key', type=JWKType(), **environ_or_required('PRIVATE_KEY_PATH'))
p.add_argument('-pk', '--public-key', help='Path to PTI\'s public key', type=JWKType(), **environ_or_required('PUBLIC_KEY_PATH'))
p.add_argument('-c', '--client-id', help='PTI Client ID', **environ_or_required('CLIENT_ID'))
p.add_argument('-u', '--pti-api-base-url', help='PTI API base URL', **environ_or_default('PTI_API_BASE_URL', 'https://secure.apistaging.pticlient.com/v0'))
args = p.parse_args()
set_logging_level(args.log_level)

app = Flask('example_passthrough', static_url_path='', static_folder='web/static', template_folder='web/templates')
@app.route('/', methods=['GET'])
def make_transaction():
    return render_template('make_transaction.html')

@app.route('/admin/users')
def get_users():
    users = make_signed_request(args.client_id, args.private_key, f'{args.pti_api_base_url}/users/client/{args.client_id}', method="GET")
    return render_template('admin/users.html', users=users.json(), clientId=args.client_id)

@app.route('/admin/users', methods=['POST'])
def create_user():
    u = {"type": "PERSON", "id": request.form.get('userId'), "name": {"firstName": "unknown","lastName": "unknown"}}
    response = make_signed_request(args.client_id, args.private_key, f'{args.pti_api_base_url}/users', method="POST", data=json.dumps(u))
    return redirect(url_for('get_users'))

@app.route('/token/<userId>')
def get_token(userId):
    #we would probably verify the user's credentials here, check for time since last request, etc
    response = make_signed_request(args.client_id, args.private_key, f'{args.pti_api_base_url}/auth/userToken', method="POST", data='{"url":"/users/' + userId + '/transactions/fiat/funding","method": "POST"}')
    return response.json()['accessToken']

@app.route('/transactions', defaults={'userId': ''})
@app.route('/transactions/<userId>')
def prepare_transaction(userId):
    dt_string = datetime.now(timezone.utc).isoformat()
    return render_template('make_transaction.html', userId=userId, clientId=args.client_id,
                           serverUrl=args.pti_api_base_url, currentDate=dt_string)

@app.route('/webhook', methods=['POST'])
def webhook():
    #this would typically be running elsewhere
    logging.warning('Got webhook POST')
    encrypted_and_signed = request.get_json()

    payload = decrypt_verify_and_get_payload(args.private_key, args.public_key, json.dumps(encrypted_and_signed))
    logging.warning(f'Payload:\n{payload}')
    logging.warning('Successfully decrypted and verified payload')
    return '', 204

def run_server():
    app.run(port=8000, threaded=True, host='0.0.0.0')

if __name__ == "__main__":
    run_server()

