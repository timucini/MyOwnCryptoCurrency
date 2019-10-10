import React, { Component } from 'react';
import Blocks from './Blocks';
import logo from '../../assets/img/logo.png'

class App extends Component {
    state = {
        walletInfo: { }
    };

    componentDidMount() {
        fetch('http://localhost:3000/api/getWallet')
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
                <br/>
                <div className='WalletInfo'>
                    <div>Adress: {address} </div>
                    <div>Balance: {balance}</div>
                </div>
                <br />
                <Blocks />
            </div>
        );
    }
}

export default App;

