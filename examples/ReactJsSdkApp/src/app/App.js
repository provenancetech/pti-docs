import React, { useState } from "react";

import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";

import { REACT_APP_USER_ID } from "../env";

import { checkIfKycNeeded } from "./checkIfKycNeeded";
import { createUser } from "./createUser";
import { sendTransactionLog } from "./sendTransactionLog";
import { SimpleDialog } from "./SimpleDialog";

const App = () => {
  const [kycOpen, setKycOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const [amount, setAmount] = useState(
    "" + Math.round(Math.random() * 100) + "." + Math.round(Math.random() * 100)
  );
  const [lang, setLang] = useState("en");
  const [requestId, setRequestId] = useState(uuidv4());
  const [scenarioId, setScenarioId] = useState("");
  const [userId, setUserId] = useState(REACT_APP_USER_ID);

  const [errorDialog, setErrorDialog] = useState(false);
  const [okDialog, setOkDialog] = useState(false);

  const closeOkDialog = () => setOkDialog(false);
  const closeErrorDialog = () => setErrorDialog(false);

  return (
    <Container>
      <Box my={4}>
        <TextField
          fullWidth={true}
          id="userId"
          label="UserId"
          onChange={(e) => setUserId(e.target.value)}
          value={userId}
        />
        <Button
          fullWidth={true}
          onClick={createUser}
          style={{ marginTop: "5px" }}
          variant="contained"
        >
          Create a new User
        </Button>
        <br />
        <br />
        <TextField
          fullWidth={true}
          id="requestId"
          label="RequestId"
          onChange={(e) => setRequestId(e.target.value)}
          value={requestId}
        />
        <br />
        <br />
        <TextField
          fullWidth={true}
          id="amount"
          label="Amount"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
        />
        <br />
        <br />
        <TextField
          fullWidth={true}
          id="scenarioId"
          label="ScenarioId ( associated template must be present in backend )"
          onChange={(e) => setScenarioId(e.target.value)}
          value={scenarioId}
        />
        <br />
        <br />
        <TextField
          fullWidth={true}
          id="lang"
          label="Language"
          onChange={(e) => setLang(e.target.value)}
          value={lang}
        />
        <br />
        <br />
        <Button
          fullWidth={true}
          onClick={() => setPaymentOpen(true)}
          variant="contained"
        >
          Open Payment Form
        </Button>
        <br />
        <br />
        <Button
          fullWidth={true}
          onClick={() => setKycOpen(true)}
          variant="contained"
        >
          Open KYC Form
        </Button>
        <br />
        <br />
        <Button
          fullWidth={true}
          onClick={sendTransactionLog}
          variant="contained"
        >
          Send Transaction Log
        </Button>
        <br />
        <br />
        <Button fullWidth={true} onClick={checkIfKycNeeded} variant="contained">
          Check if Kyc Needed
        </Button>
        <br />
        <br />
      </Box>

      <SimpleDialog
        amount={amount}
        lang={lang}
        open={paymentOpen}
        requestId={requestId}
        scenarioId={scenarioId}
        type="FIAT_FUNDING"
        userId={userId}
      />

      <SimpleDialog
        amount={amount}
        lang={lang}
        open={kycOpen}
        requestId={requestId}
        scenarioId={scenarioId}
        type="KYC"
        userId={userId}
      />

      <Dialog onClose={closeOkDialog} open={okDialog}>
        <DialogTitle onClose={closeOkDialog}>All Good !</DialogTitle>
        <DialogContent>
          <img
            src="https://media.giphy.com/media/cOiXP74b6IDkpzb3Q7/giphy.gif"
            alt="All Good !"
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus color="primary" onClick={closeOkDialog}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog onClose={closeErrorDialog} open={errorDialog}>
        <DialogTitle onClose={closeErrorDialog}>Nope</DialogTitle>
        <DialogContent>
          <img
            src="https://media.giphy.com/media/FEikw3bXVHdMk/giphy.gif"
            alt="Nope"
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus color="primary" onClick={closeErrorDialog}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export { App };
