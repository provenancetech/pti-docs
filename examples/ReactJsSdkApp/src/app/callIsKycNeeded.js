import { getBaseUrl } from "./getBaseUrl";

const callIsKycNeeded = async (accessToken) => {
  const baseUrl = getBaseUrl();

  const url = baseUrl + "/users/" + userId + "/kyc-needed?amount=" + amount;

  const date = new Date().toISOString();

  const headers = {
    Date: date,
    "x-pti-client-id": ptiConfig.clientId,
    "x-pti-request-id": requestId,
    "x-pti-scenario-id": scenarioId,
    "x-pti-token": accessToken,
  };

  const options = { method: "GET" };

  const config = { headers, ...options };

  return fetch(url, config).then((response) => {
    if (response.ok) return response.json();

    throw new Error(response.statusText);
  });
};

export { callIsKycNeeded };
