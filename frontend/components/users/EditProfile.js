import React from 'react';
import Thin from '../shared/Thin';
import { Link } from 'react-router-dom';
import autosize from 'autosize';
import PropTypes from 'prop-types';
import Loading from '../shared/Loading';
import axios from 'axios';

/**
 * Component to render a form to edit a user's profile\
 *
 * TODO better error checking for images
 * TODO non-resizable text areas
 */
class EditProfile extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      pending: true,
      error: "",
      username: "",
      firstName: "",
      lastName: "",
      affiliation: "",
      bio: "",
      interests: "",
      profilePicture: "",
      coverPhoto: "",
    };

    // Bind this to functions
    this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
    this.handleChangeLastName = this.handleChangeLastName.bind(this);
    this.handleChangeAffiliation = this.handleChangeAffiliation.bind(this);
    this.handleChangeBio = this.handleChangeBio.bind(this);
    this.handleChangeInterests = this.handleChangeInterests.bind(this);
    this.handleChangeProfilePicture = this.handleChangeProfilePicture.bind(this);
    this.handleChangeCoverPhoto = this.handleChangeCoverPhoto.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Once the component mounts
  componentDidMount() {
    // Autosize textareas when the component mounts
    autosize(document.querySelectorAll('textarea'));

    // Get the current session
    axios.get("/api/session")
      .then(data => {
        if (data.data.success) {
          axios.get("/api/users/" + data.data.username)
            .then(userData => {
              this.setState({
                ...userData.data.data,
                pending: false,
              });
            })
            .catch(() => {
              /**
               * TODO
               */
            });
        } else {
          /**
           * TODO
           */
        }
      })
      .catch(() => {
        /**
         * TODO
         */
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

  // Handle a change to the affiliation state
  handleChangeAffiliation(event) {
    this.setState({
      affiliation: event.target.value,
    });
  }

  // Handle a change to the bio state
  handleChangeBio(event) {
    this.setState({
      bio: event.target.value,
    });
  }

  // Handle a change to the interests state
  handleChangeInterests(event) {
    this.setState({
      interests: event.target.value,
    });
  }

  // Handle a change to the profile picture state
  handleChangeProfilePicture(event) {
    this.setState({
      profilePicture: event.target.value,
    });
  }

  // Handle a change to the cover photo state
  handleChangeCoverPhoto(event) {
    this.setState({
      coverPhoto: event.target.value,
    });
  }

  // Handle submitting the form
  handleSubmit(event) {
    // Prevent the default submission
    event.preventDefault();

    // Regular expression for validating URL's
    /**
     * TODO test that this works
     */
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

    // Error checking
    if (!this.state.username) {
      this.setState({
        error: "Username must be populated.",
      });
    } else if (!this.state.firstName || !this.state.lastName) {
      this.setState({
        error: "First and last name must be populated",
      });
    } else if (this.state.affiliation && this.state.affiliation.length > 140) {
      this.setState({
        error: "Affiliation length capped at 140 characters",
      });
    } else if (this.state.bio && this.state.bio.length > 280) {
      this.setState({
        error: "Bio length capped at 280 characters.",
      });
    } else if (this.state.profilePicture) {
      const validProfilePicture = urlRegex.test(this.state.profilePicture);
      console.log("Valid profile picture?", validProfilePicture);
    }
  }

  // Render the component
  render() {
    return(
      <Thin>
        {
          this.state.pending ? (<Loading />) : (
            <div className="card">
              <h3 className="marg-bot-1 bold">
                Edit profile information
              </h3>
              <form className="line-form" onSubmit={ this.handleSubmit }>
                <label>
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  className="form-control marg-bot-1"
                  value={ this.state.username }
                  readOnly
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
                  Affiliation
                </label>
                <input
                  type="text"
                  name="affiliation"
                  className="form-control marg-bot-1"
                  value={ this.state.affiliation }
                  onChange={ this.handleChangeAffiliation }
                />

                <label>
                  Bio
                </label>
                <textarea
                  type="text"
                  name="bio"
                  className="form-control marg-bot-1"
                  rows="1"
                  value={ this.state.bio }
                  onChange={ this.handleChangeBio }
                />

                <label>
                  Interests
                </label>
                <textarea
                  type="text"
                  name="interests"
                  className="form-control marg-bot-1"
                  rows="1"
                  value={ this.state.interests }
                  onChange={ this.handleChangeInterests }
                />

                <label>
                  Profile picture
                </label>
                <input
                  type="url"
                  name="profilePicture"
                  className="form-control marg-bot-1"
                  value={ this.state.profilePicture }
                  onChange={ this.handleChangeProfilePicture }
                />

                <label>
                  Cover photo
                </label>
                <input
                  type="url"
                  name="coverPhoto"
                  className="form-control marg-bot-1"
                  value={ this.state.coverPhoto }
                  onChange={ this.handleChangeCoverPhoto }
                />

                <input
                  type="submit"
                  className={
                    this.state.username &&
                    this.state.firstName &&
                    this.state.lastName ?
                    "btn btn-primary full-width cursor" :
                    "btn btn-primary full-width disabled"
                  }
                  value="Update information"
                />
              </form>
              <p className="marg-top-1 marg-bot-0">
                Nevermind? <Link to={ "/users/" + this.state.username } className="inline">Back to your profile.</Link>
              </p>
            </div>
          )
        }
      </Thin>
    );
  }
}

EditProfile.propTypes = {
  match: PropTypes.object,
};

export default EditProfile;
