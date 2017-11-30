import React from 'react';
import StatusForm from './StatusForm';
import Status from './Status';
import FriendRecommendations from './FriendRecommendations';
import OnlineNow from './OnlineNow';
import uuid from 'uuid-v4';

/**
 * Component to render a user's newsfeed.
 *
 * On smaller screens, exclusively the newsfeed shows up. On larger screens,
 * however, a user sees 1. recommended friends (to the left), 2. their newsfeed,
 * 3. a list of friends currently online.
 */
class Home extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    /**
     * TODO REPLACE DUMMY DATA
     */
    this.state = {
      statuses: [
        {
          name: "Terry Jo",
          status: "I'm a fool loool",
          userImg: "https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/15585239_1133593586737791_6146771975815537560_o.jpg?oh=1f5bfe8e714b99b823263e2db7fa3329&oe=5A88DA92",
          id: "1",
        },
        {
          name: "Terry Jo",
          status: "Look at this dog",
          userImg: "https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/15585239_1133593586737791_6146771975815537560_o.jpg?oh=1f5bfe8e714b99b823263e2db7fa3329&oe=5A88DA92",
          id: "1",
          image: "https://static.boredpanda.com/blog/wp-content/uploads/2016/01/bear-dogs-310__605.jpg",
        },
      ],
    };
  }

  /**
   * Helper function to render statuses on the homepage
   * This renders the statuses contained in the state of the component
   * NOTE map is a funcitonal iterator method
   */
  renderStatuses() {
    return this.state.statuses.map((status) => {
      return (
        <Status
          name={ status.name }
          status={ status.status }
          userImg={ status.userImg }
          image={ status.image }
          id={ status.id }
          key={ uuid() }
        />
      );
    });
  }

  // Render the component
  render() {
    return (
      <div className="container-fluid marg-top-1">
        <div className="row">
          <div className="col-lg-3 hidden-md-down">
            <FriendRecommendations />
          </div>
          <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-0 col-xl-5">
            <StatusForm placeholder="What's on your mind?" />
            { this.renderStatuses() }
            <div className="space-4" />
          </div>
          <div className="col-md-3 col-xl-4 hidden-md-down">
            <OnlineNow />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
