import {
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
import {useEffect, useState} from "react";
import {API, graphqlOperation} from "aws-amplify";
import SearchIcon from '@material-ui/icons/Search';

const getSarsQuery = `
query ($user_id: ID!) {
  getSarsByUser(user_id: $user_id) {
    user_id
    external_user_id
    client_id
    external_id
    request_id
    sar_status
    request_data
    result_data
    create_date_time
  }
}
`


const SARTable = (props) => {
    const [sars, setSars] = useState([]);
    const [drawerTitle, setDrawerTitle] = useState(null);
    const [drawerContent, setDrawerContent] = useState(null);

    useEffect(() => {
        if (props.userId == null) {
            return;
        }
        API.graphql(graphqlOperation(getSarsQuery, {
            user_id: props.userId
        })).then((obj) => {
            setSars(obj.data.getSarsByUser);
        }).catch(e => {
            console.log(e);
        });
    }, [props.userId])

    const showDrawer = (title, content) => {
        setDrawerTitle(title);
        setDrawerContent(JSON.stringify(JSON.parse(content), null, 2));
    }

    return (
        <div style={{display: 'flex', width: '100%'}}>
            <TableContainer component={Paper} style={{flexGrow: 1}}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>UserId</TableCell>
                            <TableCell>ExternalUserId</TableCell>
                            <TableCell>RequestId</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            sars.map(sar => {
                                    return (
                                        <TableRow key={sar.request_id}>
                                            <TableCell>{sar.create_date_time.substring(0, 19)}</TableCell>
                                            <TableCell>{sar.user_id}</TableCell>
                                            <TableCell>{sar.external_user_id}</TableCell>
                                            <TableCell>{sar.request_id}</TableCell>
                                            <TableCell>{sar.sar_status}</TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="primary" onClick={() => showDrawer('Request Data', sar.request_data)}>
                                                    <SearchIcon />&nbsp;Request
                                                </Button>
                                                &nbsp;
                                                <Button variant="contained" color="primary" onClick={() => showDrawer('Result Data', sar.result_data)}>
                                                    <SearchIcon />&nbsp;Result
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
                    <pre>
                    {drawerContent}
                </pre>
                </div>
            </Drawer>
        </div>
    )
}

export default SARTable;