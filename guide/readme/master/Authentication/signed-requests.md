---
title: "Signing a request"
slug: "signed-requests"
excerpt: "Signed requests require access to the private key to sign the request, so it is only possible to use this method when the API calls are made from a private client. Only your server backend should make signed requests."
hidden: false
createdAt: "Fri Dec 13 2024 14:10:24 GMT+0000 (Coordinated Universal Time)"
updatedAt: "Fri Dec 13 2024 14:10:26 GMT+0000 (Coordinated Universal Time)"
---
### Making signed requests

Once you have your private key and your client ID and private key on hand, you can make requests to the Fiant Core API. 

To make a signed request to the Fiant Core API, you must include at least the two following headers:

- `x-pti-client-id` with the value set to your client ID
- `x-pti-signature` with the value set to the compact form of a JSON Web Signature (JWS)

The payload to sign must observe the following structure:

```
${HTTP-Verb of request}
${SHA256 of request body}
${Content Type}
date:${Current Date}
x-pti-client-id:${Your client ID}
${Endpoint URL of the request}
```

Note that the carriage returns `\n` in the payload must be present

Your private key is used to sign the Payload; the result of this is a JWS structure. The compact form of this structure is used as the `x-pti-signature` header content.

For example, for a POST request to `/v1/users` with a body of `{"name": "Jane Doe", "id": "my_internal_id-12345678"}`, the content of the payload to sign would be:

```
POST
63E6F62C55553EA2AEC0DE86662A22A7
content-type:application/json
date:Wed, 15 Apr 2020 16:35:50 GMT
x-pti-client-id:00000000-0000-0000-0000-000000000000
/v1/users
```

Once signed using JWS (compact form), you get:

```
eyJhbGciOiJFZERTQSIsImNpZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImNydiI6IkVkMjU1MTkiLCJraWQiOiJLWHk0SU1idEhpaXJQN2tBQXdFOXFydVQwejlNUEx3MUlCUER5dmNja3VrIn0.UE9TVAo2M0U2RjYyQzU1NTUzRUEyQUVDMERFODY2NjJBMjJBNwpjb250ZW50LXR5cGU6YXBwbGljYXRpb24vanNvbgpkYXRlOldlZCwgMTUgQXByIDIwMjAgMTY6MzU6NTAgR01UCngtcHRpLWNsaWVudC1pZDowMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAKL3YwL3VzZXJz.CDfqOdRglnxdjBjPAow7dpX6um6bSXvJGEBeICl3VVQi1ERfstMgRlWP67YiAyLy04pqNnkMjO_DNNefKpGnBQ
```

You would then include the JWS as your Signature in the `x-pti-signature` http header of your request. You also need to include a `x-pti-client-id` http header containing your PTI Client ID.

The payload to sign for a GET request to `/v1/users/00000000-0000-0000-0000-000000000000` would look like:

```
GET


date:Wed, 15 Apr 2020 16:35:50 GMT
x-pti-client-id:00000000-0000-0000-0000-000000000000
/v1/users/00000000-0000-0000-0000-000000000000
```

Note that for a GET request, `${SHA256 of request body}` and `${Content Type}` are empty, but the `\n` following them are still included. 

You must include `${SHA256 of request body}` and `${Content Type}` for POST, PATCH and PUT requests.

#### Helper tool to make signed requests

You can use the [signed_request_maker.py](https://github.com/provenancetech/pti-docs/blob/master/utils/signed_request_maker.py) utility to make signed requests to the Fiant Core API. It's useful as a testing and learning tool for signed requests.

For example:

```shell
python signed_request_maker.py --clientId "00000000-0000-0000-0000-000000000000" --http-method 'POST' --data '{"name": "Jane Doe", "id": "my_internal_id-12345678"}' -k private_key.jwk --debug https//api.staging.fiant.io
```
