import React from 'react';
import FriendRecommendation from './FriendRecommendation';

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
