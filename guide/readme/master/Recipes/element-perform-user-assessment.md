### Element- Perform User Assessment

#### Display the User Assessment element
```html
<div id="kyc_form"></div>
<script>
  PTI.form({
    type: "KYC",
    requestId: "REQUEST_ID",
    userId: "USER_ID",
    scenarioId: "SCENARIO_ID",
    usdValue:1000,
    parentElement: document.getElementById("kyc_form"),
    lang: "en",
  });
</script>
```