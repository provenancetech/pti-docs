import { callIsKycNeeded } from "../app/calls/callIsKycNeeded";
import { generateToken } from "./generateToken";
import { showErrorSnackAlert, showInfoSnackAlert } from "../components/snackAlert/SnackAlert";

const checkIfKycNeeded = async ({ userId, ...props }) => {
  const token = await generateToken({
    method: "GET",
    url: `/users/${userId}/kyc-needed`,
  });
  const accessToken = token.accessToken;

  await callIsKycNeeded({ accessToken, userId, ...props })
    .then((res) => {
      const kycNeeded = res?.kyc_needed ? "true" : "false";
      showInfoSnackAlert(`Kyc needed: ${kycNeeded}`);
    })
    .catch((e) => showErrorSnackAlert(`Error while calling isKycNeeded: ${JSON.stringify(e)}`));
};

export { checkIfKycNeeded };
