import { REACT_APP_API_URL } from "../../env";
import { getHeaders } from "../../components/Utils";

const callTransactionFeedback = async ({ transactionFeedbackPayload, requestId, ...props }) => {
  const url = REACT_APP_API_URL + "/transactions/" + requestId + "/updates";
  const headers = getHeaders(props);
  const options = { method: "POST", body: JSON.stringify(transactionFeedbackPayload) };
  const config = { ...options, headers };

  return fetch(url, config).then((response) => {
    if (response.ok) return response.json();
    throw { status: response.status, error: new Error(response.statusText) };
  });
};

export { callTransactionFeedback };
