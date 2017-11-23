import React from 'react';

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

export default Comment;
