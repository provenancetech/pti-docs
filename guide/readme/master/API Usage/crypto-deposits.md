---
title: "Crypto Deposits"
slug: "crypto-deposits"
excerpt: ""
hidden: false
createdAt: "Fri Dec 13 2024 14:10:24 GMT+0000 (Coordinated Universal Time)"
updatedAt: "Tue Dec 17 2024 20:09:54 GMT+0000 (Coordinated Universal Time)"
---
In order to let your users deposit any of the Cryptocurrencies that we support, we allow you to generate **unique** deposit addresses for any Crypto Wallet. To do this, you need to use our [create Deposit Address endpoint](https://fiant.readme.io/reference/createwalletdepositaddress).

Once you've generated the Deposit Address for your user's Wallet, you will be able to provide it to your user using your own UI.

Finally, whenever a transfer is received into the wallet's deposit address, it will be automatically credited to your User's wallet and you will receive a Webhook notifying you about it.

[block:tutorial-tile]
{
  "backgroundColor": "#018FF4",
  "emoji": "💸",
  "id": "675ca48d1daf66004672ba46",
  "link": "https://fiant.readme.io/v999/recipes/crypto-deposit",
  "slug": "crypto-deposit",
  "title": "Crypto Deposit"
}
[/block]
