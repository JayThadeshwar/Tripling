import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/home.js';
import ContainerPage from './components/plan.js';

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path='/plan' component={ContainerPage} />
                </Switch>
            </Router>
        );
    }
}

export default App;