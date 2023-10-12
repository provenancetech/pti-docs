import { generateToken } from "./generateToken";
import { callTransactionLog } from "../app/calls/callTransactionLog";
import { outputIfExists } from "../components/Utils";
import { showErrorSnackAlert, showSuccessSnackAlert } from "../components/snackAlert/SnackAlert";

const sendTransactionLog = async ({ userId, ...props }) => {
  const accessToken = await generateToken("POST", `/users/${userId}/transactionLogs`);
  if (accessToken) {
    await callTransactionLog({ accessToken, userId, ...props })
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

const generateTransactionLogPayload = (transactionType, paymentInformationType, amount, userId, subClientId) => {
  let payload = {};
  let paymentInformation = {};
  switch (paymentInformationType) {
    case "CREDIT_CARD":
      paymentInformation = {
        currency: "USD",
        paymentInformation: {
          creditCardAddress: {},
          creditCardNumberHash: "feead9c948a4b3393498cf17816fb289c2d4d80d4ffb5b11a7171c5f6c48f573",
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
          privateBlockchain: false
        },
      };
      break;
  }
  switch (transactionType) {
    case "FUNDING":
      payload = {
        amount,
        date: new Date().toISOString(),
        initiator: { id: userId, type: "PERSON" },
        sourceMethod: paymentInformation,
        type: "FUNDING",
        usdValue: amount,
      };
      break;
    case "WITHDRAWAL":
      payload = {
        amount: "1900",
        date: new Date().toISOString(),
        initiator: { id: userId, type: "PERSON" },
        destinationMethod: {
            paymentMethodType: "TOKEN",
            paymentInformation: {
                type: "TOKEN",
                tokenAddress: "0x0000000000000000000000000000000000000000",
                tokenType: "ATC",
                blockchain: "Ethereum",
                privateBlockchain: true
            },
        },
        type: "WITHDRAWAL",
        usdValue: "19",
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
      paymentInformation['paymentInformation']['privateBlockchain'] = true;
      paymentInformation['paymentInformation']['tokenType'] = 'ATC';
      paymentInformation['paymentInformation']['tokenAddress'] = '0x0000000000000000000000000000000000000000';
      payload = {
        amount,
        date: new Date().toISOString(),
        initiator: { id: userId, type: "PERSON" },
        sourceMethod: paymentInformation,
        type: "BUY",
        usdValue: amount,
        asset: {
          transactedAssetType: "NFT",
            transactedAssetReference: "Item Description: Uncommon Great Harrison Smith Level 1 Item Title: S, Mint Condition, #33/40 From Core 22 Set Item ID: 015168ee-bb00-4fec-97c9-c624f35d5e29"
          }
      };
      break;
    case "SELL":
      paymentInformation['paymentInformation']['privateBlockchain'] = true;
      paymentInformation['paymentInformation']['tokenType'] = 'ATC';
      paymentInformation['paymentInformation']['tokenAddress'] = '0x0000000000000000000000000000000000000000';
      payload = {
        amount: "2500",
        date: new Date().toISOString(),
        initiator: { id: userId, type: "PERSON" },
        destinationMethod: paymentInformation,
        type: "SELL",
        usdValue: "25",
        asset: {
          transactedAssetType: "NFT",
          transactedAssetReference: "Item Description: Very Rare Great Devin White Level 3 Item Title: LB, Mint Condition, #15/25 From Founders Set Item ID: 6186b7c9-d2aa-431d-8017-c050bcf1c8fb",
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
  payload['subClientId'] = subClientId;
  return payload;
};

export { sendTransactionLog, generateTransactionLogPayload };
