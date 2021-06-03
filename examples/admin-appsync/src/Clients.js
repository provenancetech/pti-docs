import {API, graphqlOperation} from "aws-amplify";
import {useEffect, useState} from "react";


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
        <div>
            <h1>Clients</h1>
            {
                clients.map(client =>
                    <div className={'row'} key={client.id}>
                        <div className={'card'}>
                            <div className={'card-content'}>
                                <span className={'card-title'} style={{fontWeight: 'bold'}}>{client.name}</span>
                                <div className={'row'}>
                                    <div className={'col s3'} style={{fontWeight: 'bold'}}>Id:</div>
                                    <div className={'col s9'}>{client.id}</div>
                                </div>
                                <div className={'row'}>
                                    <div className={'col s3'} style={{fontWeight: 'bold'}}>CountryCode:</div>
                                    <div className={'col s9'}>{client.country_code}</div>
                                </div>
                                <div className={'row'}>
                                    <div className={'col s3'} style={{fontWeight: 'bold'}}>StateCode:</div>
                                    <div className={'col s9'}>{client.state_code}</div>
                                </div>
                            </div>
                            <div className={'card-action'}>
                                <button className={'waves-effect waves-light btn'} onClick={() => props.callback({type:'user',client:client})}>Show Users</button>&nbsp;
                                <button className={'waves-effect waves-light btn'} onClick={() => props.callback({type:'kyc',client:client})}>Show Kyc's</button>&nbsp;
                                <button className={'waves-effect waves-light btn'} onClick={() => props.callback({type:'payment',client:client})}>Show Payments</button>&nbsp;
                                <button className={'waves-effect waves-light btn'} onClick={() => props.callback({type:'monitoring',client:client})}>Show Transaction Monitoring</button>&nbsp;
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Clients;