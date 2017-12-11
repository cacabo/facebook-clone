import React from 'react';
import autosize from 'autosize';
import Chats from './Chats';
import uuid from 'uuid-v4';
import axios from 'axios';
import SocketIOClient from 'socket.io-client';
import { subscribeToMessages } from './socketrouter';
import { sendMessage } from './socketrouter';
import { invite } from './socketrouter';
import { connect } from 'react-redux';
import { joinRoom } from './socketrouter';

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

    // Set the state of the application
    this.state = {
      message: "",
      currentUser: this.props.username,
      messages: [],
      users: [],
    } 

    console.log("Current User " + this.props.username);

    // Everyone is part of a specialized room for receving invitations
    joinRoom(this.state.currentUser + 'inviteRoom', function(success) {})

    // Bind this to helper methods
    this.handleChangeMessage = this.handleChangeMessage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInvite = this.handleInvite.bind(this);
  }

  // Autosize the text area to fit the text that's pasted into it
  componentDidMount() {
    autosize(document.querySelectorAll('textarea')); 

    // Listens for new messages received
    subscribeToMessages((message) => this.setState((prevState, props) => {
        console.log("received message: " + message)
        const messageInfo = JSON.parse(message);

        if (messageInfo.room == this.props.match.params.id) {
          let oldMessage = this.state.messages;
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

  // Does socket sending here. Append this to own message list. 
  handleSubmit(event) {
    event.preventDefault();
    const messageToSend = this.state.message; //have to do this.state not this alone

    console.log("Current Room from send: " + this.props.match.params.id);
    console.log("Chat ID: " + this.props.match.params.id);

    const messageParams = {
      user: this.state.currentUser,
      body: messageToSend,
      createdAt: Date.now,
      room: this.props.match.params.id
    };

    sendMessage(JSON.stringify(messageParams), (success) => {
      if (success) {
        this.setState((prevState, props) => {
          let oldMessage = this.state.messages;
          oldMessage.push(messageParams);
          return {
            messages: oldMessage,
            message: ""
          }
        });
      } else {
        /**
         * TODO handle unsent message error
         */
      }
    });
  }

  handleInvite(event) {
    // Temporary recevier of invitations
    const personToInvite = 'victor';

    axios.post('/api/users/' + this.state.currentUser + '/chats/' + this.props.match.params.id + '/invite/' + personToInvite)
      .then((inviteData) => {
        if (inviteData.data.success) {
          // TODO will need to check if person you are inviting is a friend first
          // Parameters: chat id, user we want to invite, current user, cb
          invite(this.props.match.params.id, personToInvite, this.state.currentUser, () => {
              console.log("Invite successful");
          });
        } else {
          // There was an error creating a new invite
          console.log(inviteData.data.err);
        }
      })
      .catch(inviteErr => {
          console.log(inviteErr);
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
      }

      // Otherwise
      return (
        <div className="message-wrapper" key={ uuid() }>
          <div className="message">
            { m.body }
          </div>
        </div>
      );
    });
  }

  // Render the chat component
  render() {
    return (
      <Chats>
        <div className="messages">
          { this.renderMessages() }
        </div>
        <form className="message-form" onSubmit={ this.handleSubmit }>
          <textarea
            name="message"
            value={ this.state.message }
            onChange={ this.handleChangeMessage }
            className="form-control"
            type="text"
          />
          <input
            type="submit"
            className={
              this.state.message ?
              "btn btn-gray" :
              "btn btn-gray disabled"
            }
            value="Send"
          />
        </form>
        <button className="btn btn-gray"
            onClick={ this.handleInvite } >
            Invite
        </button>
      </Chats>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.userState.username,
  };
};

const mapDispatchToProps = (/* dispatch */) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat);
