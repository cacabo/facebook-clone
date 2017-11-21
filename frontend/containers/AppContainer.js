import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// Import components to render
import Home from '../components/Home';
import Profile from '../components/users/Profile';
import Login from '../components/users/Login';
import Register from '../components/users/Register';
import Chats from '../components/chats/Chats';
import Chat from '../components/chats/Chat';
import NotFound from '../components/NotFound';
import Nav from '../components/shared/Nav';

// Render the app
const AppContainer = () => (
  <div className="app-wrapper">
    <Router>
      <div>
        <Nav />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/users/:id' component={Profile} />
          <Route path='/register' component={Register} />
          <Route path='/login' component={Login} />
          <Route path='/chats' component={Chats} />
          <Route path='/chats/:id' component={Chat} />
          <Route path='*' component={NotFound} />
        </Switch>
      </div>
    </Router>
  </div>
);

export default AppContainer;
