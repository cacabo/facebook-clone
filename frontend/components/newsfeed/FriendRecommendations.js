import React from 'react';
import FriendRecommendation from './FriendRecommendation';

/**
 * Component to list a user's recommended friends. This is rendered on the
 * newsfeed to the left of the statuses.
 */
const FriendRecommendations = () => (
  <div className="card pad-bot-025">
    <strong>
      Find new friends
    </strong>
    <FriendRecommendation name="Terry Jo" id="153" />
    <FriendRecommendation name="Victor Chien" id="12" />
    <FriendRecommendation name="Cameron Cabo" id="8" />
  </div>
);

export default FriendRecommendations;
