import './App.css';

import {useState} from "react";
import {Amplify} from "aws-amplify";
import {AmplifyAuthenticator, AmplifySignOut} from "@aws-amplify/ui-react";
import Clients from "./Clients";
import PaymentClient from "./PaymentClient";
import UserSearch from "./UserSearch";
import {Breadcrumbs, Chip} from "@material-ui/core";
import HomeIcon from '@material-ui/icons/Home';

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
    const [showPaymentClient, setShowPaymentClient] = useState(false)
    const [showUserSearch, setShowUserSearch] = useState(false)

    const clientAction = (action) => {
        setClient(action.client);
        if (action.type === 'payment') {
            setShowPaymentClient(true);
        } else if (action.type === 'search') {
            setShowUserSearch(true);
        }
    }

    const showHome = () => {
        setClient(null);
        setShowPaymentClient(false);
        setShowUserSearch(false);
    }

    return (
        <AmplifyAuthenticator>
            <AmplifySignOut />
            <Breadcrumbs>
                <Chip onClick={showHome} icon={<HomeIcon fontSize="small" />} label={'Home'} style={{margin:'5px'}}/>
            </Breadcrumbs>
            <div>
                {!client && <Clients callback={clientAction}/>}
                {showPaymentClient && <PaymentClient client={client}/>}
                {showUserSearch && <UserSearch client={client}/>}
            </div>
        </AmplifyAuthenticator>
    );
}

export default App;
