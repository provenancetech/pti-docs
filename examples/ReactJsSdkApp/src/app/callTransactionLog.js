import { REACT_APP_API_URL } from "../env";
import { getHeaders } from "./getHeaders";

const callTransactionLog = async ({ amount, userId, ...props }) => {

  const url = REACT_APP_API_URL + "/users/" + userId + "/transactionLogs";

  const headers = getHeaders(props);

  const body = {
    amount,
    date: headers.Date,
    initiator: { id: userId, type: "PERSON" },
    sourceMethod: {
      currency: "USD",
      paymentInformation: {
        creditCardAddress: {},
        creditCardNumberHash:
          "feead9c948a4b3393498cf17816fb289c2d4d80d4ffb5b11a7171c5f6c48f573",
        type: "ENCRYPTED_CREDIT_CARD",
      },
      paymentMethodType: "FIAT",
    },
    type: "FUNDING",
    usdValue: amount,
  };

  const options = { method: "POST", body: JSON.stringify(body) };

  const config = { ...options, headers };

  return fetch(url, config).then((response) => {
    if (response.ok) return response.json();

    throw new Error(response.statusText);
  });
};

export { callTransactionLog };
