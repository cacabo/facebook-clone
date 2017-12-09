import React from 'react';
import StatusForm from '../newsfeed/StatusForm';
import Status from '../newsfeed/Status';
import axios from 'axios';
import PropTypes from 'prop-types';
import Loading from '../shared/Loading';
import uuid from 'uuid-v4';

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
 */
class Profile extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      error: "",
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
        console.log(data.data.data);

        // Update the state
        this.setState({
          ...data.data.data,
          profilePending: false,
        });

        // Get the users statuses
        axios.get('/api/users/' + this.props.match.params.username + '/statuses')
          .then(statuses => {
            this.setState({
              statuses: statuses.data.data,
              statusesPending: false,
            });
          })
          .catch(err => {
            this.setState({
              error: err,
            });
          });
      })
      .catch(() => {
        this.setState({
          error: "User with the specified username not found",
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
        key={ uuid() }
      />
    ));
  }

  // Render the component
  render() {
    if (this.state.error) {
      // TODO
      console.log(this.state.error);
    }
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
                    Learn more
                  </strong>
                  <p>
                    { this.state.bio }
                  </p>
                  <strong>
                    Interests
                  </strong>
                  <p>
                    { this.state.interests }
                  </p>
                  <ul className="tags">
                    <li>NETS 212</li>
                    <li>Scalable cloud computing</li>
                    <li>Computer science</li>
                  </ul>
                </div>
                <div className="col-12 col-md-8 col-lg-7">
                  <StatusForm
                    placeholder="Write on this user's wall"
                    receiver={ this.state.username }
                    callback={ this.newStatusCallback }
                  />
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
};

export default Profile;
