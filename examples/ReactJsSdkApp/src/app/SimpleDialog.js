import React, { useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";

const SimpleDialog = ({
  amount,
  lang,
  open,
  requestId,
  scenarioId,
  type,
  userId,
}) => {
  const [sdkInit, setSdkInit] = useState(false);

  const setRef = (e) => {
    if (e != null && !sdkInit) {
      setSdkInit(true);

      const params = {
        amount,
        lang,
        metaInformation: { var3: "value3", var4: "value4" },
        parentElement: document.getElementById(e.id),
        requestId,
        userId,
      };

      if (scenarioId) {
        // note that the template corresponding to this scenarioId must exist in the PTI backend
        params.scenarioId = scenarioId;
        // update the context
        PTI.updateContext(userId, scenarioId, ptiConfig.sessionId);
      }

      if (["FIAT_FUNDING", "KYC"].includes(type)) params.type = type;

      PTI.form(params);
    }
  };

  return (
    <Dialog fullScreen={true} open={open}>
      <DialogTitle>
        {type} - {amount} - {requestId}
      </DialogTitle>
      <DialogContent>
        <div
          id={type + "PlaceHolder"}
          ref={setRef}
          style={{ height: "1200px", width: "550px" }}
        />
      </DialogContent>
    </Dialog>
  );
};

export { SimpleDialog };
