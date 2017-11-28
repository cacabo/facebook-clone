import React from 'react';
import autosize from 'autosize';
import Chats from './Chats';
import uuid from 'uuid-v4';

/**
 * Component to render one of a user's group chats.
 *
 * TODO replace dummy data
 * TODO pass down ID of the current user
 */
class Chat extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      currentUser: "12",
      messages: [
        {
          inx: "0",
          user: "12",
          body: "This is the first message",
          createdAt: 1511894393650,
        },
        {
          inx: "1",
          user: "13",
          body: "This is the second message",
          createdAt: 1511894551346,
        },
        {
          inx: "1",
          user: "12",
          body: "This is a longer message than the other messages and should take up more space",
          createdAt: 1511894607965,
        },
      ],
    }
    this.handleChangeMessage = this.handleChangeMessage.bind(this);
  }

  // Autosize the text area to fit the text that's pasted into it
  componentDidMount() {
    autosize(document.querySelectorAll('textarea'));
  }

  // Helper method to handle a change to state
  handleChangeMessage(event) {
    this.setState({
      message: event.target.value,
    });
  }

  /**
   * Helper function to render messages
   *
   * TODO find user profile picture and render that next to the message
   */
  renderMessages() {
    return this.state.messages.map(m => {
      // If the message belongs to the logged in user
      if (this.state.currentUser === m.user) {
        return (
          <div className="message-wrapper current-user" key={ uuid() }>
            <div className="message">
              { m.body }
            </div>
          </div>
        );
      } else {
        return (
          <div className="message-wrapper" key={ uuid() }>
            <div className="message">
              { m.body }
            </div>
          </div>
        );
      }
    });
  }

  // Render the chat component
  render() {
    return (
      <Chats>
        <div className="messages">
          { this.renderMessages() }
        </div>
        <form className="message-form">
          <textarea
            name="message"
            value={ this.state.message }
            onChange={ this.handleChangeMessage }
            className="form-control card-shade"
            type="text"
          >
          </textarea>
          <input
            type="submit"
            className={
              this.state.message ?
              "btn btn-gray card-shade" :
              "btn btn-gray card-shade disabled"
            }
            value="Send"
          />
        </form>
      </Chats>
    );
  }
};

export default Chat;
