import React from 'react';
import UserPreview from './UserPreview';

/**
 * Component to list a user's recommended friends. This is rendered on the
 * newsfeed to the left of the statuses.
 *
 * TODO remove dummy data
 */
const FriendRecommendations = () => (
  <div className="card pad-bot-025">
    <strong className="marg-bot-05">
      Find new friends
    </strong>
    <UserPreview
      name="Terry Jo"
      id="153"
      img="https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/15585239_1133593586737791_6146771975815537560_o.jpg?oh=1f5bfe8e714b99b823263e2db7fa3329&oe=5A88DA92"
    />
    <UserPreview
      name="Victor Chien"
      id="12"
    />
    <UserPreview
      name="Cameron Cabo"
      id="8"
    />
  </div>
);

export default FriendRecommendations;
