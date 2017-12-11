import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Component to render an individual comment.
 *
 * TODO add user information
 */
const Comment = ({ text, userData }) => (
  <div className="comment">
    <div
      className="img"
      style={{ backgroundImage: `url(${userData.profilePicture})`}}
    />
    <div className="text">
      <Link className="name" to={ "/users/" + userData.username }>
        { userData.name }
      </Link>
      <p className="content">
        { text }
      </p>
    </div>
  </div>
);

Comment.propTypes = {
  text: PropTypes.string,
  userData: PropTypes.object,
};

export default Comment;
