import { v4 as uuidv4 } from "uuid";
import { REACT_APP_API_URL } from "../../env";
import { getHeaders } from "../../components/Utils";

const callCreateUser = async (props) => {
  const url = REACT_APP_API_URL + "/users";
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
