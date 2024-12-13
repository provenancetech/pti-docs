---
title: "Configuration"
slug: "configuration"
excerpt: ""
hidden: false
createdAt: "Thu Dec 05 2024 16:29:40 GMT+0000 (Coordinated Universal Time)"
updatedAt: "Mon Dec 09 2024 20:38:27 GMT+0000 (Coordinated Universal Time)"
---
## Client configuration

The client configuration can be used to customize Form's settings such as styles, translations and more.  
The config should follow this format:

```typescript
interface ClientConfig extends Entity {
  acceptedCc: string[];
  clientId: string;
  feeRate: number;
  exceptionLists: ExceptionLists;
  styleConfig: StyleConfig;
  translations: TranslationConfig;
}
```

- `acceptedCc` is a list of allowed credit card providers. You can restrict usage of certain credit card providers  
  by allowing a subset of the default value `["amex", "dinersclub", "discover", "jcb", "mastercard", "visa"]`
- `clientId` is your assigned client id
- `feeRate` is the desired fee rate when processing payments. This should be the decimal value of the  
  added fee, for instance `0.03` for a 3% fee.

### Exception Lists

It is also possible to customize the restriction of certain areas, or flag high risk ones.  
The `exceptionLists` config should follow the following format: 

```typescript
interface ExceptionLists {
  embargoedList: string[];
  highRiskList: string[];
  regulatoryIssuesList: string[];
  usStateBlacklist: string[];
}
```

- `embargoedList` is a list of country codes where service providing should be denied. The default list will be provided  
  if none is specified: `["AF", "AL", "BA", "BD", "BI", "BO", "BY", "CD", "CF", "CI", "CU", "DZ", "GW", "IQ", "IR", "KP", "LB", "LY", "ME", "MK", "MM", "RS", "RU", "SD", "SL", "SO", "SY", "TJ", "VE", "VU", "YE", "ZW"]`
- `highRiskList` is a list of country codes considered high risk, this will show warnings for users in these areas.
- `regulatoryIssuesList` is a list of country codes with regulatory issues, this will also display a warning for users  
  in these areas.
- `usStateBlacklist` is a list of US state codes where specified states should be denied service.

### Style Configuration

The `styleConfig` allows the use of custom colors, dark or light mode, and fonts.  
The config should follow this format:

```typescript
interface StyleConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamily: string;
}
```

Colors should follow the hexadecimal format, for instance `#00AAFF`. `fontFamily` should be a string including  
font family names and generic names supported by most browsers, i.e. `"Gill Sans Extrabold, sans-serif"`

### Translations

Is it possible to override default translations in any language in case a specific custom text is desired.  
Custom translations can also be used to add translations for a language that we do not support by default, if need be.  
The `translation` config is a JSON object with language code as keys, and custom objects as values.  
Contact us if you need custom translations for your front-facing forms and we'll provide the necessary  
configuration for you.

## Scenarios

In addition to the client configuration, scenarios are another way to use Forms to its full extent.  
Scenarios dictate whether some form fields should be made `readOnly` or `secret`. They also dictate if  
existing values of a form field should be filled with the existing value, be made read-only, secret, editable, or  
simply be hidden. Contact us if you need to use custom scenarios, and we will work out the configuration you need.

## End of Flow Events

Synchronous messages via \`window.postMessage are dispatched upon completion of each supported flow within our Fiant elements service.

These messages are js objects containing a message's event name, followed by the ID of the freshly created entity (in this case, the credit card payment information ID).

```json
{
    "name": "AddCreditCardCompleted",
    "createdId": "7bfd8ea0-5aa4-472c-a35c-2a6d34c1e8c3"
}
```

### Message names

- Assessment: `UserAssessmentCompleted`
- User onboarding: `UserOnboardingCompleted`
- Add credit card: `AddCreditCardCompleted`, `AddPaymentMethodCompleted`
- Add bank account: `AddBankAccountCompleted`, `AddPaymentMethodCompleted`
- Add crypto wallet: `AddCryptoWalletCompleted`, `AddPaymentMethodCompleted`

Upon receiving these messages, consider implementing actions such as removing the iframe or displaying a spinner to provide a seamless user experience.

Implementation Example:

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
