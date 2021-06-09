import {
    Accordion, AccordionDetails, AccordionSummary,
    Button,
    Drawer,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core";
import {DateTime} from "luxon";
import {useEffect, useState} from "react";
import {API, graphqlOperation} from "aws-amplify";
import SearchIcon from '@material-ui/icons/Search';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const getPaymentsQuery = `
query ($user_id: ID!) {
  getPagedPaymentsByUser(user_id: $user_id, limit: 500, offset: 0) {
    request_id
    client_id
    user_id
    amount
    fees
    totalAmount
    transactionType
    date
    ipAddress
    sourceMethod {
        creditCard {
            first_6
            last_4
        }
    }
    status
    transaction_monitoring_status
    provider_used
    transaction_log_data
    initiator {
        user_id
        client_id
        external_id
        name {
            first_name
            last_name
            middle_name
        }
        addresses {
            street_address
            city
            state_code
            postal_code
            country
            default_address
        }
        emails {
            email_address
            default_email
        }
        phones {
            phone_number
            phone_type
            default_phone
        }    
    }
  }
}
`

const getWorldpayDetailsQuery = `
query ($request_id: ID!) {
    getWorldPayResultsByRequest(request_id: $request_id) {
        request_id
        client_id
        user_id
        order_code
        transaction_status
        create_date_time
        result_data
    }
}
`

const UserPaymentsTable = (props) => {
    const [payments, setPayments] = useState([]);
    const [drawerTitle, setDrawerTitle] = useState(null);
    const [drawerContent, setDrawerContent] = useState(null);
    const [drawerContext, setDrawerContext] = useState(null);

    useEffect(() => {
        if (props.userId == null) {
            return;
        }
        API.graphql(graphqlOperation(getPaymentsQuery, {
            user_id: props.userId
        })).then((obj) => {
            setPayments(obj.data.getPagedPaymentsByUser);
        }).catch(e => {
            console.log(e);
        });
    }, [props.userId])

    const showRequestDetails = (requestId) => {
        API.graphql(graphqlOperation(getWorldpayDetailsQuery, {
            request_id: requestId
        })).then((obj) => {
            const results = obj.data.getWorldPayResultsByRequest;
            let context = results.length > 0 ? {'OrderCode': results[0].order_code} : null;
            showDrawer('Details for request ' + requestId, results.map(r => r.result_data), context);
        }).catch(e => {
            console.log(e);
        });
    }

    const showDrawer = (title, content, context) => {
        setDrawerTitle(title);
        let formattedContent = content.map(part =>
            JSON.stringify(JSON.parse(part), null, 2)
        );
        setDrawerContent(formattedContent);
        setDrawerContext(context);
    }

    return (
        <div style={{display: 'flex', width: '100%'}}>
            <TableContainer component={Paper} style={{flexGrow: 1}}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>FullName</TableCell>
                            <TableCell>Emails</TableCell>
                            <TableCell>TransactionType</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>CreditCard</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>ProviderUsed</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            payments.map(payment => {
                                    return (
                                        <TableRow key={payment.request_id}>
                                            <TableCell>{payment.initiator.name.first_name} {payment.initiator.name.last_name}</TableCell>
                                            <TableCell>{payment.initiator.emails.map(emailObj => emailObj.email_address).join('<br/>')}</TableCell>
                                            <TableCell>{payment.transactionType}</TableCell>
                                            <TableCell>{DateTime.fromSeconds(payment.date).toISO()}</TableCell>
                                            <TableCell>{payment.amount}</TableCell>
                                            <TableCell>{payment.sourceMethod.creditCard.first_6 + '...' + payment.sourceMethod.creditCard.last_4}</TableCell>
                                            <TableCell>{payment.status}</TableCell>
                                            <TableCell>{payment.provider_used}</TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="primary"
                                                        onClick={() => showRequestDetails(payment.request_id)}>
                                                    <SearchIcon/>&nbsp;Log Data
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Drawer open={drawerTitle != null} onClose={() => setDrawerTitle(null)} anchor={'right'}>
                <div style={{padding: '10px'}}>
                    <h1>{drawerTitle}</h1>
                    {drawerContext &&
                        Object.keys(drawerContext).map(key => {
                            return (
                                <div style={{marginBottom: '10px'}} key={key}>
                                    <span style={{fontWeight: 'bold'}}>{key}</span>:&nbsp;
                                    <span>{drawerContext[key]}</span>
                                </div>
                            )
                        })
                    }
                    {drawerContent &&
                    drawerContent.map((content, index) => (
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Event {index + 1}</AccordionSummary>
                            <AccordionDetails>
                                    <pre>
                                        {content}
                                    </pre>
                            </AccordionDetails>
                        </Accordion>
                    ))
                    }
                </div>
            </Drawer>
        </div>
    )
}

export default UserPaymentsTable;