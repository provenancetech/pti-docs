export const capitalizeFirstLetter = (value) => {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const convertCamelCaseToText = (value) => {
  if (!value) return "";
  const result = value.replace(/([A-Z])/g, " $1");
  return capitalizeFirstLetter(result);
};

export const getHeaders = ({ accessToken, requestId, scenarioId }) => ({
  "Content-type": "application/json",
  Date: new Date().toISOString(),
  "x-pti-client-id": ptiConfig.clientId,
  "x-pti-request-id": requestId,
  "x-pti-scenario-id": scenarioId,
  "x-pti-session-id": ptiConfig.sessionId,
  "x-pti-token": accessToken,
});
