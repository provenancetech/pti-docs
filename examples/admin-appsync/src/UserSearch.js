import {
    Button,
    Card,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell, TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@material-ui/core";
import {useState} from "react";
import UserSummary from "./UserSummary";

const UserSearch = () => {
    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [userId, setUserId] = useState(null);

    const search = () => {
        if (searchText !== '') {
            setUsers([
                {
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
            ])
        } else {
            setUsers([]);
        }
    }

    const showUser = (userId) => {
        setUserId(userId);
    }

    return (
        <div>
            <Grid container>
                <Grid item xs={12}>
                    <Card>
                        <CardContent style={{display: 'flex'}}>
                            <TextField style={{flexGrow: 1}} value={searchText}
                                       onChange={(e) => setSearchText(e.target.value)}
                                       label={'Search Term'}
                            />
                            <Button ariant="contained" color="primary" onClick={search}>Search</Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>FullName</TableCell>
                                    <TableCell>Country</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    users.map(user =>
                                        <TableRow key={user.id} onDoubleClick={() => showUser(user.id)}>
                                            <TableCell>{user.name.first_name} {user.name.last_name}</TableCell>
                                            <TableCell>{user.default_address.country}</TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            <UserSummary userId={userId} onClose={() => setUserId(null)}/>
        </div>
    )
}

export default UserSearch;

