import { generateToken } from "./generateToken";
import { callIsKycNeeded } from "../app/calls/callIsKycNeeded";
import { outputIfExists } from "../components/Utils";
import { showErrorSnackAlert, showInfoSnackAlert } from "../components/snackAlert/SnackAlert";

const checkIfKycNeeded = async ({ userId, ...props }) => {
  const accessToken = await generateToken("GET", `/users/${userId}/kyc-needed`);
  if (accessToken) {
    await callIsKycNeeded({ accessToken, userId, ...props })
      .then((res) => {
        const kycNeeded = res?.kyc_needed ? "true" : "false";
        showInfoSnackAlert(`Kyc needed: ${kycNeeded}`);
      })
      .catch((e) =>
        showErrorSnackAlert(`Error ${outputIfExists(e.status)} while calling isKycNeeded: ${JSON.stringify(e.error)}`)
      );
  }
};

export { checkIfKycNeeded };
