import {Card, CardContent, Grid} from "@material-ui/core";

const UserDetails = (props) => {
    return (
        <Card>
            <CardContent>
                <Grid container>
                    <Grid item xs={3} style={{fontWeight: 'bold'}}>Id:</Grid>
                    <Grid item xs={9}>{props.user && props.user.id}</Grid>
                    <Grid item xs={3} style={{fontWeight: 'bold'}}>FirstName:</Grid>
                    <Grid item xs={9}>{props.user && props.user.name.first_name}</Grid>
                    <Grid item xs={3} style={{fontWeight: 'bold'}}>LastName:</Grid>
                    <Grid item xs={9}>{props.user && props.user.name.last_name}</Grid>
                    <Grid item xs={3} style={{fontWeight: 'bold'}}>Email:</Grid>
                    <Grid item xs={9}>{props.user && props.user.default_email_address}</Grid>
                    <Grid item xs={3} style={{fontWeight: 'bold'}}>PhoneNumber:</Grid>
                    <Grid item xs={9}>{props.user && props.user.default_phone_number}</Grid>
                    <Grid item xs={3} style={{fontWeight: 'bold'}}>Address:</Grid>
                    <Grid item xs={9}>
                        {props.user && props.user.default_address.street_address}<br/>
                        {props.user && props.user.default_address.city}<br/>
                        {props.user && props.user.default_address.state_code}<br/>
                        {props.user && props.user.default_address.country}<br/>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default UserDetails;