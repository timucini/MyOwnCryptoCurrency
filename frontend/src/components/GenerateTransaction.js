import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';

class GenerateTransaction extends Component {
    state = { recipient: '', amount: 0, knownAddresses: [] };


    componentDidMount() {
        fetch(`${document.location.origin}/api/getAddresses`)
            .then(response => response.json())
            .then(json => this.setState({ knownAddresses: json }))
    }
    setRecipient = event => {
        this.setState({
            recipient: event.target.value
        });
    };

    setAmount = event => {
        this.setState({
            amount: Number(event.target.value)
        });
    };

    generateTransaction = () => {
        const { recipient, amount } = this.state;

        fetch(`${document.location.origin}/api/generateTransaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipient, amount })
        }).then(response => response.json())
            .then(json => {
                alert(json.message || json.type);
                history.push('./pool');
            });
    }

    render() {
        return(
            <div className='GenerateTransaction'>
                <Link to='/'>Home</Link>
                <h3>Generate a Transaction</h3>
                <br />
                <h4>Known Addresses</h4>
                {
                    this.state.knownAddresses.map(knownAddress => {
                        return ( 
                            <div key={knownAddress}>
                                <div>{knownAddress}</div>
                                <br />
                            </div>
                        )
                    })
                }
                <br />
                <FormGroup>
                    <FormControl
                        input='text'
                        placeholder='recipient'
                        value={this.state.recipient}
                        onChange={this.setRecipient}
                    >
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <FormControl
                        input='number'
                        placeholder='amount'
                        value={this.state.amount}
                        onChange={this.setAmount}
                    >
                    </FormControl>
                </FormGroup>
                <div>
                    <Button
                    bsStyle="danger"
                    onClick={this.generateTransaction}
                    >
                    Submit
                    </Button>
                </div>
            </div>
        )
    }
}
export default GenerateTransaction;

