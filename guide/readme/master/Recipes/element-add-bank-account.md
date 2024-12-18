### Element- Add Bank Account

#### Display Bank account collection Form
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