import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Transaction from './Transaction';
import history from '../history';


const POOL_INERVAL_MS = 10000;

class TransactionPool extends Component {
    state = { transactionPoolMap: { } };

    fetchTransactionPoolMap = () => {
        fetch(`${document.location.origin}/api/getTransaction-pool-map`)
            .then(response => response.json())
            .then(json => this.setState({ transactionPoolMap: json }));
    }

    componentDidMount() {
        this.fetchTransactionPoolMap();

        this.fetchPoolMapInterval = setInterval(
            () => this.fetchTransactionPoolMap(),
            POOL_INERVAL_MS
        );
    }

    componentWillUnmount() {
        clearInterval(this.fetchPoolMapInterval);
    }

    mineTransactions = () => {
        fetch(`${document.location.origin}/api/mine-transactions`)
            .then(response => {
                if(response.status === 200) {
                    alert('success');
                    history.push('/blocks')
                } else {
                    alert('The mine-transactioon block request did not complete.');
                }
            })
    }

    render() {
        return(
            <div className='TransactionPool'>
                <div>
                <Button  bsStyle="primary" href="/" bsSize="large">Back</Button>
                </div>
                <h3>Transaction Pool</h3>
                {
                    Object.values(this.state.transactionPoolMap).map(transaction => {
                        return (
                            <div key={transaction.id}>
                                <hr />
                                <Transaction transaction={transaction} />
                            </div>
                        )
                    })
                }
                <hr />
                <Button
                bsStyle="primary"
                onClick={this.mineTransactions}
                >
                    Mine Transactions
                </Button>
            </div>
        )
    }
}

export default TransactionPool