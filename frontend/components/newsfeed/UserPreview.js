import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Renders a single recommended friend for a user
 */
const UserPreview = ({ id, name, img, isOnline }) => (
  <div className="user user-sm userPreview">
    <div className="userImg" style={{backgroundImage: "url(" + img + ")"}}></div>
    <p>
      <Link to={ "/users/" + id }>
        { name }
      </Link>
    </p>
    { isOnline ? <div className="is-online"></div> : "" }
  </div>
);

export default UserPreview;
