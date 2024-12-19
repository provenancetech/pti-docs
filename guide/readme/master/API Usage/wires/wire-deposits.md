---
title: "Wire Deposits"
slug: "wire-deposits"
excerpt: ""
hidden: false
createdAt: "Fri Dec 13 2024 14:10:24 GMT+0000 (Coordinated Universal Time)"
updatedAt: "Thu Dec 19 2024 20:23:51 GMT+0000 (Coordinated Universal Time)"
---
In order to let your users deposit funds via Wire, we allow you to generate **unique** Virtual Bank Accounts for any USD Wallet. To do this, you need to use our [create VBA endpoint](https://fiant.readme.io/reference/createwalletvirtualbankaccount).

Once you've generated a VBA for your user's USD Wallet, you will be able to provide the Deposit Instructions for that Bank Account to your User using your own UI.

Finally, whenever a Wire is received into that Bank Account, it will be automatically credited to your User's wallet and you will receive a Webhook notifying you about it.

[block:tutorial-tile]
{
  "backgroundColor": "#018FF4",
  "emoji": "💰",
  "id": "675c779ea404af004826d4fe",
  "link": "https://fiant.readme.io/v999/recipes/wire-deposit",
  "slug": "wire-deposit",
  "title": "Wire Deposit"
}
[/block]
