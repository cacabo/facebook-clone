import React from 'react';
import ChatPreview from './ChatPreview';
import uuid from 'uuid-v4';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { subscribeToInvitations } from './socketrouter';
import { subscribeToReloadChats } from './socketrouter';
import { joinRoom } from './socketrouter';
import { invite } from './socketrouter';

/**
 * Component to render all of a user's groupchats
 */
class Chats extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    this.state = {
      currentInvitation: '',
      chats: [],
      loaded: false,
      autoJoin: false,
    };

    this.handleInvite = this.handleInvite.bind(this);
    this.updateChatRoom = this.updateChatRoom.bind(this);
    this.getInvites = this.getInvites.bind(this);
    this.reloadChats = this.reloadChats.bind(this);
    this.checkIfChatExists = this.checkIfChatExists.bind(this);
  }

  // Listening for new invitations to join chats
  componentDidMount() {
    // Data has room, sender, and users in the room
    subscribeToInvitations(this.props.username, (data) => {
      const invitationData = JSON.parse(data);
      console.log("invited to join " + invitationData.roomToJoin);

      // If have not been invited yet
      if (!this.checkIfChatExists(invitationData.roomToJoin)) {
        this.setState({
          currentInvitation: invitationData,
          autoJoin: invitationData.autoJoin
        });

        if (this.state.autoJoin === true) {
          console.log("AUTO JOINING");
          this.updateChatRoom();
          joinRoom(this.state.currentInvitation.roomToJoin, () => {});
        }
      }
    });

    // Listens for when to reload chat list from children components
    subscribeToReloadChats((reload) => {
      if (reload) {
        this.reloadChats();
      }
    });

    // Render chats
    this.reloadChats();
  }

  // Handles approval of new invites
  handleInvite(event) {
    axios.get('/api/chat/' + this.state.currentInvitation.roomToJoin)
    .then(checkData => {
      // If success is true, user has invited already
      if (checkData.data.success === true) {
        // Creates new chat for 3 people when 1 join 2
        if (checkData.data.data.numUsers === 2) {
          const newRoomID = uuid();
          const chatTitle = checkData.data.data.chatTitle + " (Group)";

          // Creates and puts a new chat in the database
          axios.post('/api/chat/' + newRoomID + '/title/' + chatTitle + '/new')
          .then((chatData) => {
            if (chatData.data.success) {
              console.log("Successfully created chat object: " + chatTitle);
              invite(newRoomID, this.state.currentInvitation.roomToJoin, chatTitle, "everyone", this.props.username, true, () => {});
              this.setState({
                currentInvitation: newRoomID,
              });

              // Update the chat room
              this.updateChatRoom();
            } else {
              // There was an error creating a new message
              console.log(chatData.data.err);
            }
          })
          .catch(chatErr => {
            console.log(chatErr);
          });
        } else {
          joinRoom(this.state.currentInvitation.roomToJoin, () => {});
          this.updateChatRoom();
        }
      } else {
        console.log("Failed to get chat");
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  // Prevents joining room multiple times
  checkIfChatExists(roomToCheck) {
    var proceedWithConfirmation = false;
    for (var i = 0; i < this.state.chats.length; i++) {
      if (this.state.chats[i].room === roomToCheck) {
        proceedWithConfirmation = true;
      }
    }
    return proceedWithConfirmation;
  }

  // Creates a user chat relationship and updates exisitng chat user count
  updateChatRoom() {
    if (this.state.currentInvitation) {
      // Creates a new user chat realtionship
      if (this.state.currentInvitation.roomToJoin) {
        axios.post('/api/users/' + this.props.username + '/chats/' + this.state.currentInvitation.roomToJoin
          + '/newUserChatRelationship/' + this.state.currentInvitation.chatTitle)
          .then((chatData) => {
            if (chatData.data.success) {
              this.setState({
                currentInvitation: null,
              });

              // Reloads chats
              this.reloadChats();
            } else {
              // There was an error creating a new chat relationship
              console.log(chatData.data.err);
            }
          })
          .catch(chatErr => {
            console.log(chatErr);
          });
      }
    }

    // Deletes the invite from the table once user accepts it
    axios.post('/api/users/' + this.props.username + '/chats/' + this.state.currentInvitation.roomToJoin + '/deleteInvite')
    .then(checkData => {
      // If success is true, user has deleted invite already
      if (checkData.data.success === true) {
        console.log("Successefully deleted invite");
      } else {
        console.log("Failed to delete invite");
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  // Gets a list of invites pertaining to the current user
  getInvites() {
    axios.get('/api/users/' + this.props.username + '/invites')
    .then(checkData => {
      // If success is true, user has invited already
      if(checkData.data.success === true) {
        console.log(checkData.data.data);
        this.setState({
          /**
           * TODO setup state with list of invites
           */
        });
      } else {
        console.log("Failed to get invites");
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  // Gets all chats associated with this user
  reloadChats() {
    axios.get('/api/users/' + this.props.username + '/chats')
    .then(checkData => {
      // If success is true, user has invited already
      if (checkData.data.success === true) {
        this.setState({
          chats: checkData.data.data
        });

        console.log(this.state.chats);

        // Joins all of users chats - run this once when loading
        if (!this.state.loaded) {
          for (var i = 0; i < this.state.chats.length; i++) {
            const tempChat = this.state.chats[i];
            joinRoom(tempChat.room, () => {});
          }

          this.setState({
            loaded: true,
          });
        }
      } else {
        console.log("Failed to get chats");
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  // Helper method to render chats based on state
  renderChatPreviews() {
    return this.state.chats.map(chat => {
      return (
        <ChatPreview
          username={ chat.username }
          chatTitle={ chat.chatTitle }
          room={ chat.room }
          key={ uuid() }
        />
      );
    });
  }

  // Render the chats co mponent
  render() {
    // Return the component
    return (
      <div className="chat-container">
        <div className="chats">
          { this.renderChatPreviews() }
          <div className="pad-1">
            <Link to="/chats/new" className="btn btn-gray marg-top-05">
              New chat &nbsp; <i className="fa fa-plus" />
            </Link>

            <div className="space-1" />

            { this.state.currentInvitation.chatTitle && (
              <div className="alert alert-warning">
                <p className="bold marg-bot-05">
                  Invited to join
                </p>
                <p>
                  { this.state.currentInvitation.chatTitle }
                </p>
                <button className="btn btn-gray"
                  onClick={ this.handleInvite }>
                  Accept invite
                </button>
              </div>
            ) }
          </div>
        </div>
        <div className="chat">
          { this.props.children }
        </div>
      </div>
    );
  }
}

Chats.propTypes = {
  children: PropTypes.array,
  username: PropTypes.string,
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
)(Chats);
