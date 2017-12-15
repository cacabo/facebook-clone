import React from 'react';
import autosize from 'autosize';
import Chats from './Chats';
import uuid from 'uuid-v4';
import axios from 'axios';
import { subscribeToMessages } from './socketrouter';
import { sendMessage } from './socketrouter';
import { invite } from './socketrouter';
import { connect } from 'react-redux';
import { leaveRoom } from './socketrouter';
import { reloadChatList } from './socketrouter';
import PropTypes from 'prop-types';

/**
 * Component to render one of a user's group chats.
 */
class Chat extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state of the application
    this.state = {
      message: "",
      currentInvite: "",
      currentUser: this.props.username,
      messages: [],
      users: [],
      addMemberActive: false,
    };

    // Bind this to helper methods
    this.handleChangeMessage = this.handleChangeMessage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInvite = this.handleInvite.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.reloadMessages = this.reloadMessages.bind(this);
    this.handleChangeInvite = this.handleChangeInvite.bind(this);
    this.toggleAddMember = this.toggleAddMember.bind(this);
  }

  // Prepares component to listen to new messages
  componentDidMount() {
    autosize(document.querySelectorAll('textarea'));

    // Listens for new messages received
    subscribeToMessages((message) => this.setState(() => {
      const messageInfo = JSON.parse(message);

      if (messageInfo.room === this.props.match.params.id) {
        const oldMessage = this.state.messages;
        oldMessage.push(messageInfo);
        return { messages: oldMessage };
      }

      // If nothing was returned yet
      return {};
    }));

    // Load current messages
    this.reloadMessages();
  }

  // Reload the messages when switched to a different chat
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.reloadMessages();
    }
  }

  // Handles change to message field
  handleChangeMessage(event) {
    this.setState({
      message: event.target.value,
    });
  }

  // Handles change to invite field
  handleChangeInvite(event) {
    this.setState({
      currentInvite: event.target.value,
    });
  }

  // Handle toggling stuff
  toggleAddMember() {
    this.setState({
      addMemberActive: !this.state.addMemberActive,
    });
  }

  // Does socket message sending
  handleSubmit(event) {
    // Prevent the default event
    event.preventDefault();
    const messageToSend = this.state.message;

    // Creates a new message in the database
    axios.post('/api/users/' + this.state.currentUser + '/chats/' + this.props.match.params.id + '/newMessage/' + messageToSend)
      .then((messageData) => {
        if (messageData.data.success) {
          // Construct the message params
          const messageParams = {
            username: this.state.currentUser,
            body: messageToSend,
            room: this.props.match.params.id
          };

          // Sends message over the socket
          sendMessage(JSON.stringify(messageParams), (success) => {
            if (success) {
              this.setState(() => {
                const oldMessage = this.state.messages;
                oldMessage.push(messageParams);
                return {
                  messages: oldMessage,
                  message: ""
                };
              });
            }
          });
        } else {
          // There was an error creating a new message
          console.log(messageData.data.err);
        }
      })
      .catch(messageErr => {
        console.log(messageErr);
      });
  }

  // Reloads all of the messages
  reloadMessages() {
    axios.get('/api/users/' + this.state.currentUser + '/chats/' + this.props.match.params.id + '/messages')
      .then(checkData => {
        // If success is true, user has retrieved messages
        if(checkData.data.success === true) {
          this.setState({
            messages: checkData.data.data
          });
          console.log(this.state.messages);
        } else {
          console.log("Failed to get messages");
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Sends an invite to another user
  handleInvite(event) {
    event.preventDefault();

    // Creates a new invite object and puts in table
    if (this.state.currentInvite) {
      axios.post('/api/users/' + this.state.currentUser + '/chats/' + this.props.match.params.id + '/invite/' + this.props.match.params.chatTitle)
        .then((inviteData) => {
          if (inviteData.data.success) {
            // TODO will need to check if person you are inviting is a friend first
            // Parameters: chat id, user we want to invite, current user, cb
            // Does the invite over socket
            invite(this.props.match.params.id, this.state.currentInvite + 'inviteRoom', this.props.match.params.chatTitle, this.state.currentInvite, this.state.currentUser, false, () => {
              this.setState({
                currentInvite: "",
                addMemberActive: false,
              });
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
  }

  // Handles removing user from chat room
  handleLeave() {
    axios.post('/api/users/' + this.state.currentUser + '/chats/' + this.props.match.params.id + '/delete')
    .then((deleteData) => {
      if (deleteData.data.success) {
        reloadChatList(() => {});

        // Leave room on socket
        leaveRoom(this.props.match.params.id, () => {
          console.log("Successfully removed user from room");
        });
      } else {
        // There was an error creating a new message
        console.log(deleteData.data.err);
      }
    })
    .catch(chatErr => {
      console.log(chatErr);
    });
  }

  /**
   * Helper function to render messages
   */
  renderMessages() {
    return this.state.messages.map(m => {
      // If the message belongs to the logged in user
      if (this.state.currentUser === m.username) {
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
            placeholder="Type a message..."
            className="form-control"
            type="text"
          />
          <button className="btn btn-gray marg-right-05"
            onClick={ this.toggleAddMember }>
            <i className="fa fa-plus" aria-hidden />
          </button>
          <button className="btn btn-gray marg-right-05"
            onClick={ this.handleLeave }>
            Leave Chat
          </button>
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

        { this.state.addMemberActive && (
          <form className="message-form marg-top-1" onSubmit={ this.handleInvite }>
            <input
              name="invite"
              value={ this.state.currentInvite }
              onChange={ this.handleChangeInvite }
              className="form-control"
              type="text"
              placeholder="Invite a new user by username to the chat..."
            />
            <input
              type="submit"
              className={
                this.state.currentInvite ?
                "btn btn-gray" :
                "btn btn-gray disabled"
              }
              value="Invite"
            />
          </form>
        ) }
      </Chats>
    );
  }
}

Chat.propTypes = {
  username: PropTypes.string,
  match: PropTypes.obj,
};

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
