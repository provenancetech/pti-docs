import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {useEffect, useState} from "react";
import {API, graphqlOperation} from "aws-amplify";

const getMonitorsQuery = `
query ($user_id: ID!) {
  getPagedTransactionMonitoringByUser(user_id: $user_id, limit: 500, offset: 0) {
    request_id
    client_id
    user_id
    amount
    usdValue
    ipAddress
    transactionType
    sourceMethod {
        token {
            address
            type
        }
        creditCard {
            first_6
            last_4
        }
    }
    destinationMethod {
        token {
            address
            type
        }
        creditCard {
            first_6
            last_4
        }
    }
    status
    kyc_status
    date
    transaction_log_data
  }
}
`


const UserTransactionMonitoringTable = (props) => {
    const [monitors, setMonitors] = useState([]);

    useEffect(() => {
        if (props.userId == null) {
            return;
        }
        API.graphql(graphqlOperation(getMonitorsQuery, {
            user_id: props.userId
        })).then((obj) => {
            setMonitors(obj.data.getPagedTransactionMonitoringByUser);
        }).catch(e => {
            console.log(e);
        });
    }, [props.userId])

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>TransactionType</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>UsdValue</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Kyc Status</TableCell>
                        <TableCell>SourceMethod</TableCell>
                        <TableCell>DestinationMethod</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        monitors.map(monitor => {
                                const getFormattedMethod = (method) => {
                                    let result = '-';
                                    if (method != null) {
                                        if (method.creditCard != null) {
                                            result = method.creditCard.first_6 + '...' + method.creditCard.last_4;
                                        } else if (method.token != null) {
                                            result = method.token.address + ' (' + method.token.type + ')';
                                        }
                                    }
                                    const shorten = result.substring(0, 20);
                                    return shorten !== result ? shorten + "..." : shorten;
                                }
                                return (
                                    <TableRow key={monitor.request_id}>
                                        <TableCell>{monitor.transactionType}</TableCell>
                                        <TableCell>{monitor.date.substring(0, 19)}</TableCell>
                                        <TableCell>{monitor.amount}</TableCell>
                                        <TableCell>{monitor.usdValue}</TableCell>
                                        <TableCell>{monitor.status}</TableCell>
                                        <TableCell>{monitor.kyc_status}</TableCell>
                                        <TableCell>{getFormattedMethod(monitor.sourceMethod)}</TableCell>
                                        <TableCell>{getFormattedMethod(monitor.destinationMethod)}</TableCell>
                                    </TableRow>
                                )
                            }
                        )
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default UserTransactionMonitoringTable;