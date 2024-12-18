---
title: "Status codes"
slug: "status-codes"
excerpt: ""
hidden: false
createdAt: "Thu Dec 05 2024 19:46:52 GMT+0000 (Coordinated Universal Time)"
updatedAt: "Fri Dec 06 2024 19:42:40 GMT+0000 (Coordinated Universal Time)"
---
Fiant uses conventional HTTP response codes to indicate the success or failure of an API request.  
In general, codes in the 2xx range indicate success. Codes in the 4xx range indicate an error.  
Codes in the 5xx range indicate an error with Fiant servers (these are rare and should not happen).

The following table details the meaning of the various codes that can be returned by the API:

| Code | Short                | Description                                                                                                                                                                                  |
| ---- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200  | OK                   | Everything worked as expected.                                                                                                                                                               |
| 201  | Created              | The request has been fulfilled and has resulted in one or more new resources being created.                                                                                                  |
| 202  | Accepted             | The request has been accepted for processing, but the processing has not been completed. You _might_ get a response back on your Webhook eventually.                                         |
| 400  | Bad Request          | The request was unacceptable, often due to missing a required parameter.                                                                                                                     |
| 401  | Unauthorized         | No valid Signature or Token provided.                                                                                                                                                        |
| 402  | Request Failed       | The parameters were valid but the request failed.                                                                                                                                            |
| 403  | Forbidden            | The Client or the Token doesn't have permissions to perform the request.                                                                                                                     |
| 404  | Not Found            | The requested resource doesn't exist.                                                                                                                                                        |
| 422  | Unprocessable entity | One of these 2 cases: More information about the User is needed in order to approve the transaction. There is no approved assessment for this user that enables him to perform the operation |
| 409  | Conflict             | The request conflicts with another request (perhaps due to using the same `REQUEST ID` twice).                                                                                               |
| 429  | Too Many Requests    | Too many requests hit the API too quickly. We recommend an exponential backoff of your requests.                                                                                             |
| 5xx  | Server Errors        | Something went wrong on PTI servers. (These are rare and should not happen)                                                                                                                  |
