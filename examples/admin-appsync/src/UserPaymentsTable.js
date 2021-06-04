import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {DateTime} from "luxon";

const UserPaymentsTable = (props) => {
    return (
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
                        props.payments.map(payment => {
                                const initiator = JSON.parse(payment.transaction_log_data).initiator;

                                return (
                                    <TableRow key={payment.request_id}>
                                        <TableCell>{initiator.name.firstName} {initiator.name.lastName}</TableCell>
                                        <TableCell>{initiator.emails.map(emailObj => emailObj.emailAddress).join('<br/>')}</TableCell>
                                        <TableCell>{payment.transactionType}</TableCell>
                                        <TableCell>{DateTime.fromSeconds(payment.date).toISO()}</TableCell>
                                        <TableCell>{payment.amount}</TableCell>
                                        <TableCell>{payment.sourceMethod.creditCard.first_6 + '...' + payment.sourceMethod.creditCard.last_4}</TableCell>
                                        <TableCell>{payment.status}</TableCell>
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

export default UserPaymentsTable;