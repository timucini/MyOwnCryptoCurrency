import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/img/logo.png'

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
        const { address, balance } = this.state.walletInfo;


        return(
            <div className='App'>
                <img className='logo' src={logo}></img>
                <br/>
                <div>
                    Welcome to the Blockchain...
                </div>
                <br />
                <div>
                    <Link to='/blocks'>Blocks</Link>
                </div>
                <div>
                    <Link to='/generate'>Generate Transction</Link>
                </div>
                <div>
                    <Link to='/pool'>TransactionPool</Link>
                </div>
                <br/>
                <div className='WalletInfo'>
                    <div>Adress: {address} </div>
                    <div>Balance: {balance}</div>
                </div>
            </div>
        );
    }
}

export default App;

