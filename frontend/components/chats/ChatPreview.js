import React from 'react';

/**
 * Component to render a preview of a group chat
 */
const ChatPreview = ({ name }) => {
  return (
    <div className="chat-preview">
      { name }
    </div>
  );
};

export default ChatPreview;
