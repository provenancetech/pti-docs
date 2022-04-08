import { getBaseUrl } from "./getBaseUrl";

const callTransactionLog = async (accessToken) => {
  const baseUrl = getBaseUrl();

  const url = baseUrl + "/users/" + userId + "/transactionLogs";

  const date = new Date().toISOString();

  const headers = {
    "Content-type": "application/json",
    Date: date,
    "x-pti-client-id": ptiConfig.clientId,
    "x-pti-request-id": requestId,
    "x-pti-scenario-id": scenarioId,
    "x-pti-session-id": ptiConfig.sessionId, // this is set via the init of the sdk
    "x-pti-token": accessToken,
  };

  const body = {
    amount,
    date: date,
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
