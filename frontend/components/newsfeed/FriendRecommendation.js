import React from 'react';
import { Link } from 'react-router-dom';

const FriendRecommendation = ({ id, name }) => (
  <div className="user recommendation">
    <div className="userImg"></div>
    <p>
      <Link to={ "/users/" + id }>
        { name }
      </Link>
    </p>
  </div>
);

export default FriendRecommendation;
