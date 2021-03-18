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
import { v4 as uuidv4 } from 'uuid';

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
  const { open, callback, type, userId, requestId } = props;
  const [ sdkInit, setSdkInit ] = React.useState(false);

  const setRef = (e) => {
    if (e != null && !sdkInit) {
        setSdkInit(true);
        switch (type) {
            case 'FIAT_FUNDING':
                 PTI.form({
                     type: "FIAT_FUNDING",
                     requestId: requestId,
                     userId: userId,
                     amount: "34.00",
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
        <DialogTitle>{type}</DialogTitle>
        <DialogContent>
            <div id={ type + "PlaceHolder" } ref={setRef} style={{width:'550px',height:'1200px'}}>
            </div>
        </DialogContent>
    </Dialog>
  );
}

export default function App() {
  const [paymentOpen, setPaymentOpen] = React.useState(false);
  const [kycOpen, setKycOpen] = React.useState(false);
  const [userId, setUserId] = React.useState("9b83516d-1810-4e77-86fc-a4cad0a4bf94");
  const [requestId, setRequestId] = React.useState(uuidv4());

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

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  }

  const handleRequestIdChange = (e) => {
    setRequestId(e.target.value);
  }

  return (
    <Container>
      <Box my={4}>
        {/*<Typography align="center" gutterBottom={true} >*/}
            <TextField id={"userId"} value={userId} onChange={handleUserIdChange} label={'UserId'} fullWidth={true}/>
            <br/><br/>
            <TextField id={"requestId"} value={requestId} onChange={handleRequestIdChange} label={'RequestId'} fullWidth={true}/>
            <br/><br/>
            <Button variant="contained" onClick={handlePayment} fullWidth={true}>Open Payment Form</Button><br/><br/>
            <Button variant="contained" onClick={handleKyc} fullWidth={true}>Open KYC Form</Button>
        {/*</Typography>*/}
        <br/>
        <Copyright />
      </Box>
    <SimpleDialog open={paymentOpen} callback={handlePaymentCallback} type="FIAT_FUNDING" userId={userId}/>
    <SimpleDialog open={kycOpen} callback={handleKycCallback} type="KYC" userId={userId}/>
    </Container>
  );
}
