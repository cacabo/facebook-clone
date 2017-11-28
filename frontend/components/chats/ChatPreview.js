import React from 'react';
import { Link } from 'react-router-dom';

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

export default ChatPreview;
