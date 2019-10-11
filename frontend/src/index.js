import React from 'react';
import { render } from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import App from './components/App';
import './index.css';
import history from './history';
import Blocks from './components/Blocks';
import GenerateTransaction from './components/GenerateTransaction';

render(
    <Router history={history}>
        <Switch>
            <Route exact path='/' component={App} />
            <Route path='/blocks' component={Blocks} />
            <Route path='/generate' component={GenerateTransaction} />
        </Switch>
    </Router>,
    document.getElementById('root')
);