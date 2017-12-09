import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/index';
import axios from 'axios';

/**
 * Renders the navbar at the top of the screen on all pages.
 *
 * TODO make this stateful depending on if the user is logged in or not.
 * Currently, it assumes that the user is not logged in.
 *
 * TODO logout
 */
class Nav extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Bind this to handle logout
    this.handleLogout = this.handleLogout.bind(this);
  }

  // Handle signout
  handleLogout() {
    // Sign the user out
    axios.get('/api/logout')
      .then(data => {
        if (!data.success) {
          // Purge the user's redux state
          this.props.onLogout();
        } else {
          /**
           * TODO handle error
           */
        }
      })
      .catch(err => {
        /**
         * TODO handle error
         */
      });
  }

  // Render the component
  render() {
    return (
      <nav className="navbar navbar-toggleable-md navbar-light">
        <button className="navbar-toggler navbar-toggler-right collapsed" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="icon-bar top-bar" />
          <span className="icon-bar middle-bar" />
          <span className="icon-bar bottom-bar" />
        </button>
        <Link to="/" className="navbar-brand">Facebook</Link>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {
            !this.props.isLoggedIn ?
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
                  <Link to={ "/users/" + this.props.username } className="nav-link">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <a onClick={ this.handleLogout } className="nav-link">
                    Logout
                  </a>
                </li>
              </ul>
            )
          }
        </div>
      </nav>
    );
  }
}

Nav.propTypes = {
  username: PropTypes.string,
  isLoggedIn: PropTypes.bool,
  onLogout: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    username: state.userState.username,
    isLoggedIn: state.userState.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(logout()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Nav);
