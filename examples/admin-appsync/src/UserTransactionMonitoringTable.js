import {
    AppBar, Box,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Tabs, Typography,
} from "@material-ui/core";
import {useEffect, useState} from "react";
import {API, graphqlOperation} from "aws-amplify";

const getMonitorsQuery = `
query ($user_id: ID!, $transactionType: String!) {
  getPagedTransactionMonitoringByUser(user_id: $user_id, limit: 500, offset: 0, transactionType: $transactionType) {
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
    const [monitorsTransfer, setMonitorsTransfer] = useState([]);
    const [monitorsWithdrawal, setMonitorsWithdrawal] = useState([]);
    const [monitorsFunding, setMonitorsFunding] = useState([]);
    const [tab, setTab] = useState(0);

    useEffect(() => {
        if (props.userId == null) {
            return;
        }
        API.graphql(graphqlOperation(getMonitorsQuery, {
            user_id: props.userId,
            transactionType: 'TRANSFER'
        })).then((obj) => {
            setMonitorsTransfer(obj.data.getPagedTransactionMonitoringByUser);
        }).catch(e => {
            console.log(e);
        });
        API.graphql(graphqlOperation(getMonitorsQuery, {
            user_id: props.userId,
            transactionType: 'WITHDRAWAL'
        })).then((obj) => {
            setMonitorsWithdrawal(obj.data.getPagedTransactionMonitoringByUser);
        }).catch(e => {
            console.log(e);
        });
        API.graphql(graphqlOperation(getMonitorsQuery, {
            user_id: props.userId,
            transactionType: 'FUNDING'
        })).then((obj) => {
            setMonitorsFunding(obj.data.getPagedTransactionMonitoringByUser);
        }).catch(e => {
            console.log(e);
        });
    }, [props.userId])

    const TabPanel = (props) => {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box p={3}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    const a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    return (
        <div style={{flexGrow:1}}>
            <AppBar position={'static'}>
                <Tabs value={tab} onChange={(e, t) => setTab(t)}>
                    <Tab label={'TRANSFER'} {...a11yProps(0)}/>
                    <Tab label={'WITHDRAWAL'} {...a11yProps(1)}/>
                    <Tab label={'FUNDING'} {...a11yProps(2)}/>
                </Tabs>
            </AppBar>
            <TabPanel value={tab} index={0}>
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
                                monitorsTransfer.map(monitor => {
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
                </TableContainer> </TabPanel>
            <TabPanel value={tab} index={1}>
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
                                monitorsWithdrawal.map(monitor => {
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
                </TableContainer> </TabPanel>
            <TabPanel value={tab} index={2}>
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
                                monitorsFunding.map(monitor => {
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
            </TabPanel>
        </div>
    )
}

export default UserTransactionMonitoringTable;