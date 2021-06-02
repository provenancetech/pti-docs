import {useEffect, useState} from "react";
import {API, graphqlOperation} from "aws-amplify";

const listUsers = `
query ($client_id: ID!, $offset: Int!, $limit: Int!) {
  getPagedUsersByClient(limit: $limit, offset: $offset, client_id: $client_id) {
    client_id
    external_id
    id
    name {
      first_name
      last_name
      middle_name
    }
    default_address {
      postal_code
      city
      country
      street_address
      state_code
    }
    default_phone_number
    default_email_address
  }
} 
`

const Users = (props) => {
    const pageSize = 10;
    const [offset, setOffset] = useState(0);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        API.graphql(graphqlOperation(listUsers, {
            client_id: props.client.id,
            offset: offset,
            limit: pageSize
        })).then((obj) => {
            setUsers(obj.data.getPagedUsersByClient);
        }).catch(e => {
            console.log(e);
        });
    }, [offset, props.client])

    return (
        <div>
            <h1>Users for {props.client.name}</h1>
            <div className={'row'}>
                <div className={'col s6'}>
                    <table className={'highlight'}>
                        <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            users.map(user =>
                                <tr onClick={() => setUser(user)} key={user.id}>
                                    <td>{user.name.first_name}</td>
                                    <td>{user.name.last_name}</td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                    <div style={{textAlign: 'center', padding: '10px'}}>
                        <button className={'waves-effect waves-light btn'}
                                onClick={() => setOffset(offset - pageSize)}>Previous
                        </button>
                        &nbsp;
                        <button className={'waves-effect waves-light btn'}
                                onClick={() => setOffset(offset + pageSize)}>Next
                        </button>
                    </div>
                </div>
                <div className={'col s6'}>
                    <div className={'card'}>
                        <div className={'card-content'}>
                            <span className={'card-title'}>User Details</span>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>Id:</div>
                                <div className={'col s9'}>{user && user.id}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>FirstName:</div>
                                <div className={'col s9'}>{user && user.name.first_name}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>LastName:</div>
                                <div className={'col s9'}>{user && user.name.last_name}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>DefaultEmail:</div>
                                <div className={'col s9'}>{user && user.default_email_address}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>PhoneNumber:</div>
                                <div className={'col s9'}>{user && user.default_phone_number}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>Address:</div>
                                <div className={'col s9'}>
                                    {user && user.default_address.street_address}<br/>
                                    {user && user.default_address.city}<br/>
                                    {user && user.default_address.state_code}<br/>
                                    {user && user.default_address.country}<br/>
                                </div>
                            </div>
                        </div>
                        <div className={'card-actions'} style={{textAlign: 'center', padding: '10px'}}>
                            <button className={'waves-effect waves-light btn'}
                                    onClick={() => props.callback({type: 'kyc', user: user})}>Show Kyc's
                            </button>
                            &nbsp;
                            <button className={'waves-effect waves-light btn'}
                                    onClick={() => props.callback({type: 'payment', user: user})}>Show Transactions
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Users;