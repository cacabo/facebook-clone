import React from 'react';
import StatusForm from '../newsfeed/StatusForm';
import Status from '../newsfeed/Status';
import axios from 'axios';
import PropTypes from 'prop-types';

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
 */
class Profile extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      firstName: "",
      lastName: "",
      profilePicture: "",
      coverPhoto: "",
      bio: "",
      interests: "",
      statuses: null,
      profilePending: true,
      statusesPending: true,
    };
  }

  // Set the state upon load
  componentDidMount() {
    // Get the user information
    axios.get('/api/users/' + this.props.match.params.username)
      .then(data => {
        this.setState({
          ...data.data.data,
          profilePending: false,
        });
      })
      .catch(() => {
        this.setState({
          error: "User with the specified username not found",
          profilePending: false,
        });
      });

    // Get the users statuses
    axios.get('/api/users/' + this.props.match.params.username + '/statuses')
      .then(data => {
        console.log(data);
        // TODO
      })
      .catch(err => {
        this.setState({
          error: err,
        });
      });
  }

  // Render the component
  render() {
    if (this.state.error) {
      console.log(this.state.error);
    }
    return (
      <div className="profile">
        <div className="cover-photo" />
        <div className="menu">
          <h3>{ this.state.firstName + " " + this.state.lastName }</h3>
        </div>

        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-lg-10 offset-lg-1">
              <div className="profile-picture" />

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
                  { this.state.interests }
                  <ul className="tags">
                    <li>NETS 212</li>
                    <li>Scalable cloud computing</li>
                    <li>Computer science</li>
                  </ul>
                  <p>
                    <strong>Friends:</strong> 212
                  </p>
                  <p>
                    <strong>Posts:</strong> 41
                  </p>
                </div>
                <div className="col-12 col-md-8 col-lg-7">
                  <StatusForm placeholder="Write on this user's wall" />

                  <Status
                    name="Terry Jo"
                    status="I'm a fool loool"
                    userImg="https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/15585239_1133593586737791_6146771975815537560_o.jpg?oh=1f5bfe8e714b99b823263e2db7fa3329&oe=5A88DA92"
                    id="1"
                  />

                  <Status
                    name="Terry Jo"
                    status="Look at this dog"
                    userImg="https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/15585239_1133593586737791_6146771975815537560_o.jpg?oh=1f5bfe8e714b99b823263e2db7fa3329&oe=5A88DA92"
                    id="1"
                    image="http://www.insidedogsworld.com/wp-content/uploads/2016/03/Dog-Pictures.jpg"
                  />
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
