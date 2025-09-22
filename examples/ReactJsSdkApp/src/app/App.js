import React, { useEffect, useState } from "react";
import {
  Button,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { LoadingButton } from "@mui/lab";

import { REACT_APP_USER_ID } from "../env";
import { actionType, paymentInfo, transactionTypes } from "../components/Consts";
import { getRandomInt } from "../components/Utils";
import { ContainerGrid, Header, Section, Title } from "./Styles";
import { createUser } from "../repository/createUser";
import { generateTransactionLogPayload } from "../repository/sendTransactionLog";
import { openSimpleDialog, SimpleDialog } from "../components/simpleDialog/SimpleDialog";
import SnackAlert from "../components/snackAlert/SnackAlert";

import AddCardIcon from "@mui/icons-material/AddCardOutlined";
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import ContactPageOutlinedIcon from "@mui/icons-material/ContactPageOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SailingOutlinedIcon from '@mui/icons-material/SailingOutlined';
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";

const App = () => {
  const [paymentInformation] = useState(paymentInfo.creditCard);
  const [transactionType] = useState(transactionTypes.deposit);
  const [transactionLogPayload, setTransactionLogPayload] = useState({});

  const [userId, setUserId] = useState(REACT_APP_USER_ID);
  const [requestId, setRequestId] = useState(uuidv4());
  const [amount, setAmount] = useState(`${getRandomInt(100)}.${getRandomInt(100)}`);
  const [scenarioId, setScenarioId] = useState("");
  const [lang, setLang] = useState("en");

  const [createUserLoading, setCreateUserLoading] = useState(false);
  const [createBusinessLoading, setCreateBusinessLoading] = useState(false);
  const [transactionFeedbackPayload] = useState({
    feedback: "SETTLED",
    transactionId: "0xbb0ec8b4ab6679a0e0486f44a867dcd913cd5acee368180ac72432784eba48e4",
    date: new Date().toISOString(),
  });
  const props = { userId, requestId, amount, scenarioId, setUserId, transactionLogPayload, transactionFeedbackPayload };

  useEffect(() => {
    setTransactionLogPayload(generateTransactionLogPayload(transactionType, paymentInformation, amount, userId));
  }, ["", amount, transactionType, paymentInformation, userId]);

  return (
    <ContainerGrid>
      <Title>Fiant SDK Example</Title>
      <Section style={{ gridArea: "informations" }}>
        <Header>
          <TuneOutlinedIcon />
          Settings
        </Header>
        <TextField disabled fullWidth={true} id="clientId" label="ClientId" value={ptiConfig.clientId} />
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth={true}
            id="userId"
            label="UserId"
            onChange={(e) => setUserId(e.target.value)}
            value={userId}
          />
          <Button onClick={() => setUserId(uuidv4())} variant="contained" style={{ width:"50%" }}>
            Generate
          </Button>
        </Stack>
        <LoadingButton
          endIcon={<PersonOutlineOutlinedIcon />}
          fullWidth={true}
          loading={createUserLoading}
          loadingPosition="end"
          onClick={() => {
            setCreateUserLoading(true);
            createUser(props).finally(() => setCreateUserLoading(false));
          }}
          variant="contained"
        >
          Create a new User
        </LoadingButton>
        <LoadingButton
          endIcon={<BusinessOutlinedIcon />}
          fullWidth={true}
          loading={createBusinessLoading}
          loadingPosition="end"
          onClick={() => {
            setCreateBusinessLoading(true);
            createUser(props, "BUSINESS").finally(() => setCreateBusinessLoading(false));
          }}
          variant="contained"
        >
          Create a new Business
        </LoadingButton>
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth={true}
            id="requestId"
            label="RequestId"
            onChange={(e) => setRequestId(e.target.value)}
            value={requestId}
          />
          <Button onClick={() => setRequestId(uuidv4())} variant="contained" style={{ width:"50%" }}>
            Generate
          </Button>
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth={true}
            id="amount"
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            label="Amount"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
          />
          <TextField
            fullWidth={true}
            id="lang"
            label="Language"
            onChange={(e) => setLang(e.target.value)}
            value={lang}
          />
        </Stack>
        <TextField
          fullWidth={true}
          id="scenarioId"
          label="ScenarioId ( associated template must be present in backend )"
          onChange={(e) => setScenarioId(e.target.value)}
          value={scenarioId}
        />
      </Section>
        
      <Section style={{ gridArea: "kyc" }}>
        <Header>
          <ContactPageOutlinedIcon />
          KYC
        </Header>
        <Button
          endIcon={<OpenInNewOutlinedIcon />}
          fullWidth={true}
          onClick={() => openSimpleDialog(actionType.kyc, userId, requestId, amount, scenarioId, lang)}
          variant="contained"
        >
          Open KYC Form
        </Button>
      </Section>

      <Section style={{ gridArea: "kyb" }}>
        <Header>
          <BusinessOutlinedIcon />
          KYB
        </Header>
        <Button
          endIcon={<OpenInNewOutlinedIcon />}
          fullWidth={true}
          onClick={() => openSimpleDialog(actionType.kyb, userId, requestId, amount, scenarioId, lang)}
          variant="contained"
        >
          Open KYB Form
        </Button>
      </Section>

      <Section style={{ gridArea: "onboarding" }}>
        <Header>
          <SailingOutlinedIcon />
          Onboarding
        </Header>
        <Button
          endIcon={<OpenInNewOutlinedIcon />}
          fullWidth={true}
          onClick={() => openSimpleDialog(actionType.onboarding, userId, requestId, amount, scenarioId, lang)}
          variant="contained"
        >
          Open Onboarding Form
        </Button>
      </Section>

      <Section style={{ gridArea: "add-cc" }}>
        <Header>
          <AddCardIcon />
          Add Payment Methods
        </Header>
        <Button
          endIcon={<OpenInNewOutlinedIcon />}
          fullWidth={true}
          onClick={() => openSimpleDialog(actionType.addCC, userId, requestId, amount, scenarioId, lang)}
          variant="contained"
        >
          Open Add Credit Card Form
        </Button>
      <Button
          endIcon={<OpenInNewOutlinedIcon />}
          fullWidth={true}
          onClick={() => openSimpleDialog(actionType.addBankAccount, userId, requestId, amount, scenarioId, lang)}
          variant="contained"
      >
          Open Add Bank Account Form
      </Button>
      <Button
          endIcon={<OpenInNewOutlinedIcon />}
          fullWidth={true}
          onClick={() => openSimpleDialog(actionType.addCryptoWallet, userId, requestId, amount, scenarioId, lang)}
          variant="contained"
      >
          Open Add Crypto Wallet Form
      </Button>
      </Section>

      <SimpleDialog />
      <SnackAlert />
    </ContainerGrid>
  );
};

export { App };
