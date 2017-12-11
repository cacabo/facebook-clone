import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Renders a single recommended friend for a user
 */
const UserPreview = ({ username, name, profilePicture, isOnline }) => (
  <div className="user user-sm userPreview">
    <div className="userImg" style={{backgroundImage: "url(" + profilePicture + ")"}} />
    <p>
      <Link to={ "/users/" + username }>
        { name }
      </Link>
    </p>
    { isOnline ? <div className="is-online" /> : "" }
  </div>
);

UserPreview.propTypes = {
  username: PropTypes.string,
  name: PropTypes.string,
  profilePicture: PropTypes.string,
  isOnline: PropTypes.bool,
};

export default UserPreview;
