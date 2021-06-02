import './App.css';

import {useState} from "react";
import {Amplify} from "aws-amplify";
import {AmplifyAuthenticator, AmplifySignOut} from "@aws-amplify/ui-react";
import Clients from "./Clients";
import Users from "./Users";
import Kyc from "./Kyc";
import Payment from "./Payment";
import KycClient from "./KycClient";
import PaymentClient from "./PaymentClient";

const myAppConfig = {
    'aws_appsync_graphqlEndpoint': 'https://vnqiw6etffbejgojqldvmenalu.appsync-api.us-west-2.amazonaws.com/graphql',
    'aws_appsync_region': 'us-west-2',
    'aws_appsync_authenticationType': 'AMAZON_COGNITO_USER_POOLS',
    // 'aws_appsync_authenticationType': 'API_KEY',
    // 'aws_appsync_apiKey': 'da2-vc7fmj25jndzbowqg4tb7qrfki',
    Auth:{
        userPoolId: 'us-west-2_xXTCPUN7r',
        region: 'us-west-2',
        userPoolWebClientId: '23f0kr69tmkg3jp0ikpu6ths79'
    }
}

Amplify.configure(myAppConfig);

function App() {
    const [client, setClient] = useState(null)
    const [user, setUser] = useState(null)
    const [showKyc, setShowKyc] = useState(false)
    const [showUsers, setShowUsers] = useState(false)
    const [showKycClient, setShowKycClient] = useState(false)
    const [showTransaction, setShowTransaction] = useState(false)
    const [showPaymentClient, setShowPaymentClient] = useState(false)

    const clientAction = (action) => {
        setClient(action.client);
        if (action.type === 'user') {
            setShowUsers(true);
        } else if (action.type === 'kyc') {
            setShowKycClient(true);
        } else if (action.type === 'payment') {
            setShowPaymentClient(true);
        }
    }

    const userAction = (action) => {
        setUser(action.user);
        if (action.type === 'kyc') {
            setShowKyc(true);
        } else if (action.type === 'payment') {
            setShowTransaction(true);
        }
    }

    return (
        <AmplifyAuthenticator>
            <AmplifySignOut />
            <div className={'container'} style={{width: '90%'}}>
                {!client && <Clients callback={clientAction}/>}
                {showUsers && <Users client={client} callback={userAction}/>}
                {showKyc && <Kyc user={user}/>}
                {showKycClient && <KycClient client={client}/>}
                {showTransaction && <Payment user={user}/>}
                {showPaymentClient && <PaymentClient client={client}/>}
            </div>
        </AmplifyAuthenticator>
    );
}

export default App;
