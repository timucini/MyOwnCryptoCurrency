import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Transaction from './Transaction';

class Block extends Component {
    state = { display: false };

    displayTransaction = () => {
        this.setState({
            display: !this.state.display
        })
    }

    get display() {
        const { data } = this.props.block;
        const stringifiedData = JSON.stringify(data);

        const dataDiplay = stringifiedData.length > 35 ?
            `${stringifiedData.substring(0,15)}...` :
            stringifiedData

        if(this.state.display) {
            return (
                <div>
                    {
                        data.map(transaction => (
                            <div key={transaction.id}>
                                <hr />
                                <Transaction transaction={transaction} />
                            </div>
                        ))
                    }
                    <br />
                    <Button
                        bsStyle="primary"
                        bsSize="small"
                        onClick={this.displayTransaction}
                    >
                        Show Less
                    </Button>
                </div>
            );
        };

        return (
            <div>
                <div>Data: {dataDiplay}</div>
                <Button
                    bsStyle="primary"
                    bsSize="large"
                    onClick={this.displayTransaction}
                    >
                        Show More..
                </Button>
            </div>
        );
    }

    render() {
        const { timestamp, hash } = this.props.block;

        const hashDisplay= `${hash.substring(0, 15)}...`
        
        return (
            <div className='Block'>
                <div>Hash: {hashDisplay}</div>
                <div>Timestamp: {new Date(timestamp).toLocaleDateString()}</div>
                {this.display}
            </div>
        )
    }
};

export default Block;