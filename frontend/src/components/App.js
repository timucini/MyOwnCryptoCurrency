import React, { Component } from 'react';
import { Button, Row, Col, Jumbotron  } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
    state = {
        walletInfo: { }
    };

    componentDidMount() {
        fetch(`${document.location.origin}/api/getWallet`)
            .then(response => response.json())
            .then(json => this.setState({ walletInfo: json}));
    }

    render() {
        const { address, privateKey, balance } = this.state.walletInfo;


        return(
            <div className='App'>
                <br/>
                <div>
                    <div><p className="address">test wallet address:</p> <h3>{address}</h3> </div>
                    <div><p className="balance">Balance: </p> <h3>{balance} Coins</h3></div>
                    <div><p className="balance">Private Key: </p> <h3>{privateKey}</h3> <h3 className="Note">(Note: NORMALLY NOT SHOWN!)</h3></div>
                </div>
                <br />
                <Row>
                    <Col>
                        <Button className="MainBtn" bsStyle="primary" href="/blocks" bsSize="large">Blockchain</Button>
                    </Col>
                    <Col>
                        <Button className="MainBtn" bsStyle="primary" href="/generate" bsSize="large">Send Coins</Button>
                    </Col>
                    <Col>
                        <Button className="MainBtn" bsStyle="primary" href="/pool" bsSize="large">Transactionpool</Button>
                    </Col>
                </Row>
                <Jumbotron className="Jumbo">
                    <h3>Hello, User!</h3>
                    <h3>
                    This is a self implemented prototype.
                    </h3>
                    <h3>
                    It enables a cryptocurrency, which was implemented by Timur Burkholz in the course of his thesis.
                    </h3>
                    <h3>
                        You have full access to this wallet.
                    </h3>
                </Jumbotron>
                <br/>
            </div>
        );
    }
}

export default App;

