import React from 'react';
import Thin from '../shared/Thin';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { login } from '../../actions/index';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

/**
 * Component to render a form to register a user
 *
 * Errors are rendered based on the state of the component below the title but
 * above the registraiton form.
 *
 * Registration fields: username, firstName, lastName, password, confirmPassword
 */
class Register extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      error: "",
    };

    // Binding "this" to each state helper method
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
    this.handleChangeLastName = this.handleChangeLastName.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeConfirmPassword = this.handleChangeConfirmPassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Handle a change to the username state
  handleChangeUsername(event) {
    this.setState({
      username: event.target.value,
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

  // Handle when the status form is submitted
  handleSubmit(event) {
    // Prevent the default submit action
    event.preventDefault();

    // Keep track of if the registration is valid or not
    let isValid = true;

    // Ensure all fields are not empty
    if (!this.state.username ||
        !this.state.firstName ||
        !this.state.lastName ||
        !this.state.password ||
        !this.state.confirmPassword) {
      this.setState({
        error: "All fields must be populated."
      });
      isValid = false;
    }

    // Ensure the password match
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        error: "Password and confirmation must match."
      });
      isValid = false;
    }

    // Ensure none of the parameters are too long or too short
    if (isValid) {
      if (this.state.username.length < 2) {
        this.setState({
          error: "Username must be at least two characters long."
        });
        isValid = false;
      } else if (this.state.username.length > 30) {
        this.setState({
          error: "Username must be less than or equal to 30 characters long."
        });
        isValid = false;
      } else if (this.state.firstName.length > 40) {
        this.setState({
          error: "First name must be less than or equal to 40 characters long."
        });
        isValid = false;
      } else if (this.state.lastName.length > 40) {
        this.setState({
          error: "Last name must be less than or equal to 40 characters long."
        });
        isValid = false;
      } else if (this.state.password.length < 6) {
        this.setState({
          error: "Password must be at least 6 characters long."
        });
        isValid = false;
      }
    }

    if (isValid) {
      // Ensure the username is properly formatted: no whitespace and only
      // letters, numbers, periods, or underscores
      const usernameRegex = /^[a-z0-9.\-_]+$/;
      const validUsername = usernameRegex.test(this.state.username);

      // Throw an error if the username is invalid
      if (!validUsername) {
        this.setState({
          error: "Username can only contain letters, numbers, periods, hyphens, and underscores."
        });
        isValid = false;
      }
    }

    // If no error has been found to this point
    if (isValid) {
      // Remove any existing error
      this.setState({
        error: "",
      });

      // Check if the username is already taken
      // Store the data from the form
      const data = {
        username: this.state.username,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword,
      };

      // Send a post request to create the user
      axios.post("/api/users/new", data)
      .then((postRes) => {
        if (postRes.data.success) {
          // Find the username in the response
          const username = postRes.data.username;

          // Dispatch the login event to Redux
          this.props.onRegister(username, null);
        } else {
          this.setState({
            error: postRes.data.error,
          });
        }
      })
      .catch((err) => {
        this.setState({
          error: "There was an issue creating your account: " + err,
        });
      });
    }
  }

  // Render the component
  render() {
    return (
      <Thin>
        <div className="card">
          <h3 className="marg-bot-1 bold">
            Register
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
              type="text"
              name="username"
              className="form-control marg-bot-1"
              value={ this.state.username }
              onChange={ this.handleChangeUsername }
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
                  this.state.username &&
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
            Already have an account? <Link to="/login" className="inline">Login here.</Link>
          </p>
        </div>
      </Thin>
    );
  }
}

Register.propTypes = {
  onRegister: PropTypes.func,
};

const mapStateToProps = (/* state */) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    onRegister: (username, profilePicture) => dispatch(login(username, profilePicture)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register);
