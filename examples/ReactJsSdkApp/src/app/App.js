import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { LoadingButton } from "@mui/lab";
import ReactJson from "react-json-view";

import { REACT_APP_USER_ID } from "../env";
import { actionType, paymentInfo, transactionTypes } from "../components/Consts";
import { convertCamelCaseToText, getRandomInt } from "../components/Utils";
import { ContainerGrid, Header, Section, Title } from "./Styles";
import { createUser } from "../repository/createUser";
import { callTransactionFeedback, sendTransactionFeedback } from "../repository/sendTransactionFeedback";
import { generateTransactionLogPayload, sendTransactionLog } from "../repository/sendTransactionLog";
import { openSimpleDialog, SimpleDialog } from "../components/simpleDialog/SimpleDialog";
import SnackAlert from "../components/snackAlert/SnackAlert";

import AddCardIcon from "@mui/icons-material/AddCardOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import ContactPageOutlinedIcon from "@mui/icons-material/ContactPageOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SailingOutlinedIcon from '@mui/icons-material/SailingOutlined';
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

const App = () => {
  const [paymentInformation, setPaymentInformation] = useState(paymentInfo.creditCard);
  const [transactionType, setTransactionType] = useState(transactionTypes.deposit);
  const [transactionLogPayload, setTransactionLogPayload] = useState({});

  const [userId, setUserId] = useState(REACT_APP_USER_ID);
  const [requestId, setRequestId] = useState(uuidv4());
  const [amount, setAmount] = useState(`${getRandomInt(100)}.${getRandomInt(100)}`);
  const [scenarioId, setScenarioId] = useState("");
  const [lang, setLang] = useState("en");

  const [createUserLoading, setCreateUserLoading] = useState(false);
  const [transactionLogLoading, setTransactionLogLoading] = useState(false);
  const [transactionFeedbackLoading, setTransactionFeedbackLoading] = useState(false);
  const [transactionFeedbackPayload, setTransactionFeedbackPayload] = useState({
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

      <Section style={{ gridArea: "payment" }}>
        <Header>
          <CreditCardOutlinedIcon />
          Payment
        </Header>
        <Button
          endIcon={<OpenInNewOutlinedIcon />}
          fullWidth={true}
          onClick={() => openSimpleDialog(actionType.funding, userId, requestId, amount, scenarioId, lang)}
          variant="contained"
        >
          Open Payment Form
        </Button>
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

      <Section style={{ gridArea: "transaction" }}>
        <Header>
          <PaidOutlinedIcon />
          Transaction
        </Header>
        <Stack direction="row" spacing={2}>
          <Stack spacing={3} style={{ flex: 1 }}>
            <FormControl>
              <InputLabel id="transactiontype-select-label">Transaction Type</InputLabel>
              <Select
                id="transactiontype"
                labelId="transactiontype-select-label"
                fullWidth={true}
                value={transactionType}
                onChange={(e) => {
                  setTransactionType(e.target.value);
                }}
                label="Transaction Type"
              >
                {Object.entries(transactionTypes).map((entry, index) => (
                  <MenuItem key={"transactiontype-" + index} value={entry[1]}>
                    {convertCamelCaseToText(entry[0])}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="paymentinfo-select-label">Payment Information</InputLabel>
              <Select
                id="paymentInformation"
                labelId="paymentinfo-select-label"
                fullWidth={true}
                value={paymentInformation}
                onChange={(e) => {
                  setPaymentInformation(e.target.value);
                }}
                label="Payment Information"
              >
                {Object.entries(paymentInfo).map((entry, index) => (
                  <MenuItem key={"paymentinfo-" + index} value={entry[1]}>
                    {convertCamelCaseToText(entry[0])}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <LoadingButton
              endIcon={<SendOutlinedIcon />}
              fullWidth={true}
              loading={transactionLogLoading}
              loadingPosition="end"
              onClick={() => {
                setTransactionLogLoading(true);
                sendTransactionLog(props).finally(() => {
                  setTransactionLogLoading(false);
                });
              }}
              variant="contained"
            >
              Send Transaction Log
            </LoadingButton>
          </Stack>

          <FormControl style={{ minWidth: "600px" }}>
            <Typography component="p">Transaction Log Payload</Typography>
            <ReactJson
              collapsed={2}
              displayDataTypes={false}
              displayObjectSize={false}
              enableClipboard={true}
              iconStyle={"triangle"}
              id="transactionLogPayload"
              onEdit={(value) => {
                if (value?.updated_src) setTransactionLogPayload(value.updated_src);
              }}
              src={transactionLogPayload}
              theme={"rjv-default"}
              style={{ fontSize: "14px", padding: "20px" }}
            />
          </FormControl>
        </Stack>
      </Section>

      <Section style={{ gridArea: "feedback" }}>
        <Header>
          <PaidOutlinedIcon />
          Transaction Feedback
        </Header>
        <Stack direction="row" spacing={2}>
          <Stack spacing={3} style={{ flex: 1 }}>
            <LoadingButton
              endIcon={<SendOutlinedIcon />}
              fullWidth={true}
              loading={transactionFeedbackLoading}
              loadingPosition="end"
              onClick={() => {
                setTransactionFeedbackLoading(true);
                sendTransactionFeedback(props)
                  .then(() => {})
                  .finally(() => {
                    setTransactionFeedbackLoading(false);
                  });
              }}
              variant="contained"
            >
              Send Transaction Feedback
            </LoadingButton>
          </Stack>

          <FormControl style={{ minWidth: "600px" }}>
            <Typography component="p">Transaction Feedback Payload</Typography>
            <ReactJson
              collapsed={2}
              displayDataTypes={false}
              displayObjectSize={false}
              enableClipboard={true}
              iconStyle={"triangle"}
              id="transactionFeedbackPayload"
              onEdit={(value) => {
                if (value?.updated_src) setTransactionFeedbackPayload(value.updated_src);
              }}
              src={transactionFeedbackPayload}
              theme={"rjv-default"}
              style={{ fontSize: "14px", padding: "20px" }}
            />
          </FormControl>
        </Stack>
      </Section>

      <SimpleDialog />
      <SnackAlert />
    </ContainerGrid>
  );
};

export { App };
