import React from 'react';
import UserPreview from './UserPreview';
import uuid from 'uuid-v4';

/**
 * Component to list a user's recommended friends. This is rendered on the
 * newsfeed to the left of the statuses.
 *
 * TODO remove dummy data
 */
class FriendRecommendations extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      friendRecommendations: [
        {
          name: "Terry Jo",
          id: "153",
          img: "https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/15585239_1133593586737791_6146771975815537560_o.jpg?oh=1f5bfe8e714b99b823263e2db7fa3329&oe=5A88DA92",
        },
        {
          name: "Victor Chien",
          id: "12",
        },
        {
          name: "Cameron Cabo",
          id: "21",
        }
      ],
    };
  }

  // Helper method to return the friend recommendations based on the state
  renderFriendRecs() {
    return this.state.friendRecommendations.map(rec => {
      return (
        <UserPreview
          name={ rec.name }
          id={ rec.id }
          img={ rec.img }
          key={ uuid() }
        />
      );
    });
  }

  // Render the component
  render () {
    return (
      <div className="card pad-bot-025">
        <strong className="marg-bot-05">
          Find new friends
        </strong>
        { this.renderFriendRecs() }
      </div>
    );
  }
}

export default FriendRecommendations;
