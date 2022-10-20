import { generateToken } from "./generateToken";
import { callTransactionFeedback } from "../app/calls/callTransactionFeedback";
import { outputIfExists } from "../components/Utils";
import { showErrorSnackAlert, showSuccessSnackAlert } from "../components/snackAlert/SnackAlert";

const sendTransactionFeedback = async ({ requestId, ...props }) => {
  const accessToken = await generateToken("POST", `/transactions/${requestId}/feedback`);
  if (accessToken) {
    await callTransactionFeedback({ accessToken, requestId, ...props })
      .then(() => showSuccessSnackAlert("Transaction feedback sent successfully"))
      .catch((e) =>
        showErrorSnackAlert(
          `Error ${outputIfExists(e.status)} while sending transaction feedback: ${JSON.stringify(e.error)}`
        )
      );
  } else {
    showErrorSnackAlert("Error while generating token.");
  }
};


export { sendTransactionFeedback };
