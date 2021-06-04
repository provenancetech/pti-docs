import {API, graphqlOperation} from "aws-amplify";
import {useEffect, useState} from "react";
import {Button, Card, CardActions, CardContent, Grid} from "@material-ui/core";


const listClients = `
  query getClient { 
    getClients { 
      country_code id name state_code
    }
  }
`

const Clients = (props) => {
    const [ clients, setClients ] = useState([]);

    useEffect(() => refresh(), [])

    const refresh = () => {
        API.graphql(graphqlOperation(listClients)).then((obj) => {
            setClients(obj.data.getClients);
        }).catch(e => {
            console.log(e);
        });
    }

    return (
        <div style={{padding:'10px'}}>
            <h1>Clients</h1>
            {
                clients.map(client =>
                    <Card variant="outlined" style={{marginBottom:'10px'}} key={client.id}>
                        <CardContent>
                            <h2>{client.name}</h2>
                            <Grid container>
                                <Grid item xs={3}>Id:</Grid>
                                <Grid item xs={9}>{client.id}</Grid>
                                <Grid item xs={3}>CountryCode:</Grid>
                                <Grid item xs={9}>{client.country_code}</Grid>
                                <Grid item xs={3}>StateCode:</Grid>
                                <Grid item xs={9}>{client.state_code}</Grid>
                            </Grid>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" color="primary" onClick={() => props.callback({type:'payment',client:client})}>Show Payments</Button>
                            <Button variant="contained" color="primary" onClick={() => props.callback({type:'search',client:client})}>Search Users</Button>
                        </CardActions>
                    </Card>
                )
            }
        </div>
    )
}

export default Clients;