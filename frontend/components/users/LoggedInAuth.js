import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Login from './Login';

/**
 * Component to redirect a user to log in if they are not already logged in
 */
const LoggedInAuth = ({ isLoggedIn, toBeRendered }) => (
  isLoggedIn ? (
    toBeRendered
  ) : (
    <Login notice="You must be logged in to view this page." />
  )
);

LoggedInAuth.propTypes = {
  isLoggedIn: PropTypes.bool,
  toBeRendered: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.isLoggedIn,
  };
};

const mapDispatchToProps = (/* dispatch */) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoggedInAuth);
