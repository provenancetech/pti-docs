# REACT example application

> Note, this has been tested with Node 16
## Frontend
Use the project `ReactJsSdkApp`:

Install all the dependencies of this REACT application. `yarn install`\
Start the client. `yarn start`\
Run the backend to generate the tokens.

## Backend
A simple sample backend is provided to allow the generation of single use tokens as well as serving as an endpoint for the webhook calls.

## Requirements
* Python 3.9 or later
* Poetry package manager ( optional )

### Installing dependencies
It is possible to install the dependencies via Poetry or pip. Both methods are explained below.

#### Installation via Poetry package manager
From the root of this repo (`pti-docs`), run this command 

`poetry install`

#### Installation using pip
From the directory of the backend sample application  `PythonBackendApp`, run the following command:

`pip install -r requirements.txt`

### Starting the backend.
From the directory of the backend sample application  `PythonBackendApp`, run the following command:

```
python3 client_backend.py -sk <private_key> -pk <pti_public_key> -c <client id> -u <pti_api_url>
```

* `private_key`: path to a JWS json file containing your private key. It must match the public key in the endpoint you are targeting on the PTI platform
* `pti_public_key`: path to PTI's prod public key. That key should be used to verify the signatures of webhook calls made by PTT. This public key is the `utils/pti-prod-public.jwk` provided in this repository.
* `client_id`: ID provided to you during onboarding. This ID must have been setup by PTI in the targeted environment.
* `pti_api_url`: Root url of the targeted PTI API. E.g. `https://pti.apistaging.pticlient.com/v0`


### Exposed endpoints

* `/generateToken`: This endpoint allows the generation of single use tokens for a specific PTI API call
* `/webhook`: This endpoint will decrypt and verify the payload of webhook calls coming from the PTI api.
