import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Row, Col } from 'react-bootstrap';
import history from '../history';

class GenerateTransaction extends Component {
    state = { recipient: '', amount: 0, knownAddresses: [], inputKey: '' };


    componentDidMount() {
        fetch(`${document.location.origin}/api/getAddresses`)
            .then(response => response.json())
            .then(json => this.setState({ knownAddresses: json }))
    }
    setInputKey = event => {
        this.setState({
            inputKey: event.target.value
        });
    };

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
        const { recipient, amount, inputKey } = this.state;

        fetch(`${document.location.origin}/api/generateTransaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipient, amount, inputKey })
        }).then(response => response.json())
            .then(json => {
                alert(json.message || json.type);
                history.push('./pool');
            });
    }

    render() {
        return(
            <div className='GenerateTransaction'>
                <Button  bsStyle="primary" href="/" bsSize="large">Back</Button>
                <h3>Generate a Transaction</h3>
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
                <FormGroup>
                    <Row>
                        <Col md={8}>
                            <FormControl
                                input='text'
                                placeholder='Private key'
                                value={this.state.inputKey}
                                onChange={this.setInputKey}
                            >
                            </FormControl>
                        </Col>
                        <Col md={4}>
                            <p className="hint">(Hint: See Startpage)</p>
                        </Col>
                    </Row>
                </FormGroup>
                <div>
                    <Button
                    bsStyle="primary"
                    onClick={this.generateTransaction}
                    >
                    Submit
                    </Button>
                </div>
                <br />
                <p className="balance">Known Addresses</p>
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
            </div>
        )
    }
}
export default GenerateTransaction;

