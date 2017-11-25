import React from 'react';
import UserPreview from './UserPreview';
import uuid from 'uuid-v4';

/**
 * Component to render which of your friends are currently online.
 *
 * TODO remove dummy data
 * TODO have timestamps for when a user logged off? Show most recent number?
 */
class OnlineNow extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      onlineNow: [
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

  // Helper function to return which friends are online as based on state
  renderOnlineNow() {
    return this.state.onlineNow.map(rec => {
      return (
        <UserPreview
          name={ rec.name }
          id={ rec.id }
          img={ rec.img }
          isOnline={ true }
          key={ uuid() }
        />
      );
    });
  }

  // Function to render the component
  render() {
    return (
      <div className="card pad-bot-025">
        <strong className="marg-bot-05">
          Online now
        </strong>
        { this.renderOnlineNow() }
      </div>
    );
  }
}

export default OnlineNow;
