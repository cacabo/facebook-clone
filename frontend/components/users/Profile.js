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
import UserPreview from '../newsfeed/UserPreview';
import moment from 'moment';
import ErrorMessage from '../shared/ErrorMessage';

/**
 * Render's a user's profile
 *
 * Cover photo and profile picture at the top
 * Information about the user (bio, interests, friend count, etc.) to left
 * List of posts and ability to write on their wall to the right / middle
 */
class Profile extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      statusesError: "",
      userError: "",
      friendsError: "",
      friendError: "",
      name: "",
      username: "",
      profilePicture: "",
      coverPhoto: "",
      birthday: "",
      bio: "",
      interests: "",
      statuses: [],
      friends: [],
      isFriend: false,
      profilePending: true,
      statusesPending: true,
      friendsPending: true,
      isFriendPending: true,
      addFriendPending: false,
      location: "STATUSES",
    };

    // Bind this to helper methods
    this.renderStatuses = this.renderStatuses.bind(this);
    this.renderFriends = this.renderFriends.bind(this);
    this.newStatusCallback = this.newStatusCallback.bind(this);
    this.handleClickFriendsToggle = this.handleClickFriendsToggle.bind(this);
    this.handleClickStatusesToggle = this.handleClickStatusesToggle.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.handleAddFriend = this.handleAddFriend.bind(this);
    this.renderBirthday = this.renderBirthday.bind(this);
    this.renderInterests = this.renderInterests.bind(this);
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

          // Get the user's statuses
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

          // If the current user and profile's user are different
          if (this.state.username !== this.props.username) {
            // Get the status of the user's friendship
            axios.get(`/api/users/${this.state.username}/friends/${this.props.username}`)
              .then(res => {
                if (res.data.success) {
                  // If the two users are friends
                  this.setState({
                    isFriend: true,
                    isFriendPending: false,
                  });
                } else {
                  this.setState({
                    isFriend: false,
                    isFriendPending: false,
                  });
                }
              })
              .catch(err => {
                this.setState({
                  isFriendPending: false,
                  friendsError: err,
                });
              });
          }
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

  // Handle if the user goes to a new profile
  componentDidUpdate() {
    if (this.state.username && (this.props.match.params.username !== this.state.username)) {
      // Refresh the page
      window.location = window.location.href;
    }
  }

  // Handle click to statuses toggle
  handleClickStatusesToggle() {
    this.setState({
      location: "STATUSES",
    });
  }

  // Handle click to friends toggle
  handleClickFriendsToggle() {
    this.setState({
      location: "FRIENDS",
    });

    // If friends have yet to load
    if (this.state.friendsPending) {
      // Make a request to get a user's friends
      axios.get(`/api/users/${this.state.username}/friends`)
        .then(res => {
          // Process the returned data
          if (res.data.success) {
            // If it successfullty retrieved the list of friends
            this.setState({
              friendsPending: false,
              friends: res.data.data,
            });
          } else {
            // If there was an error with the request
            this.setState({
              friendsPending: false,
              friendsError: res.data.error,
            });
          }
        })
        .catch(err => {
          // If we catch an error
          this.setState({
            friendsPending: false,
            friendsError: err,
          });
        });
    }
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
        status.isNew = true;

        // Update state to contain the new status
        this.setState({
          statuses: [
            status,
            ...this.state.statuses
          ],
        });
      })
      .catch(err => {
        // If there was an error pulling the new status
        this.setState({
          statusError: err,
        });
      });
  }

  // Helper method to handle adding a friend
  handleAddFriend() {
    if (this.props.username !== this.state.username && !this.state.isFriend) {
      this.setState({
        addFriendPending: true,
      });

      // Make a request to add the friend
      axios.get(`/api/users/${this.state.username}/friends/new`)
        .then(res => {
          if (res.data.success) {
            // If creating the friendship was successful
            this.setState({
              addFriendPending: false,
              isFriend: true,
              friendError: "",
            });
          } else {
            // If the friendship was not successful
            this.setState({
              addFriendPending: false,
              isFriend: false,
              friendError: res.data.error,
            });
          }
        })
        .catch(err => {
          this.setState({
            addFriendPending: false,
            isFriend: false,
            friendError: err,
          });
        });
    }
  }

  // Helper function to render the friends
  renderFriends() {
    if (this.state.friends.length === 0) {
      if (this.props.username === this.state.username) {
        // If the current user is the profile's user
        return (
          <p className="marg-bot-0">
            You don't have any friends yet! Add some.
          </p>
        );
      }

      // If the users are different
      return (
        <p className="marg-bot-0">
          <span className="capitalize">{ this.state.name }</span> doesn't have any friends yet!
        </p>
      );
    }

    // If there is a list of freinds, render them
    return this.state.friends.map(friend => (
      <UserPreview
        name={ friend.userData.name }
        username={ friend.userData.username }
        profilePicture={ friend.userData.profilePicture }
        key={ friend.userData.username }
      />
    ));
  }

  // Helper function to render the statuses
  renderStatuses() {
    if (this.state.statuses) {
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
          isNew={ status.isNew ? status.isNew : false }
          key={ status.id }
          id={ status.id }
        />
      ));
    }

    // If there are no statuses
    return null;
  }

  // Helper function to render profile buttons
  renderButton() {
    // If this is not the user's own profile
    if (this.props.username !== this.state.username) {
      if (this.state.isFriendPending) {
        // If checking for the friendship status is pending
        return(
          <div className="btn btn-primary disabled btn-sm marg-bot-1">
            &nbsp; &nbsp; &nbsp; &nbsp;
            <i className="fa fa-circle-o-notch fa-spin fa-fw" />
            &nbsp; &nbsp; &nbsp; &nbsp;
          </div>
        );
      } else if (!this.state.isFriendPending && !this.state.isFriend) {
        if (this.state.addFriendPending) {
          // If we are in the process of adding the friend
          return(
            <div className="btn btn-primary btn-sm marg-bot-1 disabled">
              Add friend <i className="fa fa-circle-o-notch fa-spin fa-fw" />
            </div>
          );
        }

        // If the current user is not friends with the profile's user
        return(
          <div
            className="btn btn-primary btn-sm marg-bot-1 cursor"
            onClick={ this.handleAddFriend }>
            Add friend
          </div>
        );
      }
      return (
        // If the current user is friends with the profile's user
        <div className="btn btn-primary btn-sm marg-bot-1">
          Friends <i className="fa fa-check" aria-hidden="true" />
        </div>
      );
    }

    // If the current user is the profile's user
    return (
      <Link to="/users/edit" className="btn btn-primary btn-sm">
        Edit profile
      </Link>
    );
  }

  // Render the birthday
  renderBirthday() {
    const m = moment(this.state.birthday);
    return m.format("MMMM Do, YYYY");
  }

  // Render a user's interests
  renderInterests() {
    // Find the comma separated interests
    const interests = this.state.interests.split(', ');

    // Return the formatted interests
    const interestsObj = interests.map(interest => (
      <span className="interest" key={ interest }>
        { interest }
      </span>
    ));

    // Return the array wrapped in a div
    return (
      <div className="interests">
        { interestsObj }
      </div>
    );
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
      <div className="profile" key={this.props.location.pathname}>
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
                  <div>
                    <p className="bold marg-bot-025">
                      Learn more about { firstName }
                    </p>
                    { this.state.bio && (
                      <p>
                        { this.state.bio }
                      </p>
                    ) }
                  </div>
                  { this.state.affiliation && (
                    <div className="about-section">
                      <p className="bold marg-bot-025">
                        Affiliation 🏢
                      </p>
                      <Link to={ `/users/affiliations/${this.state.affiliation}` } className="affiliation">
                        { this.state.affiliation }
                      </Link>
                    </div>
                  ) }
                  { this.state.interests && (
                    <div className="about-section">
                      <p className="bold marg-bot-025">
                        Interests 💭
                      </p>
                      { this.renderInterests() }
                    </div>
                  ) }
                  <div className="about-section">
                    <p className="bold marg-bot-025">
                      Birthday 🎉
                    </p>
                    <p>
                      { this.renderBirthday() }
                    </p>
                  </div>
                  {
                    this.state.friendError && (<ErrorMessage text={ this.state.friendError } />)
                  }
                  <div className="space-1" />
                  { this.renderButton() }
                  <div className="space-2" />
                </div>
                <div className="col-12 col-md-8 col-lg-7">
                  <div className="toggle-wrapper">
                    <a
                      className={ this.state.location === "STATUSES" ? "toggle active" : "toggle" }
                      onClick={ this.handleClickStatusesToggle }
                    >
                      Statuses
                    </a>
                    <a
                      className={ this.state.location === "FRIENDS" ? "toggle active" : "toggle" }
                      onClick={ this.handleClickFriendsToggle}
                    >
                      Friends
                    </a>
                  </div>
                  {
                    this.state.location === "STATUSES" ? (
                      <div className="status-wrapper">
                        <StatusForm
                          placeholder={ `Write on ${ firstName }\'s wall...` }
                          receiver={ this.state.username }
                          callback={ this.newStatusCallback }
                        />
                        {
                          this.state.statusesError && (<ErrorMessage text={ this.state.statusesError } />)
                        }
                        { !this.state.statusesPending ? (this.renderStatuses()) : (<Loading />) }
                        { !this.state.statusesPending && (
                          <div className="card">
                            <p className="marg-bot-0">
                              There are no more statuses to show for <span className="capitalize">{ this.state.name }</span>.
                            </p>
                          </div>
                        ) }
                      </div>
                    ) : (
                      <div className="card">
                        <h3 className="marg-bot-1 bold">
                          Listing all friends
                        </h3>
                        {
                          this.state.friendsError && (<ErrorMessage text={ this.state.friendsError } />)
                        }
                        { !this.state.friendsPending ? (this.renderFriends()) : (<Loading />)}
                      </div>
                    )
                  }
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
  location: PropTypes.object,
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
