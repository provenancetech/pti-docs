import { callCreateUser } from "./callCreateUser";
import { generateToken } from "./generateToken";

const createUser = async ({ setUserId, ...props }) => {
  const token = await generateToken({
    method: "POST",
    url: "/users",
  });

  const accessToken = token.accessToken;

  await callCreateUser({ accessToken, ...props })
    .then((res) => {
      setUserId(res.id);

      alert("User " + res.id + " was created");
    })
    .catch((e) => {
      console.log("Catch: ", e);

      alert("Error:" + JSON.stringify(e));
    });
};

export { createUser };
