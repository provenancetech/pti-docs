import {
    Accordion, AccordionDetails,
    AccordionSummary,
    AppBar,
    Dialog,
    IconButton, Toolbar,
    Typography
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {useState} from "react";
import UserPaymentsTable from "./UserPaymentsTable";
import UserKycsTable from "./UserKycsTable";
import UserTransactionMonitoringTable from "./UserTransactionMonitoringTable";
import UserDetails from "./UserDetails";
import SARTable from "./SARTable";

const UserSummary = (props) => {
    const [expandUser, setExpandUser] = useState(true);

    const close = () => {
        setExpandUser(true);
        props.onClose();
    }

    return (
        <Dialog fullScreen open={props.userId != null} onClose={close}>
            <AppBar style={{position: 'relative'}}>
                <Toolbar>
                    <Typography style={{flexGrow: 1}}>
                        User {props.userId}
                    </Typography>
                    <IconButton onClick={close}>
                        <CloseIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Accordion TransitionProps={{unmountOnExit: true}} expanded={expandUser}
                       onClick={() => setExpandUser(!expandUser)}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>User</AccordionSummary>
                <AccordionDetails>
                    <UserDetails userId={props.userId}/>
                </AccordionDetails>
            </Accordion>
            <Accordion TransitionProps={{unmountOnExit: true}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Payments</AccordionSummary>
                <AccordionDetails>
                    <UserPaymentsTable userId={props.userId}/>
                </AccordionDetails>
            </Accordion>
            <Accordion TransitionProps={{unmountOnExit: true}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Kyc's</AccordionSummary>
                <AccordionDetails>
                    <UserKycsTable userId={props.userId}/>
                </AccordionDetails>
            </Accordion>
            <Accordion TransitionProps={{unmountOnExit: true}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Transaction Monitoring's</AccordionSummary>
                <AccordionDetails>
                    <UserTransactionMonitoringTable userId={props.userId}/>
                </AccordionDetails>
            </Accordion>
            <Accordion TransitionProps={{unmountOnExit: true}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Suspect Activity Report's</AccordionSummary>
                <AccordionDetails>
                    <SARTable userId={props.userId}/>
                </AccordionDetails>
            </Accordion>
        </Dialog>
    )
}

export default UserSummary;