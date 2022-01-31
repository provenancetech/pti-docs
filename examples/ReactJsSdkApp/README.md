# REACT example application

> Note, this has been tested with Node 16
## Frontend
Use the project `ReactJsSdkApp`:

Install all the dependencies of this REACT application. `yarn install`\
Start the client. `yarn start`\
Run the backend to generate the tokens.

## Backend
Use the project `PythonBackendApp`:

Start the backend.
```
python3 client_backend.py -sk <path private key> -pk <path PTI public key> -c <client id>

Ex:
python3 client_backend.py -sk ~/jwk/cucumber_key.pem -pk ~/jwk/pti_public.jtw -c 3450582c-1955-11eb-adc1-0242ac120002
```

Then you can trigger the popup closure with a curl request on the backend, like this :
```
curl -X POST -d '{"requestId":"<id of the request>"}' http://localhost:5000/webhook
```

> ***N.B.*** When developing, we all use the same existing client account: "cucumber". \
Ask the other devs, if you don't have the private & public key for this account. \
"Cucumber"'s client id is : `3450582c-1955-11eb-adc1-0242ac120002` \
To see a listing of existing clients, go on the `pti-dev-clients.client` database.
