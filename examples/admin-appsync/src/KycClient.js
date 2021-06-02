import {useEffect, useState} from "react";
import {API, graphqlOperation} from "aws-amplify";

const listKycs = `
query ($client_id: ID!, $offset: Int!, $limit: Int!) {
  getPagedKycsByClient(client_id: $client_id, limit: $limit, offset: $offset) {
    user_id
    request_id
    status
    ip_address
    log_data
    create_date_time
  }
} 
`

const KycClient = (props) => {
    const [kycs, setKycs] = useState([]);
    const [kyc, setKyc] = useState(null);
    const [offset, setOffset] = useState(0);
    const pageSize = 12;

    useEffect(() => {
        API.graphql(graphqlOperation(listKycs, {
            client_id: props.client.id,
            offset: offset,
            limit: pageSize
        })).then((obj) => {
            setKycs(obj.data.getPagedKycsByClient);
        }).catch(e => {
            console.log(e);
        });
    }, [props.client, offset])

    return (
        <div>
            <h1>Kyc for client {props.client.name}</h1>
            <div className={'row'}>
                <div className={'col s6'}>
                    <table className={'highlight'}>
                        <thead>
                        <tr>
                            <th>CreateDateTime</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            kycs.map(kyc =>
                                <tr onClick={() => setKyc(kyc)} key={kyc.request_id}>
                                    <td>{kyc.create_date_time}</td>
                                    <td>{kyc.status}</td>
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
                            <span className={'card-title'}>Kyc Details</span>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>UserId:</div>
                                <div className={'col s9'}>{kyc && kyc.user_id}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>RequestId:</div>
                                <div className={'col s9'}>{kyc && kyc.request_id}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>Status:</div>
                                <div className={'col s9'}>{kyc && kyc.status}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>IpAddress:</div>
                                <div className={'col s9'}>{kyc && kyc.ip_address}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>CreateDate:</div>
                                <div className={'col s9'}>{kyc && kyc.create_date_time}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>LogData:</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s12'}><pre>{kyc && JSON.stringify(JSON.parse(kyc.log_data), null, 2)}</pre></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default KycClient