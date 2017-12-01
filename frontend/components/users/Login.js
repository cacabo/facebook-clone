import React from 'react';
import Thin from '../shared/Thin';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Component to render a user's login form
 *
 * TODO check for valid email
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

    // Bind this
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

      /**
       * TODO make the request
       */
    }
  }

  // Render the component
  render() {
    return (
      <Thin>
        <div>
          {
            this.props.notice && (
              <div className="alert alert-warning alert-card card-shade">
                { this.props.notice }
              </div>
            )
          }
          <div className="card">
            <h3 className="bold marg-bot-1">
              Login
            </h3>
            {
              this.state.error ?
              <div className="alert alert-danger error">
                <p className="bold marg-bot-025">
                  There was an error:
                </p>
                <p className="marg-bot-0">
                  { this.state.error }
                </p>
              </div>
              : ""
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
                value="Create account"
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
};

export default Login;
