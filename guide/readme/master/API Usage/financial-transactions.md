---
title: "Transactions"
slug: "financial-transactions"
excerpt: "Executing financial transactions on the Fiant platform is straightforward. \nUsing this set of endpoints is also taking care of compliance requirements for you."
hidden: false
createdAt: "Fri Dec 13 2024 14:10:24 GMT+0000 (Coordinated Universal Time)"
updatedAt: "Wed Dec 18 2024 21:04:20 GMT+0000 (Coordinated Universal Time)"
---
Once your user has the required assessment level acceptance, you can execute transactions.  
Again, you will need the `USER_ID` of the user originating the transaction. You must also provide a `REQUEST_ID` that you must store  
to be able to correlate the webhook [transaction monitoring result](https://fiant.readme.io/docs/webhook-definitions#transaction-monitoring-result) and [payment processing update](https://fiant.readme.io/docs/webhook-definitions#payment-processing-update)  to this specific transaction.

You may need to complete the transaction cycle, especially for some operations, like sell operations, if they require actions being taken on your proprietary infrastructure. For the cases, you should provide feedback on the transaction once it is finalized on your side using the [Update transaction endpoint](https://fiant.readme.io/reference/providefeedback)  
You need to use the same `REQUEST_ID` you used in the log transaction API call.

In the following sections you will see specific details for all the types of Transactions that our platform supports:

- **Deposits**
- **Transfers**
- **Withdrawals**
- **Trades**
