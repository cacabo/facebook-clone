import React from 'react';
import UserPreview from './UserPreview';
import Loading from '../shared/Loading';
import axios from 'axios';
import ErrorMessage from '../shared/ErrorMessage';

/**
 * Component to list a user's recommended friends. This is rendered on the
 * newsfeed to the left of the statuses.
 */
class FriendRecommendations extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      friendRecommendations: [],
      pending: true,
      error: "",
    };
  }

  // Pull recommendations from the database
  componentDidMount() {
    axios.get("/api/recommendations")
      .then(res => {
        if (res.data.success) {
          this.setState({
            pending: false,
            friendRecommendations: res.data.data,
          });
        } else {
          // Render the error
          this.setState({
            error: res.data.error,
            pending: false,
          });
        }
      })
      .catch(err => {
        // Render the error
        this.setState({
          error: err,
          pending: false,
        });
      });
  }

  // Helper method to return the friend recommendations based on the state
  renderFriendRecs() {
    return this.state.friendRecommendations.map(rec => {
      return (
        <UserPreview
          name={ rec.userData.name }
          username={ rec.userData.username }
          profilePicture={ rec.userData.profilePicture }
          key={ rec.username }
        />
      );
    });
  }

  // Render the component
  render() {
    return (
      <div className="card pad-bot-025">
        <strong className="marg-bot-05">
          Find new friends
        </strong>
        {
          this.state.error && <ErrorMessage text={ this.state.error } />
        }
        { this.state.pending ? <Loading /> : this.renderFriendRecs() }
      </div>
    );
  }
}

export default FriendRecommendations;
