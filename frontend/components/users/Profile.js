import React from 'react';
import StatusForm from '../newsfeed/StatusForm';
import Status from '../newsfeed/Status';
import axios from 'axios';
import PropTypes from 'prop-types';
import Loading from '../shared/Loading';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import NotFound from '../NotFound';
import Login from '../users/Login';

/**
 * Render's a user's profile
 *
 * Cover photo and profile picture at the top
 * Information about the user (bio, interests, friend count, etc.) to left
 * List of posts and ability to write on their wall to the right / middle
 *
 * TODO handle errors
 * TODO pull user information
 * TODO render user statuses
 * TODO handle posts on user's wall
 * TODO have different errors (statuses, user not found, post error, etc)
 * TODO count num posts
 * TODO count num friends
 * TODO handle loading data visualization
 * TODO handle change between user show pages
 */
class Profile extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      statusesError: "",
      userError: "",
      name: "",
      username: "",
      profilePicture: "",
      coverPhoto: "",
      bio: "",
      interests: "",
      statuses: [],
      profilePending: true,
      statusesPending: true,
    };

    // Bind this to helper methods
    this.renderStatuses = this.renderStatuses.bind(this);
    this.newStatusCallback = this.newStatusCallback.bind(this);
  }

  // Set the state upon load
  componentDidMount() {
    // Get the user information
    axios.get('/api/users/' + this.props.match.params.username)
      .then(data => {
        if (data.data.success) {
          // Update the state
          this.setState({
            ...data.data.data,
            profilePending: false,
          });

          // Get the users statuses
          axios.get('/api/users/' + this.props.match.params.username + '/statuses')
            .then(statuses => {
              if (statuses.data.success) {
                this.setState({
                  statuses: statuses.data.data,
                  statusesPending: false,
                });
              } else {
                this.setState({
                  statusesErr: statuses.data.error,
                  statusesPending: false,
                });
              }
            })
            .catch(err => {
              this.setState({
                statusesPending: false,
                statusesError: err,
              });
            });
        } else {
          this.setState({
            userError: "User with specified username not found. Check the URL and try again.",
            profilePending: false,
          });
        }
      })
      .catch(() => {
        this.setState({
          userError: "There was an error querying the database. Check the URL and try again.",
          profilePending: false,
        });
      });
  }

  // Helper method to render a newly created status
  newStatusCallback(data) {
    // Get the object
    const status = data.data;

    // Get the status information
    axios.get("/api/users/" + status.user)
      .then(userData => {
        // Update the status user data and receiver data
        const userObj = userData.data.data;
        status.userData = userObj;
        status.receiverData = {
          name: this.state.name,
          username: this.state.username,
        };

        // Update state to contain the new status
        this.setState({
          statuses: [
            status,
            ...this.state.statuses
          ],
        });
      })
      .catch(err => {
        /**
         * TODO
         */
        console.log(err);
      });
  }

  // Helper function to render the statuses
  renderStatuses() {
    return this.state.statuses.map(status => (
      <Status
        content={ status.content }
        createdAt={ status.createdAt }
        likesCount={ status.likesCount }
        commentsCount={ status.commentsCount }
        type={ status.type }
        image={ status.image }
        user={ status.user }
        userData={ status.userData }
        receiverData={ status.receiverData }
        receiver={ status.receiver }
        key={ status.id }
        id={ status.id }
      />
    ));
  }

  // Render the component
  render() {
    // Render login if the user is not logged in
    if (!this.props.username) {
      return (
        <Login notice="User must be logged in to view profile." />
      );
    }

    // Ensure that the user is found
    if (this.state.userError) {
      return (
        <NotFound
          title="User not found"
          text={ this.state.userError }
        />
      );
    }

    // Find the user's first name
    let firstName = this.state.name.split(" ")[0];
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

    // Otherwise, the user is found or is in the process of begin found
    return (
      <div className="profile">
        <div
          className="cover-photo"
          style={{ backgroundImage: `url(${this.state.coverPhoto})` }}
        />
        <div className="menu">
          <h3>{ this.state.name }</h3>
        </div>

        <div className="container-fluid">
          <div className="row">
          <div className="col-12 col-lg-10 offset-lg-1">
              <div
                className="profile-picture"
                style={{ backgroundImage: `url(${this.state.profilePicture})` }}
              />

              <div className="row">
                <div className="col-12 col-md-4 about">
                  <strong>
                    Learn more about { firstName }
                  </strong>
                  <p>
                    { this.state.bio }
                  </p>
                  <strong>
                    Affiliations
                  </strong>
                  <p>
                    { this.state.affiliation }
                  </p>
                  <strong>
                    Interests
                  </strong>
                  <p>
                    { this.state.interests }
                  </p>
                  {
                    (this.props.username === this.state.username) && (
                      <Link to="/users/edit" className="btn btn-primary btn-sm">
                        Edit profile
                      </Link>
                    )
                  }
                </div>
                <div className="col-12 col-md-8 col-lg-7">
                  <StatusForm
                    placeholder={ `Write on ${ firstName }\'s wall...` }
                    receiver={ this.state.username }
                    callback={ this.newStatusCallback }
                  />
                  {
                    this.state.statusesError && (
                      <div className="alert alert-danger error">
                        <p className="bold marg-bot-025">
                          There was an error:
                        </p>
                        <p className="marg-bot-0">
                          { this.state.statusesError }
                        </p>
                      </div>
                    )
                  }
                  { !this.state.statusesPending ? (this.renderStatuses()) : (<Loading />) }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  match: PropTypes.object,
  username: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    username: state.userState.username,
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
