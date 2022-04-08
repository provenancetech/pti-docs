import { REACT_APP_BASE_URL } from "../env";

const getBaseUrl = () =>
  "https://" +
  (ptiConfig.apiDomain || "pti") +
  (ptiConfig.ptiPrefix || "") +
  "." +
  REACT_APP_BASE_URL +
  "/v0";

export { getBaseUrl };
