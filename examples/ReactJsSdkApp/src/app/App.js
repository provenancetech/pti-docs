import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ReactJson from "react-json-view";

import { REACT_APP_USER_ID } from "../env";
import { actionType, paymentInfo, transactionTypes } from "../components/Consts";
import { convertCamelCaseToText } from "../components/Utils";
import { ContainerGrid, Header, Section, Title, TransactionInfos, TransactionSection, UserSection } from "./Styles";
import { createUser } from "../repository/createUser";
import { checkIfKycNeeded } from "../repository/checkIfKycNeeded";
import { generateTransactionLogPayload, sendTransactionLog } from "../repository/sendTransactionLog";
import { SimpleDialog } from "../components/simpleDialog/SimpleDialog";

import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import ContactPageOutlinedIcon from "@mui/icons-material/ContactPageOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import SnackAlert from "../components/snackAlert/SnackAlert";

const App = () => {
  const [kycOpen, setKycOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [transactionType, setTransactionType] = useState(transactionTypes.funding);
  const [paymentInformation, setPaymentInformation] = useState(paymentInfo.creditCard);
  const [transactionLogPayload, setTransactionLogPayload] = useState({});

  const [userId, setUserId] = useState(REACT_APP_USER_ID);
  const [requestId, setRequestId] = useState(crypto.randomUUID());
  const [amount, setAmount] = useState(`${Math.round(Math.random() * 100) + "." + Math.round(Math.random() * 100)}`);
  const [scenarioId, setScenarioId] = useState("");
  const [lang, setLang] = useState("en");

  const props = { userId, requestId, amount, scenarioId, setUserId, transactionLogPayload };

  useEffect(() => {
    setTransactionLogPayload(generateTransactionLogPayload(transactionType, paymentInformation, amount, userId));
  }, [transactionType, paymentInformation]);

  return (
    <ContainerGrid>
      <Title>PTI SDK Example</Title>
      <Section style={{ gridArea: "informations" }}>
        <Header>
          <TuneOutlinedIcon />
          Settings
        </Header>
        <UserSection>
          <TextField
            fullWidth={true}
            id="userId"
            label="UserId"
            onChange={(e) => setUserId(e.target.value)}
            value={userId}
          />
          <Button
            endIcon={<PersonOutlineOutlinedIcon />}
            fullWidth={true}
            onClick={() => createUser(props)}
            variant="contained"
          >
            Create a new User
          </Button>
        </UserSection>
        <TextField
          fullWidth={true}
          id="requestId"
          label="RequestId"
          onChange={(e) => setRequestId(e.target.value)}
          value={requestId}
        />
        <Box style={{ display: "flex", gap: "20px" }}>
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
        </Box>
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
          onClick={() => setPaymentOpen(true)}
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
          onClick={() => setKycOpen(true)}
          variant="contained"
        >
          Open KYC Form
        </Button>
        <Button
          endIcon={<OpenInNewOutlinedIcon />}
          fullWidth={true}
          onClick={() => setOnboardingOpen(true)}
          variant="contained"
        >
          Open Onboarding Form
        </Button>
        <Button fullWidth={true} onClick={() => checkIfKycNeeded(props)} variant="contained">
          Check if Kyc Needed
        </Button>
      </Section>

      <Section style={{ gridArea: "transaction" }}>
        <Header>
          <PaidOutlinedIcon />
          Transaction
        </Header>
        <TransactionSection>
          <TransactionInfos>
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
            <Button
              endIcon={<SendOutlinedIcon />}
              fullWidth={true}
              onClick={() => {
                sendTransactionLog(props).then(() => {
                  setRequestId(crypto.randomUUID());
                });
              }}
              variant="contained"
            >
              Send Transaction Log
            </Button>
          </TransactionInfos>

          <FormControl style={{ minWidth: "600px" }}>
            <Typography component="p">Transaction Log Payload</Typography>
            <ReactJson
              collapsed={2}
              displayDataTypes={false}
              displayObjectSize={false}
              enableClipboard={false}
              iconStyle={"triangle"}
              id="transactionLogPayload"
              onEdit={() => {}}
              src={transactionLogPayload}
              theme={"rjv-default"}
              style={{ fontSize: "14px", padding: "20px" }}
            />
          </FormControl>
        </TransactionSection>
      </Section>

      <SimpleDialog
        amount={amount}
        closeHandler={() => setPaymentOpen(false)}
        lang={lang}
        open={paymentOpen}
        requestId={requestId}
        scenarioId={scenarioId}
        type={actionType.funding}
        userId={userId}
      />
      <SimpleDialog
        amount={amount}
        closeHandler={() => setKycOpen(false)}
        lang={lang}
        open={kycOpen}
        requestId={requestId}
        scenarioId={scenarioId}
        type={actionType.kyc}
        userId={userId}
      />
      <SimpleDialog
        amount={amount}
        closeHandler={() => setOnboardingOpen(false)}
        lang={lang}
        open={onboardingOpen}
        requestId={requestId}
        scenarioId={scenarioId}
        type={actionType.onboarding}
        userId={userId}
      />
      <SnackAlert />
    </ContainerGrid>
  );
};

export { App };
