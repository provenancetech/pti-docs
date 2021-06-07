import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {useEffect, useState} from "react";
import {API, graphqlOperation} from "aws-amplify";

const getKycsQuery = `
query ($user_id: ID!) {
  getKycsByUser(user_id: $user_id) {
    request_id
    client_id
    user_id
    status
    ip_address
    log_data
    create_date_time
  }
}
`

const UserKycsTable = (props) => {
    const [kycs,setKycs] = useState([]);

    useEffect(() => {
        if (props.userId == null) {
            return;
        }
        API.graphql(graphqlOperation(getKycsQuery, {
            user_id: props.userId
        })).then((obj) => {
            setKycs(obj.data.getKycsByUser);
        }).catch(e => {
            console.log(e);
        });
    }, [props.userId]);

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>RequestId</TableCell>
                        <TableCell>CreateDateTime</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>IpAddress</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        kycs.map(kyc => {
                                return (
                                    <TableRow key={kyc.request_id}>
                                        <TableCell>{kyc.request_id}</TableCell>
                                        <TableCell>{kyc.create_date_time}</TableCell>
                                        <TableCell>{kyc.status}</TableCell>
                                        <TableCell>{kyc.ip_address}</TableCell>
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