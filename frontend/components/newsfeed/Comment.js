import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component to render an individual comment.
 *
 * TODO add user information
 */
const Comment = ({ text }) => (
  <div className="comment">
    { text }
  </div>
);

Comment.propTypes = {
  text: PropTypes.string,
};

export default Comment;
