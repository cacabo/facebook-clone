import React from 'react';
import autosize from 'autosize';
import Chats from './Chats';

/**
 * Component to render one of a user's group chats.
 */
class Chat extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      message: "",
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

  // Helper function to render messags
  renderMessages() {
    /**
     * TODO
     */
    return "";
  }

  // Render the chat component
  render() {
    return (
      <Chats>
        <div className="messages">
          <h1>This is a single chat</h1>
          { this.renderMessages() }
          <p>
            This is a chat
          </p>
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
