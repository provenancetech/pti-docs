Install all the dependencies of this REACT application with `yarn install` 

Start the client with `yarn start`

Then you need a backend to generate the tokens.

Use the project `PythonBackendApp`, start it like that :

```
python3 client_backend.py -sk <path to private key> -pk <PTI public key> -c <client id i.e. be623155-18f7-40fc-99ed-27660c14e513>
```

Then you can trigger the popup closure with a curl request on the backend, like this :

```
curl -X POST -d '{"requestId":"<id of the request>"}' http://localhost:5000/webhook
```
