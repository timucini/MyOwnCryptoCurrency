import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
                <br />
                <diV>
                    <Link to='/blocks'>Blocks</Link>
                </diV>
                <div>
                    <Link to='/generate'>Generate Transction</Link>
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

