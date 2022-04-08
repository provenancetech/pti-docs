import { callTransactionLog } from "./callTransactionLog";
import { generateToken } from "./generateToken";

const sendTransactionLog = async () => {
  const token = await generateToken({
    method: "POST",
    url: "/users/" + userId + "/transactionLogs",
  });

  const accessToken = token.accessToken;

  await callTransactionLog(accessToken)
    .then(() => alert("Sent successfully !"))
    .catch((e) => alert("Error:" + JSON.stringify(e)));
};

export { sendTransactionLog };
