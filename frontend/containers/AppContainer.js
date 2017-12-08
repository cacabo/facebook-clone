// Import modules and frameworks
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

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
import LoggedInAuth from '../components/users/LoggedInAuth';

/**
 * Component to render the app
 *
 * isLoggedIn: prop pulled from Redux state denoting the current user session
 */
const AppContainer = ({ isLoggedIn }) => {
  // Handle the root path
  const homeRoute = (
    <Route exact path="/" render={() => (
      <LoggedInAuth toBeRendered={<Home />} />
    )} />
  );

  // Handle the user registration route
  const registerRoute = (
    <Route path="/register" render={() => (
      isLoggedIn ? (
        <Redirect to="/" />
      ) : (
        <Register />
      )
    )} />
  );

  // Handle user login route
  const loginRoute = (
    <Route path="/login" render={() => (
      isLoggedIn ? (
        <Redirect to="/" />
      ) : (
        <Login />
      )
    )} />
  );

  // Handle edit profile route
  const editProfileRoute = (
    <Route exact path="/users/edit" render={() => (
      <LoggedInAuth toBeRendered={<EditProfile />} />
    )} />
  );

  // Handle a user's profile route
  const userProfileRoute = (
    <Route exact path="/users/:username" component={Profile} />
  );

  // Handle new chat route
  const newChatRoute = (
    <Route exact path="/chats/new" render={() => (
      <LoggedInAuth toBeRendered={<NewChat />} />
    )} />
  );

  // Handle chat show route
  const chatRoute = (
    <Route exact path="/chats/:id" render={() => (
      <LoggedInAuth toBeRendered={<Chat />} />
    )} />
  );

  // Handle chat index route
  const chatsRoute = (
    <Route exact path="/chats" render={() => (
      <LoggedInAuth toBeRendered={<Chats />} />
    )} />
  );

  // Handle not found router
  const notFoundRoute = (
    <Route path="*" component={NotFound} />
  );

  // Actually render the component
  return(
    <div className="app-wrapper">
      <Router>
        <div>
          <Nav />
          <Switch>
            { homeRoute }
            { registerRoute }
            { loginRoute }
            { editProfileRoute }
            { userProfileRoute }
            { newChatRoute }
            { chatRoute }
            { chatsRoute }
            { notFoundRoute }
          </Switch>
        </div>
      </Router>
    </div>
  );
};

AppContainer.propTypes = {
  isLoggedIn: PropTypes.bool,
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.userState.isLoggedIn,
  };
};

const mapDispatchToProps = (/* dispatch */) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer);
