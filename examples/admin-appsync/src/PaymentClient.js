import {useEffect, useState} from "react";
import {API, graphqlOperation} from "aws-amplify";
import {DateTime} from "luxon";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer, TableFooter,
    TableHead,
    TablePagination,
    TableRow
} from "@material-ui/core";
import UserSummary from "./UserSummary";
import RefreshIcon from '@material-ui/icons/Refresh';
import ToggleButton from '@material-ui/lab/ToggleButton';

const listPayments = `
query ($client_id: ID!, $offset: Int!, $limit: Int!) {
  getPagedPaymentsByClient(client_id: $client_id, limit: $limit, offset: $offset) {
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
    transaction_log_data
    status    
  }
} 
`

const PaymentClient = (props) => {
    const [payments, setPayments] = useState([]);
    const [userId, setUserId] = useState(null);
    const [offset, setOffset] = useState(0);
    const [requestId, setRequestId] = useState('');
    const [pageSize, setPageSize] = useState(25);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [timer, setTimer] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(DateTime.now());

    useEffect(() => {
        console.log("Getting payments !");
        API.graphql(graphqlOperation(listPayments, {
            client_id: props.client.id,
            offset: offset * pageSize,
            limit: pageSize
        })).then((obj) => {
            setPayments(obj.data.getPagedPaymentsByClient);
        }).catch(e => {
            console.log(e);
        });
    }, [props.client, offset, pageSize, lastUpdate])

    const setTimerFunc = () => {
        setLastUpdate(DateTime.now());
        setTimer(setTimeout(setTimerFunc, 10000));
    }

    const toggleAutoRefresh = () => {
        setAutoRefresh(!autoRefresh);
        if (timer == null) {
            setTimerFunc();
        } else {
            clearTimeout(timer);
            setTimer(null);
        }
    }

    return (
        <div>
            <div style={{display: 'flex', alignItems:'center', marginLeft: '10px'}}>
                <h1>Payments for client {props.client.name}</h1>
                <span style={{flexGrow: 1}}/>
                <div style={{verticalAlign: 'middle', marginRight: '10px'}}>Last Update: {lastUpdate.toISO()}</div>
                <div style={{marginRight: '10px'}}>
                    <ToggleButton selected={autoRefresh} onClick={toggleAutoRefresh}
                                  value={'autoRefresh'}><RefreshIcon/></ToggleButton>
                </div>
            </div>
            <TableContainer component={Paper}>
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            payments.map(payment => {
                                const initiator = JSON.parse(payment.transaction_log_data).initiator;

                                return (
                                    <TableRow key={payment.request_id} onClick={() => setRequestId(payment.request_id)}
                                              selected={requestId === payment.request_id}
                                              onDoubleClick={() => setUserId(payment.user_id)}
                                    >
                                        <TableCell>{initiator.name.firstName} {initiator.name.lastName}</TableCell>
                                        <TableCell>{initiator.emails.map(emailObj => emailObj.emailAddress).join('<br/>')}</TableCell>
                                        <TableCell>{payment.transactionType}</TableCell>
                                        <TableCell>{DateTime.fromSeconds(payment.date).toISO()}</TableCell>
                                        <TableCell>{payment.amount}</TableCell>
                                        <TableCell>{payment['sourceMethod']['creditCard'].first_6 + '...' + payment.sourceMethod.creditCard.last_4}</TableCell>
                                        <TableCell>{payment.status}</TableCell>
                                    </TableRow>
                                )
                                }
                            )
                        }
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination count={-1} onChangePage={(e, p) => setOffset(p)} page={offset}
                                             rowsPerPage={pageSize} rowsPerPageOptions={[10, 25, 50]}
                                             onChangeRowsPerPage={(e) => {
                                                 setPageSize(parseInt(e.target.value));
                                                 setOffset(0);
                                             }}/>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
            <UserSummary userId={userId} onClose={() => setUserId(null)}/>
        </div>
    )
}

export default PaymentClient;