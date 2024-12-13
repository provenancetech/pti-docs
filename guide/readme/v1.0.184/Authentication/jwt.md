---
title: "JWT Tokens"
slug: "jwt"
excerpt: "If you need your users or third parties to be able to call the Fiant Core API on your behalf, for example for uploading a PII, you can generate a single-use JWT (JSON Web Token) restricted to that specific operation. You can then hand the token to your user/third-party. Remember, it's your responsibility to keep the token secure, as it provides (restricted) access to your Fiant(PTI) account."
hidden: false
createdAt: "Thu Dec 05 2024 14:28:58 GMT+0000 (Coordinated Universal Time)"
updatedAt: "Mon Dec 09 2024 19:56:57 GMT+0000 (Coordinated Universal Time)"
---
### Generating a single-use JWT with permissions for a specific URL

To generate a single-use token that can be used by one of your Users for a single request, you need to make a `POST` request to `/auth/jwt`.  
You need to specify the URL on which the token is to grant permission, eg, `{"url": "/transactions/deposit"}` and you will  
receive a JSON response containing `{"accessToken": "..."}`. The value of the `accessToken` field has to be included in the `x-pti-token` HTTP Header in the request made by your User.

The call to the `/auth/jwt` endpoint must be done via a signed request, so this means that you will need to have an endpoint in your own backend to proxy the request that will generate the auth token.

The following diagram illustrates the token generation process leading to an API call with a single use token.

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/8d4e837d8c4237a2596a67f69a46a868319213c5041e15fba66f06f364481be3-Screenshot_2024-12-05_at_10.00.05_AM.png",
        "",
        ""
      ],
      "align": "center"
    }
  ]
}
[/block]
