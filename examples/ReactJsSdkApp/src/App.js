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
                        callback: callback
                    })
                    break;
                case 'KYC':
                    PTI.form({
                        type: "KYC",
                        requestId: requestId,
                        userId: userId,
                        parentElement: document.getElementById(e.id),
                        callback: callback
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
    const [userId, setUserId] = React.useState("9db9738d-1b41-4fd8-8536-319be308d9f2");
    const [requestId, setRequestId] = React.useState(uuidv4());
    const [amount, setAmount] = React.useState('' + Math.round(Math.random() * 100) + '.' + Math.round(Math.random() * 100));

    let socket = io.connect("http://localhost:5000");

    React.useEffect(() => {
        socket.on(requestId, (msg) => {
            console.log(msg);
            setKycOpen(false);
            setPaymentOpen(false);
        });
    }, [requestId])

    const handlePayment = () => {
        setPaymentOpen(true);
    };

    const handleKyc = () => {
        setKycOpen(true);
    };

    const handlePaymentCallback = () => {
        setPaymentOpen(false);
    };

    const handleKycCallback = () => {
        setKycOpen(false);
    };

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
                <Button variant="contained" onClick={handlePayment} fullWidth={true}>Open Payment
                    Form</Button><br/><br/>
                <Button variant="contained" onClick={handleKyc} fullWidth={true}>Open KYC Form</Button>
                <br/>
                <Copyright/>
            </Box>
            <SimpleDialog open={paymentOpen} callback={handlePaymentCallback} type="FIAT_FUNDING" userId={userId} amount={amount} requestId={requestId} />
            <SimpleDialog open={kycOpen} callback={handleKycCallback} type="KYC" userId={userId} requestId={requestId} />
        </Container>
    );
}
