import { callIsKycNeeded } from "./callIsKycNeeded";
import { generateToken } from "./generateToken";

const checkIfKycNeeded = async () => {
  const token = await generateToken({
    method: "GET",
    url: "/users/" + userId + "/kyc-needed",
  });

  const accessToken = token.accessToken;

  await callIsKycNeeded(accessToken)
    .then((res) => alert("Response:" + JSON.stringify(res)))
    .catch((e) => alert("Error:" + JSON.stringify(e)));
};

export { checkIfKycNeeded };
