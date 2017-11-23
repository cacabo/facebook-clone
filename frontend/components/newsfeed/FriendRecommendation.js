import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Renders a single recommended friend for a user
 */
const FriendRecommendation = ({ id, name, img }) => (
  <div className="user user-sm recommendation">
    <div className="userImg" style={{backgroundImage: "url(" + img + ")"}}></div>
    <p>
      <Link to={ "/users/" + id }>
        { name }
      </Link>
    </p>
  </div>
);

export default FriendRecommendation;
