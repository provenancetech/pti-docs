---
title: "Buy/Sell"
slug: "buy"
excerpt: ""
hidden: false
createdAt: "Fri Dec 13 2024 14:10:24 GMT+0000 (Coordinated Universal Time)"
updatedAt: "Wed Dec 18 2024 21:02:23 GMT+0000 (Coordinated Universal Time)"
---
Marketplace transactions(buy and sell) must always be paired together, as 2 distinct calls to the API must be made. 

A "transactionGroupId" must be provided to link them together.

These transactions are aimed at managing ownership of [digital items](https://fiant.readme.io/reference/createdigitalitems).

The[ buy-side ](https://fiant.readme.io/reference/digitalitembuy)normally needs to be executed before because it involves the payment part (wallet, crypto, bank accout etc). 

Settlement for the [seller side](https://fiant.readme.io/reference/digitalitemsell) will be credit on Fiant's regulated wallet infrastructure.

If internal actions are required on your applicative layer to transfer ownership of the item, you will need to update the sell transaction with the [update transaction endpoint](https://fiant.readme.io/reference/providefeedback) and our workflow engine can be configured accordingly.

[block:tutorial-tile]
{
  "backgroundColor": "#018FF4",
  "emoji": "🖼️",
  "id": "67604b128a47c400104234e4",
  "link": "https://fiant.readme.io/v999/recipes/transacting-digital-assets",
  "slug": "transacting-digital-assets",
  "title": "Transacting Digital Assets"
}
[/block]
