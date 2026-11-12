### Element- Add Crypto Wallet

#### Display Credit card collection form
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

#### Display the streamlined Credit card collection form

`ADD_CC_V2` only displays the cardholder name, the card fields and the "Add" button: no stepper, title,
"Use as default payment method" checkbox, border or footer. The card is not set as the default payment method.

```html
<div id="add_cc_form"></div>
<script>
  PTI.form({
    type: "ADD_CC_V2",
    requestId: "REQUEST_ID",
    userId: "USER_ID",
    parentElement: document.getElementById("add_cc_form"),
    lang: "en",
  });
</script>
```

Nothing is displayed once the card is added. Listen to the `AddCreditCardCompleted` message to update your own UI:

```html
<script>
  window.addEventListener("message", (message) => {
    if (message.data.name === "AddCreditCardCompleted") {
      console.log("ID of the created credit card payment information", message.data.createdId);
    }
  });
</script>
```