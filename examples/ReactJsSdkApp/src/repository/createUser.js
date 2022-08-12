import { callCreateUser } from "../app/calls/callCreateUser";
import { generateToken } from "./generateToken";
import { showErrorSnackAlert, showSuccessSnackAlert } from "../components/snackAlert/SnackAlert";

const createUser = async ({ setUserId, ...props }) => {
  const token = await generateToken({
    method: "POST",
    url: "/users",
  });
  const accessToken = token.accessToken;

  await callCreateUser({ accessToken, ...props })
    .then((res) => {
      setUserId(res.id);
      showSuccessSnackAlert(`User "${res.id}" successfully created`);
    })
    .catch((e) => {
      console.log("Catch: ", e);
      showErrorSnackAlert(`Error while creating user: ${JSON.stringify(e)}`);
    });
};

export { createUser };
