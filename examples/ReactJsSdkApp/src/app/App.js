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
import { checkIfKycNeeded } from "../repository/checkIfKycNeeded";
import { generateTransactionLogPayload, sendTransactionLog } from "../repository/sendTransactionLog";
import { openSimpleDialog, SimpleDialog } from "../components/simpleDialog/SimpleDialog";
import SnackAlert from "../components/snackAlert/SnackAlert";

import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import ContactPageOutlinedIcon from "@mui/icons-material/ContactPageOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

const App = () => {
  const [paymentInformation, setPaymentInformation] = useState(paymentInfo.creditCard);
  const [transactionType, setTransactionType] = useState(transactionTypes.funding);
  const [transactionLogPayload, setTransactionLogPayload] = useState({});

  const [userId, setUserId] = useState(REACT_APP_USER_ID);
  const [requestId, setRequestId] = useState(uuidv4());
  const [amount, setAmount] = useState(`${getRandomInt(100)}.${getRandomInt(100)}`);
  const [scenarioId, setScenarioId] = useState("");
  const [lang, setLang] = useState("en");

  const [kycNeededLoading, setKycNeededLoading] = useState(false);
  const [createUserLoading, setCreateUserLoading] = useState(false);
  const [transactionLogLoading, setTransactionLogLoading] = useState(false);

  const props = { userId, requestId, amount, scenarioId, setUserId, transactionLogPayload };

  useEffect(() => {
    setTransactionLogPayload(generateTransactionLogPayload(transactionType, paymentInformation, amount, userId));
  }, ["", amount, transactionType, paymentInformation, userId]);

  return (
    <ContainerGrid>
      <Title>PTI SDK Example</Title>
      <Section style={{ gridArea: "informations" }}>
        <Header>
          <TuneOutlinedIcon />
          Settings
        </Header>
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth={true}
            id="userId"
            label="UserId"
            onChange={(e) => setUserId(e.target.value)}
            value={userId}
          />
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
        </Stack>
        <TextField
          fullWidth={true}
          id="requestId"
          label="RequestId"
          onChange={(e) => setRequestId(e.target.value)}
          value={requestId}
        />
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
        <Button
          endIcon={<OpenInNewOutlinedIcon />}
          fullWidth={true}
          onClick={() => openSimpleDialog(actionType.onboarding, userId, requestId, amount, scenarioId, lang)}
          variant="contained"
        >
          Open Onboarding Form
        </Button>
        <LoadingButton
          fullWidth={true}
          endIcon={<></>}
          loading={kycNeededLoading}
          loadingPosition="end"
          onClick={() => {
            setKycNeededLoading(true);
            checkIfKycNeeded(props).finally(() => setKycNeededLoading(false));
          }}
          variant="contained"
        >
          Check if Kyc Needed
        </LoadingButton>
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
                sendTransactionLog(props)
                  .then(() => {
                    setRequestId(uuidv4());
                  })
                  .finally(() => {
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
              enableClipboard={false}
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

      <SimpleDialog />
      <SnackAlert />
    </ContainerGrid>
  );
};

export { App };
