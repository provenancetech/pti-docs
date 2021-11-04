import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import {v4 as uuidv4} from 'uuid';
import io from "socket.io-client";
import {DialogActions} from "@material-ui/core";

function SimpleDialog(props) {
    const {open, callback, type, userId, requestId, amount, scenarioId} = props;
    const [sdkInit, setSdkInit] = React.useState(false);

    const setRef = (e) => {
        if (e != null && !sdkInit) {
            setSdkInit(true);
            switch (type) {
                case 'FIAT_FUNDING':
                    PTI.form({
                        type: "FIAT_FUNDING",
                        requestId: requestId,
                        userId: userId,
                        amount: amount,
                        parentElement: document.getElementById(e.id),
                        callback: callback,
                        metaInformation: { var1: "value1", var2: "value2"}
                    })
                    break;
                case 'KYC':
                    const params = {
                        type: "KYC",
                        requestId: requestId,
                        userId: userId,
                        parentElement: document.getElementById(e.id),
                        callback: callback,
                        metaInformation: { var3: "value3", var4: "value4"},
                    };
                    if (scenarioId) {
                        params.scenarioId = scenarioId;
                        params.amount = amount;
                    }
                    PTI.form(params);
                    break;
            }
        }
    }

    return (
        <Dialog open={open} fullScreen={true}>
            <DialogTitle>{type} - {amount} - {requestId}</DialogTitle>
            <DialogContent>
                <div id={type + "PlaceHolder"} ref={setRef} style={{width: '550px', height: '1200px'}}>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function App() {
    const [paymentOpen, setPaymentOpen] = React.useState(false);
    const [kycOpen, setKycOpen] = React.useState(false);
    const [userId, setUserId] = React.useState("d19e2e0f-2f80-44c1-93ba-591b57a37173");
    const [requestId, setRequestId] = React.useState(uuidv4());
    const [amount, setAmount] = React.useState('' + Math.round(Math.random() * 100) + '.' + Math.round(Math.random() * 100));
    const [scenarioId, setScenarioId] = React.useState('');
    const [okDialog, setOkDialog] = React.useState(false);
    const [errorDialog, setErrorDialog] = React.useState(false);

    let socket = io.connect("http://localhost:5000");

    React.useEffect(() => {
        socket.on(requestId, (msg) => {
            console.log(msg);
            setKycOpen(false);
            setPaymentOpen(false);
            switch (msg.resourceType) {
                case 'TRANSACTION_MONITORING':
                    if (msg.status !== 'ACCEPT') {
                        setOkDialog(false);
                        setErrorDialog(true);
                    }
                    break;
                case 'PAYMENT_PROCESSOR':
                    if (msg.status !== 'AUTHORIZED') {
                        setOkDialog(false);
                        setErrorDialog(true);
                    } else {
                        setErrorDialog(false);
                        setOkDialog(true);
                    }
                    break;
            }
        });
    }, [requestId])

    const closeOkDialog = () => setOkDialog(false);

    const closeErrorDialog = () => setErrorDialog(false);

    const generateToken = (payload) => {
        const url = ptiConfig.generateTokenPath;

        const headers = {
            "Content-type": "application/json",
        };

        const body = {
            "x-pti-client-id": ptiConfig.clientId,
            "x-pti-token-payload": payload,
        };

        const options = {
            method: "POST",
            body: JSON.stringify(body),
        };

        const config = {
            ...options,
            headers,
        };

        return fetch(url, config).then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(response.statusText);
        });
    }

    const callTransactionLog = (accessToken) => {
        const baseUrl = 'https://pti' + (ptiConfig.ptiPrefix ? ptiConfig.ptiPrefix : '') + '.apidev.pticlient.com/v0';
        const url = baseUrl + '/users/' + userId + '/transactionLogs';
        const date = new Date().toISOString();
        const headers = {
            "Content-type": "application/json",
            "x-pti-request-id": requestId,
            "x-pti-client-id": ptiConfig.clientId,
            'x-pti-token': accessToken,
            'x-pti-scenario-id': scenarioId,
            'Date': date
        };
        const body = {
            type: "FUNDING",
            amount: amount,
            usdValue: amount,
            initiator: {
                type: "PERSON",
                id: userId
            },
            sourceMethod: {
                currency: "USD",
                paymentInformation: {
                    type: "ENCRYPTED_CREDIT_CARD",
                    creditCardNumberHash: "feead9c948a4b3393498cf17816fb289c2d4d80d4ffb5b11a7171c5f6c48f573",
                    creditCardAddress: {}
                },
                paymentMethodType: "FIAT"
            },
            date: date
        }
        const options = {
            method: "POST",
            body: JSON.stringify(body),
        };
        const config = {
            ...options,
            headers
        }
        return fetch(url, config).then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(response.statusText);
        });
    }

    const sendTransactionLog = async () => {
        const token = await generateToken({
            method: 'POST',
            url: '/users/' + userId + '/transactionLogs'
        });
        const accessToken = token.accessToken;
        await callTransactionLog(accessToken)
            .then(() => alert("Sent successfully !"))
            .catch((e) => alert("Error:"+JSON.stringify(e)));
    }

    const callIsKycNeeded = (accessToken) => {
        const baseUrl = 'https://pti' + (ptiConfig.ptiPrefix ? ptiConfig.ptiPrefix : '') + '.apidev.pticlient.com/v0';
        const url = baseUrl + '/users/' + userId + '/kyc-needed?amount=' + amount;
        const date = new Date().toISOString();
        const headers = {
            "x-pti-request-id": requestId,
            "x-pti-client-id": ptiConfig.clientId,
            'x-pti-token': accessToken,
            'x-pti-scenario-id': scenarioId,
            'Date': date
        };
        const options = {
            method: "GET",
        };
        const config = {
            ...options,
            headers
        }
        return fetch(url, config).then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(response.statusText);
        });
    }

    const checkIfKycNeeded = async () => {
        const token = await generateToken({
            method: 'GET',
            url: '/users/' + userId + '/kyc-needed'
        });
        const accessToken = token.accessToken;
        await callIsKycNeeded(accessToken)
            .then((res) => alert("Response:"+JSON.stringify(res)))
            .catch((e) => alert("Error:"+JSON.stringify(e)));
    }

    return (
        <Container>
            <Box my={4}>
                <TextField id={"userId"} value={userId} onChange={(e) => setUserId(e.target.value)} label={'UserId'}
                           fullWidth={true}/>
                <br/><br/>
                <TextField id={"requestId"} value={requestId} onChange={(e) => setRequestId(e.target.value)}
                           label={'RequestId'}
                           fullWidth={true}/>
                <br/><br/>
                <TextField id={"amount"} value={amount} onChange={(e) => setAmount(e.target.value)} label={'Amount'}
                           fullWidth={true}/>
                <br/><br/>
                <TextField id={"scenarioId"} value={scenarioId} onChange={(e) => setScenarioId(e.target.value)} label={'ScenarioId'}
                           fullWidth={true}/><br/><br/>
                <Button variant="contained" onClick={() => setPaymentOpen(true)} fullWidth={true}>Open Payment
                    Form</Button><br/><br/>
                <Button variant="contained" onClick={() => setKycOpen(true)} fullWidth={true}>Open KYC Form</Button>
                <br/><br/>
                <Button variant="contained" onClick={sendTransactionLog} fullWidth={true}>Send Transaction Log</Button>
                <br/><br/>
                <Button variant="contained" onClick={checkIfKycNeeded} fullWidth={true}>Check if Kyc Needed</Button>
                <br/><br/>
            </Box>
            <SimpleDialog open={paymentOpen} callback={() => setPaymentOpen(false)} type="FIAT_FUNDING" userId={userId}
                          amount={amount} requestId={requestId} scenarioId={scenarioId}/>
            <SimpleDialog open={kycOpen} callback={() => setKycOpen(false)} type="KYC" userId={userId}
                          amount={amount} requestId={requestId} scenarioId={scenarioId}/>
            <Dialog open={okDialog} onClose={closeOkDialog}>
                <DialogTitle onClose={closeOkDialog}>All Good !</DialogTitle>
                <DialogContent>
                    <img src={"https://media.giphy.com/media/cOiXP74b6IDkpzb3Q7/giphy.gif"} alt={"All Good !"}/>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={closeOkDialog} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={errorDialog} onClose={closeErrorDialog}>
                <DialogTitle onClose={closeErrorDialog}>Nope</DialogTitle>
                <DialogContent>
                    <img src={"https://media.giphy.com/media/FEikw3bXVHdMk/giphy.gif"} alt={"Nope"}/>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={closeErrorDialog} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
