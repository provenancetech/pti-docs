import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

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
  const { open, callback, type } = props;
  const [ sdkInit, setSdkInit ] = React.useState(false);
  const ref = React.createRef(false);

  React.useEffect(() => {
        //setTimeout(() => callback(), 5000);
    }
  )

  const setRef = (e) => {
    if (e != null && !sdkInit) {
        setSdkInit(true);
        switch (type) {
            case 'FIAT_FUNDING':
                 PTI.form({
                   type: "FIAT_FUNDING",
                   requestId: "requestId",
                   userId: "userId",
                   amount: "34.00",
                   parentElement: document.getElementById(e.id)
                 })
                break;
            case 'KYC':
                PTI.form({
                      type: "KYC",
                      requestId: "requestId",
                      userId: "userId",
                      parentElement: document.getElementById(e.id)
                    });
                break;
        }
    }
  }

    const styles = {
        dialogPaper: {
            minHeight: '80vh',
            maxHeight: '80vh',
        },
    };

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
  const sdkInit = React.createRef(false);

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
        <Typography align="center" gutterBottom={true}>
            <Button variant="contained" onClick={handlePayment}>Open Payment Form</Button><br/><br/>
            <Button variant="contained" onClick={handleKyc}>Open KYC Form</Button>
        </Typography>
        <br/>
        <Copyright />
      </Box>
    <SimpleDialog open={paymentOpen} callback={handlePaymentCallback} type="FIAT_FUNDING"/>
    <SimpleDialog open={kycOpen} callback={handleKycCallback} type="KYC"/>
    </Container>
  );
}
