# Use-cases of for Fiant embeddable elements

## Save a credit card 
Fiant embeddable Credit card element enable you to save a credit card without the need of being PCI compliant
### Display the element
```html
<div id="add_cc_form"></div>
<script>
  PTI.form({
    type: "ADD_CC",
    requestId: "REQUEST_ID",
    userId: "USER_ID",
    parentElement: document.getElementById("add_cc_form"),
    lang: "en",
  });
</script>
```
### Get the returned id

```typescript
window.addEventListener("message", handleMessage);

const handleMessage = (message: MessageEvent) => {
    if (message.data.name === "AddCreditCardCompleted") {
        setTimeout(() => onMessageReceived(), 3000);
        console.log("ID of the created credit card payment information", message.data.createdId);
    }
};

const onMessageReceived = () => {
    // Remove iframe or show spinner
};
```

### Retrieve the information from the API
```java
EncryptedCreditCardPaymentInformation card = sdk.collectUserData().getUserPaymentInformation("YOUR_USER_ID", "CC_PAYMENT_INFO_ID").getEncryptedCreditCard().get();
```

## Save bank account information
### Display the element
```html
<div id="add_bank_account_form"></div>
<script>
  PTI.form({
    type: "ADD_BANK_ACCOUNT",
    requestId: "REQUEST_ID",
    userId: "USER_ID",
    parentElement: document.getElementById("add_bank_account_form"),
    lang: "en",
  });
</script>
```
### Get the returned id
```typescript
window.addEventListener("message", handleMessage);

const handleMessage = (message: MessageEvent) => {
    if (message.data.name === "AddBankAccountCompleted") {
        setTimeout(() => onMessageReceived(), 3000);
        console.log("ID of the created bank account payment information", message.data.createdId);
    }
};

const onMessageReceived = () => {
    // Remove iframe or show spinner
};
```

### Retrieve the information from the API
```java
BankAccountPaymentInformation paymentInformation = sdk.collectUserData().getUserPaymentInformation("YOUR_USER_ID", "BANK_ACCOUNT_INFO_ID").getBankAccount().get();
```
## Save crypto wallet information
### Display the element
```html
<div id="add_crypto_form"></div>
<script>
  PTI.form({
    type: "ADD_CRYPTO_WALLET",
    requestId: "REQUEST_ID",
    userId: "USER_ID",
    parentElement: document.getElementById("add_crypto_form"),
    lang: "en",
  });
</script>
```
### Get the returned id
```typescript
window.addEventListener("message", handleMessage);

const handleMessage = (message: MessageEvent) => {
    if (message.data.name === "AddCryptoWalletCompleted") {
        setTimeout(() => onMessageReceived(), 3000);
        console.log("ID of the created crypto wallet payment information", message.data.createdId);
    }
};

const onMessageReceived = () => {
    // Remove iframe or show spinner
};
```
### Retrieve the information from the API
```java
CryptoPaymentInformation crypto = sdk.collectUserData().getUserPaymentInformation("YOUR_USER_ID", "CRYPTO_WALLET_INFO_ID").getCrypto().get();
```

## Perform user Assessment
### Display the element
```html
<div id="kyc_form"></div>
<script>
  PTI.form({
    type: "KYC",
    requestId: "REQUEST_ID",
    userId: "USER_ID",
    usdValue: 100,
    scenarioId: "SCENARIO_ID",
    parentElement: document.getElementById("kyc_form"),
    lang: "en",
  });
</script>
```

### Closing the element
```typescript
window.addEventListener("message", handleMessage);
const onMessageReceived = () => {
    // Remove iframe or show spinner
};
```

### Receive assessment webhook
#### Sdk Code
```java

```
#### Content
```json
{
    "resourceType":"USER_ASSESSMENT",
    "requestId":"REQUEST_ID",
    "clientId":"CLIENT_ID",
    "userId":"USER_ID",
    "status":"ACCEPTED",
    "tier": "4"  
}
```


## Onboard a user
A quick drop in form to create user in our system (person or business)
### Display the element
```html
<div id="onboarding_form"></div>
<script>
  PTI.form({
    type: "ONBOARDING",
    requestId: "REQUEST_ID",
    userId: "USER_ID",
    scenarioId: "SCENARIO_ID",
    parentElement: document.getElementById("onboarding_form"),
    lang: "en",
  });
</script>
```
### Get the returned id
```typescript
window.addEventListener("message", handleMessage);

const handleMessage = (message: MessageEvent) => {
    if (message.data.name === "UserOnboardingCompleted") {
        setTimeout(() => onMessageReceived(), 3000);
        console.log("ID of the created user id", message.data.createdId);
    }
};

const onMessageReceived = () => {
    // Remove iframe or show spinner
};
```


### Retrieve your user
```java
Person person = sdk.collectUserData().getUser("").getPerson().get();
```