import { getBaseUrl } from "./getBaseUrl";

const callCreateUser = async (accessToken) => {
  const baseUrl = getBaseUrl();

  const url = baseUrl + "/users";

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

  const body = { id: uuidv4(), type: "PERSON" };

  const options = { method: "POST", body: JSON.stringify(body) };

  const config = { headers, ...options };

  return fetch(url, config).then((response) => {
    if (response.ok) return response.json();

    throw new Error(response.statusText);
  });
};

export { callCreateUser };
