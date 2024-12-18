---
title: "Buy/Sell"
slug: "buy"
excerpt: ""
hidden: true
createdAt: "Thu Dec 05 2024 14:47:50 GMT+0000 (Coordinated Universal Time)"
updatedAt: "Thu Dec 05 2024 21:19:32 GMT+0000 (Coordinated Universal Time)"
---
Marketplace transactions(buy and sell) must always be paired together, as 2 distinct calls to the API must be made. 

A "transactionGroupId" must be provided to link them together.

These transactions are aimed at managing ownership of [digital items](https://fiant.readme.io/reference/createdigitalitems).

The[ buy-side ](https://fiant.readme.io/reference/digitalitembuy)normally needs to be executed before because it involves the payment part (wallet, crypto, bank accout etc). 

Settlement for the [seller side](https://fiant.readme.io/reference/digitalitemsell) will be credit on Fiant's regulated wallet infrastructure.

If internal actions are required on your applicative layer to transfer ownership of the item, you will need to update the sell transaction with the [update transaction endpoint](https://fiant.readme.io/reference/providefeedback) and our workflow engine can be configured accordingly.

<br />

[block:tutorial-tile]
{
  "backgroundColor": "#018FF4",
  "emoji": "🖼️",
  "id": "67506ad8227528006848d6ef",
  "link": "https://fiant.readme.io/v1.0.184/recipes/transacting-digital-assets",
  "slug": "transacting-digital-assets",
  "title": "Transacting digital assets"
}
[/block]
