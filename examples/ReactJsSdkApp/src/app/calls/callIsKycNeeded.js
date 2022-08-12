import { REACT_APP_API_URL } from "../../env";
import { getHeaders } from "./getHeaders";

const callIsKycNeeded = async ({ amount, userId, ...props }) => {
  const url = REACT_APP_API_URL + "/users/" + userId + "/kyc-needed?amount=" + amount;
  const headers = getHeaders(props);
  const options = { method: "GET" };
  const config = { headers, ...options };

  return fetch(url, config).then((response) => {
    if (response.ok) return response.json();
    throw new Error(response.statusText);
  });
};

export { callIsKycNeeded };