import './App.css';

import {useEffect, useState} from "react";
import {API, graphqlOperation} from 'aws-amplify';
import {Amplify} from "aws-amplify";

const myAppConfig = {
    'aws_appsync_graphqlEndpoint': 'https://vnqiw6etffbejgojqldvmenalu.appsync-api.us-west-2.amazonaws.com/graphql',
    'aws_appsync_region': 'us-west-2',
    'aws_appsync_authenticationType': 'API_KEY',
    'aws_appsync_apiKey': 'da2-vc7fmj25jndzbowqg4tb7qrfki'
}

Amplify.configure(myAppConfig);

const listClients = `
  query getClient { 
    getClients { 
      country_code id name state_code
    }
  }
`

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

function App() {
    const [clients, setClients] = useState([])
    const [users, setUsers] = useState([])
    const [offset, setOffset] = useState(0)
    const [currentClientId, setCurrentClientId] = useState("")
    const pageSize = 5

    useEffect(() => {
        refreshCurrentClientUsers();
    }, [currentClientId, offset])

    const refresh = () => {
        API.graphql(graphqlOperation(listClients)).then((obj) => {
            setClients(obj.data.getClients);
        }).catch(e => {
            console.log(e);
        });
    }

    const refreshUsers = (clientId) => {
        console.log("Setting clientId to ",clientId);
        setCurrentClientId(clientId);
        setOffset(0);
    }

    const refreshCurrentClientUsers = () => {
        if (currentClientId === "") {
            return;
        }
        console.log("refreshCurrentClientUsers", currentClientId, offset, pageSize);
        API.graphql(graphqlOperation(listUsers, {client_id: currentClientId, offset: offset, limit: pageSize})).then((obj) => {
            setUsers(obj.data.getPagedUsersByClient);
        }).catch(e => {
            console.log(e);
        });
    }

    const previousUsers = () => {
        setOffset(offset - pageSize);
    }

    const nextUsers = () => {
        setOffset(offset + pageSize);
    }

    return (
        <div className="App">
            <h1>Clients</h1>
            <button onClick={refresh}>Refresh Client List</button>
            {
                clients.map(client =>
                    <div key={client.id}>
                        <p>{client.id}</p>
                        <p>{client.name}</p>
                        <button onClick={() => refreshUsers(client.id)}>Refresh User List</button>
                        <hr/>
                    </div>
                )
            }
            <h1>Users</h1>
            {
                users.map(user =>
                    <div key={user.id}>
                        <p>{user.id} / {user.name.first_name} / {user.name.last_name}</p>
                    </div>
                )
            }
            {users.length > 0 &&
                <div>
                    <button onClick={previousUsers}>Previous</button>
                    <button onClick={nextUsers}>Next</button>
                </div>
            }
        </div>
    );
}

export default App;
