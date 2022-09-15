import { callGenerateToken } from "../app/calls/callGenerateToken";
import { outputIfExists } from "../components/Utils";
import { showErrorSnackAlert } from "../components/snackAlert/SnackAlert";

const generateToken = async (method = "GET", url) => {
  await callGenerateToken({ method, url })
    .then((token) => token?.accessToken || "")
    .catch((e) => {
      showErrorSnackAlert(`Error ${outputIfExists(e.status)} while generating token: ${outputIfExists(e.error)}`);
    });
};

export { generateToken };
