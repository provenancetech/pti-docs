import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";

const UserKycsTable = (props) => {
    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.kycs.map(kyc => {
                                return (
                                    <TableRow key={kyc.request_id}>
                                        <TableCell>{kyc.create_date_time}</TableCell>
                                        <TableCell>{kyc.status}</TableCell>
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

export default UserKycsTable;