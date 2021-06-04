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
import {useEffect, useState} from "react";
import {DateTime} from "luxon";
import UserPaymentsTable from "./UserPaymentsTable";
import UserKycsTable from "./UserKycsTable";
import UserTransactionMonitoringTable from "./UserTransactionMonitoringTable";
import UserDetails from "./UserDetails";

const UserSummary = (props) => {
    const [user, setUser] = useState(null);
    const [payments, setPayments] = useState([]);
    const [kycs, setKycs] = useState([]);
    const [monitors, setMonitors] = useState([]);

    useEffect(() => {
        const dummyUser = {
            name: {first_name: 'John', last_name: 'Doe'},
            emails: [{emailAddress: 'john.doe@gmail.com'}],
            id: Math.random().toString(36).substring(16),
            default_email_address: 'john.doe@gmail.com',
            default_phone_number: '514 123 4567',
            default_address: {
                street_address: '1 main street',
                city: 'New York',
                state_code: 'NY',
                country: 'US'
            }
        }
        setUser(props.userId == null ? null : dummyUser);
        if (props.userId == null) {
            setPayments([]);
        } else {
            const dummyInitiator = {
                name: {firstName: 'John', lastName: 'Doe'},
                emails: [{emailAddress: 'john.doe@gmail.com'}]
            }
            setPayments([{
                transaction_log_data: JSON.stringify({initiator: dummyInitiator}),
                transactionType: 'WITHDRAWAL',
                date: DateTime.now().toSeconds(),
                amount: 100,
                status: 'ACCEPTED',
                request_id: Math.random().toString(36).substring(16),
                sourceMethod: {
                    creditCard: {
                        first_6: '123456',
                        last_4: '1234'
                    }
                }
            }])
        }
        if (props.userId == null) {
            setKycs([]);
        } else {
            setKycs([{
                create_date_time: DateTime.now().toISO(),
                status: 'ACCEPTED',
                request_id: Math.random().toString(36).substring(16),
            }])
        }
        if (props.userId == null) {
            setMonitors([]);
        } else {
            setMonitors([{
                transactionType: 'WITHDRAWAL',
                date: DateTime.now().toISO(),
                amount: 77,
                useValue: 150,
                status: 'ACCEPTED',
                kyc_status: 'ACCEPTED',
                request_id: Math.random().toString(36).substring(16)
            }]);
        }
    }, [props.userId])

    const close = () => {
        setUser(null);
        props.onClose();
    }

    return (
        <Dialog fullScreen open={user != null} onClose={close}>
            <AppBar style={{position: 'relative'}}>
                <Toolbar>
                    <Typography style={{flexGrow: 1}}>
                        User {user && user.name.first_name} {user && user.name.last_name}
                    </Typography>
                    <IconButton onClick={close}>
                        <CloseIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Accordion TransitionProps={{unmountOnExit: true}} expanded={true}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>User</AccordionSummary>
                <AccordionDetails>
                    <UserDetails user={user}/>
                </AccordionDetails>
            </Accordion>
            <Accordion TransitionProps={{unmountOnExit: true}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Payments</AccordionSummary>
                <AccordionDetails>
                    <UserPaymentsTable payments={payments}/>
                </AccordionDetails>
            </Accordion>
            <Accordion TransitionProps={{unmountOnExit: true}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Kyc's</AccordionSummary>
                <AccordionDetails>
                    <UserKycsTable kycs={kycs}/>
                </AccordionDetails>
            </Accordion>
            <Accordion TransitionProps={{unmountOnExit: true}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Transaction Monitoring's</AccordionSummary>
                <AccordionDetails>
                    <UserTransactionMonitoringTable monitors={monitors}/>
                </AccordionDetails>
            </Accordion>
        </Dialog>
    )
}

export default UserSummary;