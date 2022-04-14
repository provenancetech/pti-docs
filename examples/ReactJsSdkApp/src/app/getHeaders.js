const getHeaders = ({ accessToken, requestId, scenarioId }) => ({
  "Content-type": "application/json",
  Date: new Date().toISOString(),
  "x-pti-client-id": ptiConfig.clientId,
  "x-pti-request-id": requestId,
  "x-pti-scenario-id": scenarioId,
  "x-pti-session-id": ptiConfig.sessionId,
  "x-pti-token": accessToken,
});

export { getHeaders };
