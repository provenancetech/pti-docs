import {useEffect, useState} from "react";
import {API, graphqlOperation} from "aws-amplify";
import {DateTime} from "luxon";

const listPayments = `
query ($client_id: ID!, $offset: Int!, $limit: Int!) {
  getPagedPaymentsByClient(client_id: $client_id, limit: $limit, offset: $offset) {
    request_id
    client_id
    user_id
    amount
    fees
    totalAmount
    transactionType
    date
    ipAddress
    sourceMethod {
        creditCard {
            first_6
            last_4
        }
    }
    transaction_log_data
    status    
  }
} 
`

const PaymentClient = (props) => {
    const [payments, setPayments] = useState([]);
    const [payment, setPayment] = useState(null);
    const [offset, setOffset] = useState(0);
    const pageSize = 12;

    useEffect(() => {
        API.graphql(graphqlOperation(listPayments, {
            client_id: props.client.id,
            offset: offset,
            limit: pageSize
        })).then((obj) => {
            setPayments(obj.data.getPagedPaymentsByClient);
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
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            payments.map(payment =>
                                <tr onClick={() => setPayment(payment)} key={payment.request_id}>
                                    <td>{payment.transactionType}</td>
                                    <td>{DateTime.fromSeconds(payment.date).toISO()}</td>
                                    <td>{payment.amount}</td>
                                    <td>{payment.status}</td>
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
                                <div className={'col s9'}>{payment && payment.user_id}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>RequestId:</div>
                                <div className={'col s9'}>{payment && payment.request_id}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>TransactionType:</div>
                                <div className={'col s9'}>{payment && payment.transactionType}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>Date:</div>
                                <div className={'col s9'}>{payment && DateTime.fromSeconds(payment.date).toISO()}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>Amount:</div>
                                <div className={'col s9'}>{payment && payment.amount}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>Fees:</div>
                                <div className={'col s9'}>{payment && payment.fees}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>TotalAmount:</div>
                                <div className={'col s9'}>{payment && payment.totalAmount}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>Status:</div>
                                <div className={'col s9'}>{payment && payment.status}</div>
                            </div>
                            <div className={'row'}>
                                <div className={'col s3'} style={{fontWeight: 'bold'}}>LogData:</div>
                                <div className={'col s9'}>{payment && payment.transaction_log_data}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentClient;