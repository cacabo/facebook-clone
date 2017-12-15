import React from 'react';
import Thin from '../shared/Thin';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { login } from '../../actions/index';
import { connect } from 'react-redux';
import axios from 'axios';
import ErrorMessage from '../shared/ErrorMessage';

/**
 * Component to render a user's login form
 */
class Login extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      error: "",
    };

    // Bind this to helper methods
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Helper method to handle email state change
  handleChangeUsername(event) {
    this.setState({
      username: event.target.value,
    });
  }

  // Helper method to handle password state change
  handleChangePassword(event) {
    this.setState({
      password: event.target.value,
    });
  }

  // Handle when the login form is submitted
  handleSubmit(event) {
    // Prevent the default request
    event.preventDefault();

    // Keep track of if the inputs to the form are valid
    let isValid = true;

    // Ensure inputs are not empty
    if (!this.state.username || !this.state.password) {
      this.setState({
        error: "Username and password must be populated."
      });
      isValid = false;
    } else {
      // Ensure the username is properly formatted: no whitespace and only
      // letters, numbers, periods, or underscores
      const usernameRegex = /^[a-zA-Z0-9.\-_]+$/;
      const validUsername = usernameRegex.test(this.state.username);

      // Throw an error if the username is invalid
      if (!validUsername) {
        this.setState({
          error: "Username can only contain letters, numbers, periods, hyphens, and underscores."
        });
        isValid = false;
      }
    }

    // If no error was found with the inputs
    if (isValid) {
      // Remove any existing error
      this.setState({
        error: "",
      });

      // Check if the user exists/password is right
      axios.post("/api/users/sessions/new", {
        username: this.state.username,
        password: this.state.password,
      })
        .then(res => {
          // If there is an error in the response
          if (res.data.error) {
            this.setState({
              error: res.data.error,
            });
          } else {
            // Find the username and profile picture from the response
            const username = res.data.data.username;
            const profilePicture = res.data.data.profilePicture;
            const name = res.data.data.name;

            // Dispatch the login event to Redux
            this.props.onLogin(username, profilePicture, name);


            /*
            * TODO call client socket to send username to server side
            */

          }
        })
        .catch(err => {
          this.setState({
            error: err
          });
        });
    }
  }

  // Render the component
  render() {
    return (
      <Thin>
        <div>
          {
            this.props.notice && (
              <div className="alert alert-warning alert-card">
                { this.props.notice }
              </div>
            )
          }
          <div className="card">
            <h3 className="bold marg-bot-1">
              Login
            </h3>
            {
              this.state.error && (<ErrorMessage text={ this.state.error } />)
            }
            <form className="line-form" onSubmit={ this.handleSubmit }>
              <label>
                Username
              </label>
              <input
                value={ this.state.username }
                onChange={ this.handleChangeUsername }
                type="text"
                name="username"
                className="form-control marg-bot-1"
                autoFocus="true"
              />

              <label>
                Password
              </label>
              <input
                value={ this.state.password }
                onChange={ this.handleChangePassword }
                type="password"
                name="password"
                className="form-control marg-bot-1"
              />
              <input
                type="submit"
                className={
                  (this.state.username && this.state.password) ?
                  "btn btn-primary full-width cursor" :
                  "btn btn-primary full-width disabled"
                }
                value="Login"
              />
            </form>
            <p className="marg-top-1 marg-bot-0">
              Don't have an account? <Link to="/register" className="inline">create one here.</Link>
            </p>
          </div>
        </div>
      </Thin>
    );
  }
}

Login.propTypes = {
  notice: PropTypes.string,
  onLogin: PropTypes.func,
};

const mapStateToProps = (/* state */) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (username, profilePicture, name) => dispatch(login(username, profilePicture, name)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
