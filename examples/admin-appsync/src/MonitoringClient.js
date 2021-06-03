import {useEffect, useState} from "react";
import {API, graphqlOperation} from "aws-amplify";

const listMonitorings = `
query ($client_id: ID!, $offset: Int!, $limit: Int!) {
  getPagedTransactionMonitoringByClient(client_id: $client_id, limit: $limit, offset: $offset) {
    request_id
    client_id
    user_id
    amount
    usdValue
    ipAddress
    transactionType
    status
    kyc_status
    transaction_log_data
    date
  }
} 
`

const MonitoringClient = (props) => {
    const [monitorings, setMonitorings] = useState([]);
    const [monitoring, setMonitoring] = useState(null);
    const [offset, setOffset] = useState(0);
    const pageSize = 12;

    useEffect(() => {
        API.graphql(graphqlOperation(listMonitorings, {
            client_id: props.client.id,
            offset: offset,
            limit: pageSize
        })).then((obj) => {
            setMonitorings(obj.data.getPagedTransactionMonitoringByClient);
        }).catch(e => {
            console.log(e);
        });
    }, [props.client, offset])

    return (
        <div>
            <h1>Payments for client {props.client.name}</h1>
            <div className={'row'}>
                <div className={'col s6'}>
                    <table className={'highlight'}>
                        <thead>
                        <tr>
                            <th>TransactionType</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>UsdValue</th>
                            <th>Status</th>
                            <th>Kyc Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            monitorings.map(payment =>
                                <tr onClick={() => setMonitoring(payment)} key={payment.request_id}>
                                    <td>{payment.transactionType}</td>
                                    <td>{payment.date}</td>
                                    <td>{payment.amount}</td>
                                    <td>{payment.usdValue}</td>
                                    <td>{payment.status}</td>
                                    <td>{payment.kyc_status}</td>
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
                            <span className={'card-title'}>Payment Details</span>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>UserId:</div>
                                <div className={'col s9'}>{monitoring && monitoring.user_id}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>RequestId:</div>
                                <div className={'col s9'}>{monitoring && monitoring.request_id}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>TransactionType:</div>
                                <div className={'col s9'}>{monitoring && monitoring.transactionType}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>Date:</div>
                                <div className={'col s9'}>{monitoring && monitoring.date}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>Amount:</div>
                                <div className={'col s9'}>{monitoring && monitoring.amount}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>UsdValue:</div>
                                <div className={'col s9'}>{monitoring && monitoring.usdValue}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>IpAddress:</div>
                                <div className={'col s9'}>{monitoring && monitoring.ipAddress}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>Status:</div>
                                <div className={'col s9'}>{monitoring && monitoring.status}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>Kyc Status:</div>
                                <div className={'col s9'}>{monitoring && monitoring.kyc_status}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>LogData:</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s12'} style={{overflow:'scroll'}}><pre>{monitoring && JSON.stringify(JSON.parse(monitoring.transaction_log_data), null, 2)}</pre></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MonitoringClient;