import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Component to render a preview of a group chat
 */
const ChatPreview = ({ username, chatTitle, room }) => {
  return (
    <Link className="chat-preview" to={ "/chats/" + room }>
      { chatTitle }
    </Link>
  );
};

ChatPreview.propTypes = {
  username: PropTypes.string,
  chatTitle: PropTypes.string,
  room: PropTypes.string,
};

export default ChatPreview;
