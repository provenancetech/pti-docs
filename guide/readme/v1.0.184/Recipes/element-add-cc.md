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