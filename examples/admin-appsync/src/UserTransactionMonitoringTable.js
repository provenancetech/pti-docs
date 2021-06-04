import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";

const UserTransactionMonitoringTable = (props) => {
    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <th>TransactionType</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>UsdValue</th>
                        <th>Status</th>
                        <th>Kyc Status</th>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.monitors.map(monitor => {
                                return (
                                    <TableRow key={monitor.request_id}>
                                        <TableCell>{monitor.transactionType}</TableCell>
                                        <TableCell>{monitor.date}</TableCell>
                                        <TableCell>{monitor.amount}</TableCell>
                                        <TableCell>{monitor.usdValue}</TableCell>
                                        <TableCell>{monitor.status}</TableCell>
                                        <TableCell>{monitor.kyc_status}</TableCell>
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