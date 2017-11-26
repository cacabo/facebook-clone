import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// Import components to render
import Home from '../components/newsfeed/Home';
import Profile from '../components/users/Profile';
import Login from '../components/users/Login';
import Register from '../components/users/Register';
import EditProfile from '../components/users/EditProfile';
import Chats from '../components/chats/Chats';
import Chat from '../components/chats/Chat';
import NewChat from '../components/chats/NewChat';
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
          <Route path='/users/:id/edit' component={EditProfile} />
          <Route path='/users/:id' component={Profile} />
          <Route path='/register' component={Register} />
          <Route path='/login' component={Login} />
          <Route path='/chats/new' component={NewChat} />
          <Route path='/chats/:id' component={Chat} />
          <Route path='/chats' component={Chats} />
          <Route path='*' component={NotFound} />
        </Switch>
      </div>
    </Router>
  </div>
);

export default AppContainer;
