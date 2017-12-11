import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';

/**
 * Component to render an individual comment.
 *
 * TODO add user information
 */
const Comment = ({ text, userData, createdAt }) => {
  // Find the date from the timestamp
  const d = new Date(createdAt);
  const timestamp = moment(d).fromNow(true);

  // Render the comment
  return (
    <div className="comment">
      <div
        className="img"
        style={{ backgroundImage: `url(${userData.profilePicture})`}}
      />
      <div className="text">
        <p className="content">
          <Link className="name" to={ "/users/" + userData.username }>
            { userData.name }
          </Link>
          { text }
        </p>
      </div>
      <p className="timestamp">
        { timestamp }
      </p>
    </div>
  );
};

Comment.propTypes = {
  text: PropTypes.string,
  userData: PropTypes.object,
  createdAt: PropTypes.string,
};

export default Comment;
