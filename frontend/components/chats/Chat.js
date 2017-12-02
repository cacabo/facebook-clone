import React from 'react';
import autosize from 'autosize';
import Chats from './Chats';
import uuid from 'uuid-v4';
import SocketIOClient from 'socket.io-client';
import { subscribeToMessages } from './socketrouter';
import { sendMessage } from './socketrouter';

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
      messages: [],
    }

    this.handleChangeMessage = this.handleChangeMessage.bind(this);
    this.submit = this.handleSubmit.bind(this);
  }

  // Autosize the text area to fit the text that's pasted into it
  componentDidMount() {
    autosize(document.querySelectorAll('textarea'));

    //listens for new messages received
    subscribeToMessages((message) => this.setState((prevState, props) => {
        console.log("received message: " + message)
        var messageInfo = JSON.parse(message);

        if (messageInfo.room == this.props.match.params.id) {
          var oldMessage = this.state.messages;
          oldMessage.push(messageInfo);
          return {messages: oldMessage}
        }
    }));
  }

  // Helper method to handle a change to state
  handleChangeMessage(event) {
    this.setState({
      message: event.target.value,
    });
  }

  //do socket sending here. Append this to own message list. 
  handleSubmit(event) {
    var messageToSend = this.state.message; //have to do this.state not this alone

    console.log("Current Room from send: " + this.props.match.params.id);
    console.log("Chat ID: " + this.props.match.params.id);

    var messageParams = {
      user: this.state.user,
      body: messageToSend,
      createdAt: Date.now,
      room: this.props.match.params.id
    };

    sendMessage(this.props.match.params.id, JSON.stringify(messageParams), (success) => { 
      if (success) {
        this.setState((prevState, props) => {
          var oldMessage = this.state.messages;
          oldMessage.push(messageParams);
          return {
            messages: oldMessage,
            message: ""
          }
        });
      } else {
        //message unsent
      }
    });
    event.preventDefault();
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
        <form className="message-form" onSubmit={ this.handleSubmit.bind(this) }>
          <textarea
            name="message"
            value={ this.state.message }
            onChange={ this.handleChangeMessage.bind(this) }
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
