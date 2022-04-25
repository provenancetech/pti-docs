const generateToken = async (payload) => {
  const url = ptiConfig.generateTokenPath;

  const headers = { "Content-type": "application/json" };

  const body = {
    "x-pti-client-id": ptiConfig.clientId,
    "x-pti-token-payload": payload,
  };

  const options = { method: "POST", body: JSON.stringify(body) };

  const config = { headers, ...options };

  return fetch(url, config).then((response) => {
    if (response.ok) return response.json();

    throw new Error(response.statusText);
  });
};

export { generateToken };
