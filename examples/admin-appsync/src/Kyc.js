import {useEffect, useState} from "react";
import {API, graphqlOperation} from "aws-amplify";

const listKycs = `
query ($user_id: ID!) {
  getKycsByUser(user_id: $user_id) {
    request_id
    status
    ip_address
    log_data
    create_date_time
  }
} 
`

const Kyc = (props) => {
    const [kycs, setKycs] = useState([]);
    const [kyc, setKyc] = useState(null);

    useEffect(() => {
        API.graphql(graphqlOperation(listKycs, {
            user_id: props.user.id
        })).then((obj) => {
            setKycs(obj.data.getKycsByUser);
        }).catch(e => {
            console.log(e);
        });
    }, [props.user])

    return (
        <div>
            <h1>Kyc for user {props.user.name.first_name} {props.user.name.last_name}</h1>
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
                                <tr onClick={() => setKyc(kyc)} key={kyc.id}>
                                    <td>{kyc.create_date_time}</td>
                                    <td>{kyc.status}</td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                </div>
                <div className={'col s6'}>
                    <div className={'card'}>
                        <div className={'card-content'}>
                            <span className={'card-title'}>Kyc Details</span>
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
                                <div className={'col s9'}>{kyc && kyc.log_data}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Kyc;