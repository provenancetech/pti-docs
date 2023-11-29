import React from "react";
import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { create } from "zustand";
import styled from "styled-components";

import { actionType } from "../Consts";
import { convertConstToStr } from "../Utils";
import { FieldCopy } from "../fieldCopy/FieldCopy";
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
  height:100%;
  justify-content: center;
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
        .catch(() => showErrorSnackAlert(`Error while loading the ${convertConstToStr(type)} form`));
    }
  };

  return (
    <Dialog fullScreen={true} open={open}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <DialogTitle alignItems="center" display="flex" gap="20px">
          <Box>
            {convertConstToStr(type)} - {`${amount}$`}
          </Box>
          <FieldCopy label={"Client Id:"} value={ptiConfig.clientId} variant={"outlined"} style={{ width: "340px" }} />
          <FieldCopy label={"User Id:"} value={userId} variant={"outlined"} style={{ width: "340px" }} />
          <FieldCopy label={"Request Id:"} value={requestId} variant={"outlined"} style={{ width: "340px" }} />
          <FieldCopy label={"Scenario Id:"} value={scenarioId} variant={"outlined"} style={{ width: "200px" }} />
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
