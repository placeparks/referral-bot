import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/signup" component={Signup} />
                <Route path="/login" component={Login} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/" component={Login} />
            </Switch>
        </Router>
    );
}

export default App;