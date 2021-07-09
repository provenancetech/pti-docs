import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import {v4 as uuidv4} from 'uuid';
import io from "socket.io-client";
import {DialogActions} from "@material-ui/core";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

function SimpleDialog(props) {
    const {open, callback, type, userId, requestId, amount} = props;
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
                    PTI.form({
                        type: "KYC",
                        requestId: requestId,
                        userId: userId,
                        parentElement: document.getElementById(e.id),
                        callback: callback,
                        metaInformation: { var3: "value3", var4: "value4"}
                    });
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
                <Button variant="contained" onClick={() => setPaymentOpen(true)} fullWidth={true}>Open Payment
                    Form</Button><br/><br/>
                <Button variant="contained" onClick={() => setKycOpen(true)} fullWidth={true}>Open KYC Form</Button>
                <br/>
                <Copyright/>
            </Box>
            <SimpleDialog open={paymentOpen} callback={() => setPaymentOpen(false)} type="FIAT_FUNDING" userId={userId}
                          amount={amount} requestId={requestId}/>
            <SimpleDialog open={kycOpen} callback={() => setKycOpen(false)} type="KYC" userId={userId}
                          requestId={requestId}/>
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
