window.ptiAsyncInit = function () {
  console.log("Initializing PTI Global Config");
  PTI.init({
    clientId: "3450582c-1955-11eb-adc1-0242ac120002",
    generateTokenPath: "/api/generateToken",
  });
};

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function showPaymentForm(rootId) {
  PTI.form({
    type: "FIAT_FUNDING",
    requestId: uuidv4(),
    userId: "cf48a16e-4500-43eb-803c-6902737ddba6",
    amount: 100,
    parentElement: document.getElementById(rootId),
  });
}
