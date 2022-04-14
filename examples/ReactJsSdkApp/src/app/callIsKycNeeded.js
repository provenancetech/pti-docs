import { getBaseUrl } from "./getBaseUrl";
import { getHeaders } from "./getHeaders";

const callIsKycNeeded = async ({ amount, userId, ...props }) => {
  const baseUrl = getBaseUrl();

  const url = baseUrl + "/users/" + userId + "/kyc-needed?amount=" + amount;

  const headers = getHeaders(props);

  const options = { method: "GET" };

  const config = { headers, ...options };

  return fetch(url, config).then((response) => {
    if (response.ok) return response.json();

    throw new Error(response.statusText);
  });
};

export { callIsKycNeeded };
