import React, { useState } from "react";
import { Box, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import styled from "styled-components";
import PropTypes from "prop-types";

import { actionType } from "../Consts";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const CloseButton = styled(IconButton)`
  &.MuiIconButton-root {
    margin: 12px 16px;
  }
`;

const SimpleDialog = ({ type, userId, requestId, amount, scenarioId, lang, open, closeHandler }) => {
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

      if (Object.values(actionType).includes(type)) params.type = type;
      PTI.form(params);
    }
  };

  return (
    <Dialog fullScreen={true} open={open}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <DialogTitle>
          {type} - {`${amount}$`} - Request Id: {requestId} - User Id: {userId}
        </DialogTitle>
        <CloseButton onClick={closeHandler}>
          <CloseOutlinedIcon />
        </CloseButton>
      </Box>
      <DialogContent style={{ display: "flex", justifyContent: "center" }}>
        <Box id={type + "PlaceHolder"} ref={setRef} style={{ minHeight: "800px", minWidth: "550px" }} />
      </DialogContent>
    </Dialog>
  );
};

SimpleDialog.propTypes = {
  type: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  requestId: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  scenarioId: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  closeHandler: PropTypes.func.isRequired,
};

export { SimpleDialog };
