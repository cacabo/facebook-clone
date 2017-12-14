import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/index';
import axios from 'axios';

/**
 * Renders the navbar at the top of the screen on all pages.
 */
class Nav extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      search: "",
    };

    // Bind this to handle logout
    this.handleLogout = this.handleLogout.bind(this);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
  }

  // Handle change search
  handleChangeSearch(event) {
    // Store the event value
    const value = event.target.value;

    // Set the search state
    this.setState({
      search: value,
    });

    // Perform logic
    if (value) {
      // Search for updates
      axios.get("/api/users/search/" + value)
        .then(data => {
          if (data.data.success) {
            this.setState({
              users: data.data.data,
            });
          } else {
            this.setState({
              users: [],
            });
          }
        })
        .catch(() => {
          this.setState({
            users: [],
          });
        });
    } else {
      this.setState({
        users: [],
      });
    }
  }

  // Handle submit search
  handleSubmitSearch(event) {
    // Prevent the default action
    event.preventDefault();

    // Ensure value is populated
    if (this.state.search) {
      // Find the url
      const url = "/users/search/" + this.state.search;

      // Update the location
      window.location = url;
    }
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
        console.log(err);
      });
  }

  // Render suggestions based on search
  renderSuggestions() {
    return this.state.users.map(user => (
      <a
        className="suggestion"
        href={ "/users/" + user.username }
        key={ user.username }
      >
        <div
          className="img"
          style={{ backgroundImage: `url(${user.profilePicture})` }}
        />
        <p>
          { user.name }
        </p>
      </a>
    ));
  }

  // Render the component
  render() {
    return (
      <nav className="navbar navbar-toggleable-md navbar-light fixed-top">
        { this.state.redirect && (<Redirect to={ this.state.redirect } />)}
        <button className="navbar-toggler navbar-toggler-right collapsed" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="icon-bar top-bar" />
          <span className="icon-bar middle-bar" />
          <span className="icon-bar bottom-bar" />
        </button>
        <Link to="/" className="navbar-brand">Facebook</Link>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {
            this.props.isLoggedIn && (
              <form className="form-inline" onSubmit={ this.handleSubmitSearch }>
                <input
                  className="form-control mr-sm-2"
                  type="text"
                  placeholder="Search for users"
                  value={ this.state.search }
                  onChange={ this.handleChangeSearch }
                />
                {
                  (this.state.users && this.state.users.length) ? (
                    <div className="suggestions">
                      { this.renderSuggestions() }
                    </div>
                  ) : (null)
                }
                <button className="btn btn-primary my-2 my-sm-0" type="submit">Search</button>
              </form>
            )
          }
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
