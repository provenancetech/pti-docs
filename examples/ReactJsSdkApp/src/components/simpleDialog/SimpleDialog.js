import React from "react";
import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import styled from "styled-components";
import create from "zustand";

import { actionType } from "../Consts";
import { showErrorSnackAlert } from "../snackAlert/SnackAlert";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const CloseButton = styled(IconButton)`
  &.MuiIconButton-root {
    margin: 12px 16px;
  }
`;

const DialogContentStyled = styled(DialogContent)`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const IFrame = styled(Box)`
  align-items: center;
  background-color: #f2f2f2;
  display: flex;
  justify-content: center;
  min-height: 800px;
  min-width: 550px;
`;

const useSimpleDialogStore = create((set) => ({
  open: false,
  sdkInit: false,
  type: "",
  userId: "",
  requestId: "",
  amount: "",
  scenarioId: "",
  lang: "",
  closeHandler: () => set({ open: false }),
  setSdkInit: (value) => set({ sdkInit: value }),
}));

export const openSimpleDialog = (type, userId, requestId, amount, scenarioId, lang) => {
  useSimpleDialogStore.setState({
    open: true,
    sdkInit: false,
    type,
    userId,
    requestId,
    amount,
    scenarioId,
    lang,
  });
};

const SimpleDialog = () => {
  const { open, sdkInit, type, userId, requestId, amount, scenarioId, lang, closeHandler, setSdkInit } =
    useSimpleDialogStore();

  const iframeRef = (event) => {
    if (event && !sdkInit && open) {
      const params = {
        amount,
        lang,
        metaInformation: { var3: "value3", var4: "value4" },
        parentElement: document.getElementById(event.id),
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
      PTI.form(params)
        .then(() => setSdkInit(true))
        .catch(() => showErrorSnackAlert(`Error while loading the ${type} form`));
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
      <DialogContentStyled>
        <IFrame id={`${type}PlaceHolder`} ref={iframeRef}>
          {!sdkInit && <CircularProgress />}
        </IFrame>
      </DialogContentStyled>
    </Dialog>
  );
};

export { SimpleDialog };
