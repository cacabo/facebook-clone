import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Component to render a preview of a group chat
 */
const ChatPreview = ({ name, id }) => {
  return (
    <Link className="chat-preview" to={ "/chats/" + id }>
      { name }
    </Link>
  );
};

ChatPreview.propTypes = {
  name: PropTypes.string,
  id: PropTypes.number,
};

export default ChatPreview;
