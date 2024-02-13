import { generateToken } from "./generateToken";
import { callTransactionLog } from "../app/calls/callTransactionLog";
import { outputIfExists } from "../components/Utils";
import { showErrorSnackAlert, showSuccessSnackAlert } from "../components/snackAlert/SnackAlert";

const sendTransactionLog = async (props) => {
  const accessToken = await generateToken("POST", `/transactions/assessments`);
  if (accessToken) {
    await callTransactionLog({ accessToken, ...props })
      .then(() => showSuccessSnackAlert("Transaction log sent successfully"))
      .catch((e) =>
        showErrorSnackAlert(
          `Error ${outputIfExists(e.status)} while sending transaction log: ${JSON.stringify(e.error)}`
        )
      );
  } else {
    showErrorSnackAlert("Error while generating token.");
  }
};

const generateTransactionLogPayload = (transactionType, paymentInformationType, amount, userId) => {
  let payload = {};
  let paymentInformation = {};
  switch (paymentInformationType) {
    case "CREDIT_CARD":
      paymentInformation = {
        currency: "USD",
        paymentInformation: {
          creditCardAddress: {},
          creditCardReference: "feead9c948a4b3393498cf17816fb289c2d4d80d4ffb5b11a7171c5f6c48f573",
          type: "ENCRYPTED_CREDIT_CARD",
        },
        paymentMethodType: "FIAT",
      };
      break;
    case "TOKEN":
      paymentInformation = {
        paymentMethodType: "TOKEN",
        paymentInformation: {
          type: "TOKEN",
          tokenAddress: "0x2a2d248d83e58870b2a1bab0ec4438efdcb444e8",
          tokenType: "ETH",
          blockchain: "Ethereum",
        },
      };
      break;
  }
  switch (transactionType) {
    case "DEPOSIT":
      payload = {
        amount,
        date: new Date().toISOString(),
        initiator: { id: userId, type: "PERSON" },
        sourceMethod: paymentInformation,
        type: "DEPOSIT",
        usdValue: amount,
      };
      break;
    case "WITHDRAWAL":
      payload = {
        amount,
        date: new Date().toISOString(),
        initiator: { id: userId, type: "PERSON" },
        destinationMethod: paymentInformation,
        type: "WITHDRAWAL",
        usdValue: amount,
      };
      break;
    case "TRANSFER":
      payload = {
        amount,
        date: new Date().toISOString(),
        initiator: { id: userId, type: "PERSON" },
        destination: { id: userId, type: "PERSON" },
        sourceTransferMethod: paymentInformation,
        destinationTransferMethod: paymentInformation,
        type: "TRANSFER",
        usdValue: amount,
      };
      break;
    case "MINT":
      payload = {
        amount,
        date: new Date().toISOString(),
        destination: { id: userId, type: "PERSON" },
        destinationMethod: paymentInformation,
        type: "MINT",
        usdValue: amount,
      };
      break;
    case "BUY":
      payload = {
        amount,
        date: new Date().toISOString(),
        initiator: { id: userId, type: "PERSON" },
        sourceMethod: paymentInformation,
        type: "BUY",
        usdValue: amount,
        asset: {
          transactedAssetType: "COIN",
          transactedAssetReference: "https://coinmarketcap.com/currencies/rally/",
        },
      };
      break;
    case "SELL":
      payload = {
        amount,
        date: new Date().toISOString(),
        initiator: { id: userId, type: "PERSON" },
        destinationMethod: paymentInformation,
        type: "SELL",
        usdValue: amount,
        asset: {
          transactedAssetType: "COIN",
          transactedAssetReference: "https://coinmarketcap.com/currencies/rally/",
        },
      };
      break;
    case "SWAP":
      payload = {
        amount,
        date: new Date().toISOString(),
        initiator: { id: userId, type: "PERSON" },
        destinationMethod: paymentInformation,
        sourceMethod: paymentInformation,
        type: "SWAP",
        usdValue: amount,
      };
      break;
  }
  return payload;
};

export { sendTransactionLog, generateTransactionLogPayload };
