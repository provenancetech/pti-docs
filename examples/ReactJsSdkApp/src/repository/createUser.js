import { generateToken } from "./generateToken";
import { callCreateUser } from "../app/calls/callCreateUser";
import { outputIfExists } from "../components/Utils";
import { showErrorSnackAlert, showSuccessSnackAlert } from "../components/snackAlert/SnackAlert";

const createUser = async ({ setUserId, ...props }, type = "PERSON") => {
  const accessToken = await generateToken("POST", `/users`);
  if (accessToken) {
    await callCreateUser({ accessToken, ...props }, type)
      .then((res) => {
        setUserId(res.id);
        showSuccessSnackAlert(`User "${res.id}" successfully created`);
      })
      .catch((e) => {
        showErrorSnackAlert(`Error ${outputIfExists(e.status)} while creating user: ${JSON.stringify(e.error)}`);
      });
  } else {
    showErrorSnackAlert("Error while generating token.");
  }
};

export { createUser };
