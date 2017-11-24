import React from 'react';
import Thin from '../shared/Thin';
import { Link } from 'react-router-dom';

/**
 * Component to render a form to register a user
 */
class Register extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    };

    // Binding "this" to each state helper method
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
    this.handleChangeLastName = this.handleChangeLastName.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeConfirmPassword = this.handleChangeConfirmPassword.bind(this);
  }

  // Handle a change to the email state
  handleChangeEmail(event) {
    this.setState({
      email: event.target.value,
    });
  }

  // Handle a change to the first name state
  handleChangeFirstName(event) {
    this.setState({
      firstName: event.target.value,
    });
  }

  // Handle a change to the last name state
  handleChangeLastName(event) {
    this.setState({
      lastName: event.target.value,
    });
  }

  // Handle a change to the password state
  handleChangePassword(event) {
    this.setState({
      password: event.target.value,
    });
  }

  // Handle a change to the confirm password state
  handleChangeConfirmPassword(event) {
    this.setState({
      confirmPassword: event.target.value,
    });
  }

  // Render the component
  render() {
    return (
      <Thin>
        <div className="card">
          <h3 className="marg-bot-1 bold">
            Register
          </h3>
          <form className="line-form">
            <label>
              Email
            </label>
            <input
              type="email"
              name="email"
              className="form-control marg-bot-1"
              value={ this.state.email }
              onChange={ this.handleChangeEmail }
              autoFocus="true"
            />

            <div className="row">
              <div className="col-6">
                <label>
                  First name
                </label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control marg-bot-1"
                  value={ this.state.firstName }
                  onChange={ this.handleChangeFirstName }
                />
              </div>
              <div className="col-6">
                <label>
                  Last name
                </label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control marg-bot-1"
                  value={ this.state.lastName }
                  onChange={ this.handleChangeLastName }
                />
              </div>
            </div>

            <label>
              Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control marg-bot-1"
              value={ this.state.password }
              onChange={ this.handleChangePassword }
            />

            <label>
              Confirm password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control marg-bot-1"
              value={ this.state.confirmPassword }
              onChange={ this.handleChangeConfirmPassword }
            />

            <input
              type="submit"
              className={
                (
                  this.state.email &&
                  this.state.firstName &&
                  this.state.lastName &&
                  this.state.password &&
                  this.state.confirmPassword
                ) ?
                "btn btn-primary full-width cursor" :
                "btn btn-primary full-width disabled"
              }
              value="Create account"
            />
          </form>
          <p className="marg-top-1 marg-bot-0">
            Already have an account? <Link to="/login" className="inline">login here.</Link>
          </p>
        </div>
      </Thin>
    );
  }
};

export default Register;
