import React from 'react';
import { render } from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import App from './components/App';
import './index.css';
import history from './history';
import Blocks from './components/Blocks';
import GenerateTransaction from './components/GenerateTransaction';
import TransactionPool from './components/TransactionPool';
import 'bootstrap/dist/css/bootstrap.min.css';

render(
    <Router history={history}>
        <Switch>
            <Route exact path='/' component={App} />
            <Route path='/blocks' component={Blocks} />
            <Route path='/generate' component={GenerateTransaction} />
            <Route path='/pool' component={TransactionPool} />
        </Switch>
    </Router>,
    document.getElementById('root')
);