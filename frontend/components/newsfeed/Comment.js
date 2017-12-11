import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component to render an individual comment.
 *
 * TODO add user information
 */
const Comment = ({ content, userData }) => (
  <div className="comment">
    <div
      className="img"
      style={{ backgroundImage: `url(${userData.profilePicture})`}}
    />
    <p className="name">
      { userData.name }
    </p>
    <p className="content">
      { content }
    </p>
  </div>
);

Comment.propTypes = {
  content: PropTypes.string,
  userData: PropTypes.object,
};

export default Comment;
