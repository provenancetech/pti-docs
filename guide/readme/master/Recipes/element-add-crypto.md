### Element- Add Bank Account

#### Display Crypto wallet collection form
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