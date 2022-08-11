import { REACT_APP_API_URL } from "../env";
import { getHeaders } from "./getHeaders";

const callTransactionLog = async ({ transactionLogPayload, userId, ...props }) => {

  const url = REACT_APP_API_URL + "/users/" + userId + "/transactionLogs";

  const headers = getHeaders(props);

  const options = { method: "POST", body: transactionLogPayload };

  const config = { ...options, headers };

  return fetch(url, config).then((response) => {
    if (response.ok) return response.json();

    throw new Error(response.statusText);
  });
};

export { callTransactionLog };
