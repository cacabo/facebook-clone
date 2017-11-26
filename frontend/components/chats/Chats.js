import React from 'react';
import ChatPreview from './ChatPreview';
import uuid from 'uuid-v4';

/**
 * Component to render all of a user's groupchats
 *
 * TODO remove dummy data
 * TODO active group chat
 */
class Chats extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      chats: [
        { name: "Dope group chat" },
        { name: "Even better group chat" },
        { name: "The best group chat" }
      ],
    }
  }

  // Helper method to render chats based on state
  renderChatPreviews() {
    return this.state.chats.map(chat => {
      return (
        <ChatPreview name={ chat.name } key={ uuid() } />
      );
    });
  }

  // Render the chats component
  render() {
    return (
      <div className="chat-container">
        <div className="chats">
          { this.renderChatPreviews() }
        </div>
      </div>
    );
  }
};

export default Chats;
