### Transacting Digital Assets

#### Setup Users
```java
Person seller = Person.builder().id(UUID.randomUUID().toString()).name(Name.builder().
	lastName("Doe").firstName("John").build()).build();

WalletCreation sellerWallet = WalletCreation.builder().currency(CurrencyEnum.USD).
  label("Seller USD Wallet").
  walletId(UUID.randomUUID().toString()).build();
Wallet createdSellerWallet = sdk.wallets().createWallet(seller.getId(), sellerWallet);
WalletPaymentMethod sellerWalletPaymentMethod = WalletPaymentMethod.builder().
  paymentInformation(createdSellerWallet).build();

Person buyer = Person.builder().id(UUID.randomUUID().toString()).name(Name.builder().
	lastName("Doe").firstName("Jane").build()).build();

WalletCreation buyerWallet = WalletCreation.builder().currency(CurrencyEnum.USD).label("Buyer USD Wallet").
  walletId(UUID.randomUUID().toString()).build();
Wallet createdBuyerWallet = sdk.wallets().createWallet(seller.getId(), buyerWallet);
WalletPaymentMethod buyerWalletPaymentMethod = WalletPaymentMethod.builder().
  paymentInformation(createdBuyerWallet).build();

Person creator = Person.builder().id(UUID.randomUUID().toString()).name(Name.builder().
	lastName("Doe").firstName("Bob").build()).build();

WalletCreation creatorWallet = WalletCreation.builder().currency(CurrencyEnum.USD).
  label("Creator USD Wallet").
  walletId(UUID.randomUUID().toString()).build();
Wallet createdCreatorWallet = sdk.wallets().
  createWallet(seller.getId(), creatorWallet);

DigitalItem digitalItem = DigitalItem.builder().
  itemReference(UUID.randomUUID().toString()).
  itemTitle("Item").itemDescription("Description").
  digitalItemType(DigitalItemType.NFT).
  itemUsdValue(100.00).build();
```

```curl
curl --location 'https://api.staging.fiant.io/v1/users/seller_id/wallets' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' 
--header 'x-pti-signature;' \
--data '{
  "currency": "USD",
  "type": "WALLET",
  "walletId": "1ede814a-a698-44ba-9050-da23e99de7ee",
  "label": "Seller USD Wallet"
}'

curl --location 'https://api.staging.fiant.io/v1/users/buyer_id/wallets' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'Date;' \
--header 'x-pti-signature;' \
--data '{
  "currency": "USD",
  "type": "WALLET",
  "walletId": "999e814a-a698-44ba-9050-da23e99de7ee",
  "label": "Buyer USD Wallet"
}'

curl --location 'https://api.staging.fiant.io/v1/users/creator_id/wallets' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'Date;' \
--header 'x-pti-signature;' \
--data '{
  "currency": "USD",
  "type": "WALLET",
  "walletId": "888e814a-a698-44ba-9050-da23e99de7ee",
  "label": "Creator USD Wallet"
}'
```

#### Create Digital Asset
```java
sdk.marketplace().createDigitalItems(creator.getId(), List.of(digitalItem));
```

```curl
curl --location 'https://api.staging.fiant.io/v1/users/seller_id/digital-items' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'x-pti-role: CLIENT' \
--header 'x-pti-signature: ' \
--header 'x-pti-request-id: 4f8128ae-0148-4345-ae0a-c376e083d538' \
--header 'Content-Type: application/json; charset=utf-8' \
--data '[
    {
        "itemReference": "6969213a-4937-4a61-bde8-909072f15f3d",
        "itemTitle": "Title",
        "itemDescription": "Description",
        "digitalItemType": "NFT",
        "itemUSDValue":100
    }
]'
```

#### Execute Buy

```java
ExecuteBuyTransaction executeBuyTransaction = ExecuteBuyTransaction.builder().
  type(TransactionTypeEnum.BUY).amount(111.00).date(new Date().toString()).
  initiator(OneOfUserSubTypes.person(buyer)).ptiRequestId(UUID.randomUUID().toString()).
  ptiScenarioId("acme_buy").sourceMethod(OneOfPaymentMethod.wallet(
  buyerWalletPaymentMethod)).digitalItem(digitalItem).
  transactionGroupId("transaction_group_id").seller(
  OneOfUserSubTypes.person(seller)).build();

sdk.marketplace().digitalItemBuy(executeBuyTransaction);
```

```curl
curl --location 'https://api.staging.fiant.io/v1/transactions/purchases' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'x-pti-role: CLIENT' \
--header 'x-pti-signature: ' \
--header 'x-pti-request-id: 2f8128ae-0148-4345-ae0a-c376e083d538' \
--header 'x-pti-scenario-id: acme_buy' \
--header 'Content-Type: application/json; charset=utf-8' \
--data '{
    "initiator": {
        "id": "buyer_id",
        "type": "PERSON"
    },
    "sourceMethod": {
        "paymentMethodType": "WALLET",
        "paymentInformation": {
            "type": "WALLET",
            "walletId": "999e814a-a698-44ba-9050-da23e99de7ee"
        }
    },
    "digitalItem": {
        "digitalItemType": "NFT",
        "itemReference": "6969213a-4937-4a61-bde8-909072f15f3d"
    },
    "seller": {
        "id": "seller_id",
        "type": "PERSON"
    },
    "destinationMethod": {
       "paymentMethodType": "WALLET",
          "paymentInformation": {
              "type": "WALLET",
              "walletId": "1ede814a-a698-44ba-9050-da23e99de7ee"
          }
    },
    "date": "2024-11-18T21:24:56+00:00",
    "amount": 111,
    "type": "BUY"
}'
```

```json
{
  "resourceType": "TRANSACTION_STATUS",
  "requestId": "REQUEST_ID",
  "clientId": "CLIENT_ID",
  "userId": "USER_ID",
  "status": "SETTLED",
  "date": "TRANSACTION_DATE",
  "amount": 111,
  "currency": "USD",
  "transactionType": "BUY",
  "paymentMethod": "WALLET",
  "total": {
    "subTotal": {
      "amount": 111,
      "currency": "USD"
    },
    "fee": {
      "amount": 0,
      "currency": "USD"
    },
    "total": {
      "amount": 111,
      "currency": "USD"
    }
  }
}
```

#### Collecting fees
```java
Total sellTotal = Total.builder().subtotal(Cost.builder().amount(100.00).currency(
  CurrencyEnum.USD.toString()).build()).fee(Cost.builder().amount(1.00).
  currency(CurrencyEnum.USD.toString()).build()).total(Cost.builder().amount(101.00).
  currency(CurrencyEnum.USD.toString()).build()).build();

FeeRecipient feeRecipient = FeeRecipient.builder().feeRecipientId(creator.getId()).
  walletId(createdCreatorWallet.getWalletId().get()).
  currency(CurrencyEnum.USD.toString()).amount(10.0).
  feeRecipientType(FeeRecipientFeeRecipientType.COMMISSION).build();
```

#### Execute Sell
```java
ExecuteSellTransaction executeSellTransaction = ExecuteSellTransaction.builder().
  type(TransactionTypeEnum.SELL).amount(100.00).date(new Date().toString()).
  initiator(OneOfUserSubTypes.person(seller)).ptiRequestId(UUID.randomUUID().toString()).
  ptiScenarioId("acme_sell").destinationMethod(OneOfPaymentMethod.
  wallet(sellerWalletPaymentMethod)).
  digitalItem(digitalItem).transactionGroupId("transaction_group_id").
  transactionTotal(sellTotal).buyer(OneOfUserSubTypes.person(buyer)).
  feeRecipients(List.of(feeRecipient)).build();

sdk.marketplace().digitalItemSell(executeSellTransaction);
```

```curl
curl --location 'https://api.staging.fiant.io/v1/transactions/sales' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'x-pti-signature: ' \
--header 'x-pti-request-id: 3f8128ae-0148-4345-ae0a-c376e083d538' \
--header 'x-pti-scenario-id: acme_sell' \
--header 'Content-Type: application/json; charset=utf-8' \
--data '{
    "initiator": {
        "id": "seller_id",
        "type": "PERSON"
    },
    "digitalItem": {
        "digitalItemType": "NFT",
        "itemReference": "5d53f6c2-56e5-4882-bee6-f3125ee6fbd1"
    },
    "buyer": {
        "id": "buyer_id",
        "type": "PERSON"
    },
    "destinationMethod": {
        "paymentInformation": {
            "type": "WALLET",
            "walletId": "987e0c08-021f-46f8-8a84-47b5ddd2ce8b"
        },
        "paymentMethodType": "WALLET"
    },
    "date": "2024-11-18T21:24:56+00:00",
    "amount": 111,
    "transactionGroupId":"transaction_group_id",
    "feeRecipients":[
        {
            "feeRecipientId":"creator_id",
            "currency": "USD",
            "amount":10,
            "feeRecipientType":"COMMISSION",
            "walletId": "888e814a-a698-44ba-9050-da23e99de7ee"
        }
    ],
    "transactionTotal": {
        "total": {
            "amount": 101,
            "currency": "USD"
        },
        "fee": {
            "amount": 1,
            "currency": "USD"
        },
        "subtotal": {
            "amount": 100,
            "currency": "USD"
        }
    },
    "type": "SELL"
}'
```

```json
{
  "resourceType": "TRANSACTION_STATUS",
  "requestId": "REQUEST_ID",
  "clientId": "CLIENT_ID",
  "userId": "USER_ID",
  "status": "SETTLED",
  "date": "TRANSACTION_DATE",
  "amount": 111,
  "currency": "USD",
  "transactionType": "SELL",
  "paymentMethod": "WALLET",
  "total": {
    "subTotal": {
      "amount": 101,
      "currency": "USD"
    },
    "fee": {
      "amount": 1,
      "currency": "USD"
    },
    "total": {
      "amount": 101,
      "currency": "USD"
    }
  }
}
```

#### Check Wallet Balances
```java
sdk.wallets().getWallet(seller.getId(), createdSellerWallet.getWalletId().get()).
  getBalance().get();//100.00

sdk.wallets().getWallet(creator.getId(), createdCreatorWallet.getWalletId().get()).
  getBalance().get();//10.00

sdk.wallets().getWallet("00000000-00000000-00000000-00000000", "client_fees").
  getBalance().get();//1.00
```

```curl
curl --location 'https://api.staging.fiant.io/v1/users/00000000-00000000-00000000-00000000/wallets/client_fees' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'x-pti-signature: ' \
--header 'x-pti-request-id: 1f8128ae-0148-4345-ae0a-c376e083d538' \
--header 'Content-Type: application/json; charset=utf-8'


curl --location 'https://api.staging.fiant.io/v1/users/seller_id/wallets/1ede814a-a698-44ba-9050-da23e99de7ee' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'x-pti-signature: ' \
--header 'x-pti-request-id: 2f8128ae-0148-4345-ae0a-c376e083d538' \
--header 'Content-Type: application/json; charset=utf-8'

curl --location 'https://api.staging.fiant.io/v1/users/buyer_id/wallets/999e814a-a698-44ba-9050-da23e99de7ee' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'x-pti-signature: ' \
--header 'x-pti-request-id: 3f8128ae-0148-4345-ae0a-c376e083d538' \
--header 'Content-Type: application/json; charset=utf-8'
```

#### Check Digital Item Ownership
```java
sdk.marketplace().getDigitalItems(buyer.getId());//The new item will be in there
```
```curl
curl --location 'https://api.staging.fiant.io/v1/users/buyer_id/digital-items' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'x-pti-signature: ' \
--header 'x-pti-request-id: 4f8128ae-0148-4345-ae0a-c376e083d538' \
--header 'Content-Type: application/json; charset=utf-8'
```
