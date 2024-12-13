---
title: "Wire Deposits"
slug: "wire-deposits"
excerpt: ""
hidden: false
createdAt: "Tue Dec 10 2024 20:44:22 GMT+0000 (Coordinated Universal Time)"
updatedAt: "Tue Dec 10 2024 21:02:57 GMT+0000 (Coordinated Universal Time)"
---
In order to let your users deposit funds via Wire, we allow you to generate **unique** Virtual Bank Accounts for any USD Wallet. To do this, you need to use our [create VBA endpoint](https://fiant.readme.io/reference/createwalletvirtualbankaccount).

Once you've generated a VBA for your user's USD Wallet, you will be able to provide the Deposit Instructions for that Bank Account to your User using your own UI.

Finally, whenever we a Wire is received into that Bank Account, it will be automatically credited to your User's wallet and you will receive a Webhook notifying you about it.

[block:tutorial-tile]
{
  "backgroundColor": "#018FF4",
  "emoji": "💰",
  "id": "674f6b6ebaa6560024db2e26",
  "link": "https://fiant.readme.io/v1.0.184/recipes/deposit-some-funds-to-custodial-account",
  "slug": "deposit-some-funds-to-custodial-account",
  "title": "Deposit some funds to custodial account"
}
[/block]
