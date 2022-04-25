import { v4 as uuidv4 } from "uuid";

import { getBaseUrl } from "./getBaseUrl";
import { getHeaders } from "./getHeaders";

const callCreateUser = async (props) => {
  const baseUrl = getBaseUrl();

  const url = baseUrl + "/users";

  const headers = getHeaders(props);

  const body = { id: uuidv4(), type: "PERSON" };

  const options = { method: "POST", body: JSON.stringify(body) };

  const config = { headers, ...options };

  return fetch(url, config).then((response) => {
    if (response.ok) return response.json();

    throw new Error(response.statusText);
  });
};

export { callCreateUser };
