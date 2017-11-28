import React from 'react';
import Thin from '../shared/Thin';
import { Link } from 'react-router-dom';

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
      email: "",
      password: "",
    }

    // Bind this
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  // Helper method to handle email state change
  handleChangeEmail(event) {
    this.setState({
      email: event.target.value,
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
    /**
     * TODO
     */
    event.preventDefault();
  }

  // Render the component
  render() {
    return (
      <Thin>
        <div className="card">
          <h3 className="bold marg-bot-1">
            Login
          </h3>
          <form className="line-form" onSubmit={ this.handleSubmit }>
            <label>
              Email
            </label>
            <input
              value={ this.state.email }
              onChange={ this.handleChangeEmail }
              type="email"
              name="email"
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
                (this.state.email && this.state.password) ?
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
      </Thin>
    );
  }
};

export default Login;
