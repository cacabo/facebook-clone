import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

/**
 * Renders the navbar at the top of the screen on all pages.
 *
 * TODO make this stateful depending on if the user is logged in or not.
 * Currently, it assumes that the user is not logged in.
 *
 * TODO logout
 */
const Nav = ({ username, isLoggedIn }) => {
  return (
    <nav className="navbar navbar-toggleable-md navbar-light">
      <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon" />
      </button>
      <Link to="/" className="navbar-brand">Facebook</Link>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        {
          !isLoggedIn ?
          (
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/chats" className="nav-link">
                  Chats
                </Link>
              </li>
              <li className="nav-item">
                <Link to={ "/users/" + username } className="nav-link">
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link to={ "/logout" } className="nav-link">
                  Logout
                </Link>
              </li>
            </ul>
          )
        }
      </div>
    </nav>
  );
};

Nav.propTypes = {
  username: PropTypes.string,
  isLoggedIn: PropTypes.bool,
};

const mapStateToProps = (state) => {
  return {
    username: state.userState.username,
    isLoggedIn: state.userState.isLoggedIn,
  };
};

const mapDispatchToProps = (/* dispatch */) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Nav);
