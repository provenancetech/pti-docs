import { callIsKycNeeded } from "./callIsKycNeeded";
import { generateToken } from "./generateToken";

const checkIfKycNeeded = async ({ userId, ...props }) => {
  const token = await generateToken({
    method: "GET",
    url: "/users/" + userId + "/kyc-needed",
  });

  const accessToken = token.accessToken;

  await callIsKycNeeded({ accessToken, userId, ...props })
    .then((res) => alert("Response:" + JSON.stringify(res)))
    .catch((e) => alert("Error:" + JSON.stringify(e)));
};

export { checkIfKycNeeded };
