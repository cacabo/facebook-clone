import React from 'react';
import Chats from './Chats';

/**
 * Component to render one of a user's group chats.
 */
const Chat = () => {
  return (
    <Chats>
      <div className="card">
        <h1>This is a single chat</h1>
        <p>
          This is a chat
        </p>
      </div>
    </Chats>
  );
};

export default Chat;
