import React from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

/**
 * Component to redirect a user to log in if they are not already logged in
 */
const LoggedInAuth = ({ isLoggedIn, toBeRendered }) => (
  isLoggedIn ? (
    toBeRendered
  ) : (
    <Redirect to="/login" />
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
