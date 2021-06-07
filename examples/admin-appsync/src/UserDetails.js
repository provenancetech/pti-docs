import {Card, CardContent, Grid} from "@material-ui/core";
import {useEffect, useState} from "react";
import {API, graphqlOperation} from "aws-amplify";

const getUserQuery = `
query ($user_id: ID!) {
  getUser(user_id: $user_id) {
    user_id
    client_id
    external_id
    name {
        first_name
        last_name
        middle_name
    }
    addresses {
        street_address
        city
        state_code
        postal_code
        country
        default_address
    }
    emails {
        email_address
        default_email
    }
    phones {
        phone_number
        phone_type
        default_phone
    }    
  }
}
`


const UserDetails = (props) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (props.userId == null) {
            return;
        }
        API.graphql(graphqlOperation(getUserQuery, {
            user_id: props.userId
        })).then((obj) => {
            setUser(obj.data.getUser[0]);
        }).catch(e => {
            console.log(e);
        });
    }, [props.userId]);

    return (
        <Card>
            <CardContent>
                <Grid container spacing={1}>
                    <Grid item xs={3} style={{fontWeight: 'bold'}}>Id:</Grid>
                    <Grid item xs={9}>{user && user.user_id}</Grid>
                    <Grid item xs={3} style={{fontWeight: 'bold'}}>FirstName:</Grid>
                    <Grid item xs={9}>{user && user.name.first_name}</Grid>
                    <Grid item xs={3} style={{fontWeight: 'bold'}}>LastName:</Grid>
                    <Grid item xs={9}>{user && user.name.last_name}</Grid>
                    <Grid item xs={3} style={{fontWeight: 'bold'}}>Emails:</Grid>
                    <Grid item xs={9}>
                        {user &&
                        user.emails.map((email, index) => (
                            <div key={'email-' + index}
                                 style={email.default_email ? {fontWeight: 'bold'} : {}}>{email.email_address}</div>
                        ))
                        }
                    </Grid>
                    <Grid item xs={3} style={{fontWeight: 'bold'}}>PhoneNumbers:</Grid>
                    <Grid item xs={9}>
                        {user &&
                        user.phones.map((phone, index) => (
                            <div key={'phone-' + index}
                                 style={phone.default_phone ? {fontWeight: 'bold'} : {}}>{phone.phone_number}, {phone.phone_type}</div>
                        ))
                        }
                        {user && user.default_phone_number}
                    </Grid>
                    <Grid item xs={3} style={{fontWeight: 'bold'}}>Addresses:</Grid>
                    <Grid item xs={9}>
                        {user &&
                        user.addresses.map((address, index) => (
                                <div key={'address-' + index}
                                     style={address.default_address ? {fontWeight: 'bold'} : {}}>
                                    {address.street_address}, {address.city}, {address.state_code}, {address.country}
                                </div>
                            )
                        )
                        }
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default UserDetails;