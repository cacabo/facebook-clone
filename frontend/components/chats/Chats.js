import React from 'react';
import ChatPreview from './ChatPreview';
import uuid from 'uuid-v4';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { subscribeToInvitations } from './socketrouter';
import { joinRoom } from './socketrouter';

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
      /**
       * TODO store room names here after making a query to the database
       */

       currentInvitation: '',
       chats: [
       {
        name: "Dope group chat",
        id: 1,
      },
      {
        name: "Even better group chat",
        id: 12,
      },
      {
        name: "The best group chat",
        id: 4,
      }
      ],
    };

    this.handleAcceptInvite = this.handleAcceptInvite.bind(this);
    this.getInvites = this.getInvites.bind(this);
    this.getChats = this.getChats.bind(this);
  }

  componentDidMount() {
    // Listening for new invitations to join chats
    // Data has room, sender, and users in the room
    subscribeToInvitations((data) => {
      const invitationData = JSON.parse(data);
      console.log("invited to join " + invitationData.roomToJoin);
      this.setState({
        currentInvitation: invitationData.roomToJoin
      })
      console.log("received invitation!!!");
    });

    // Render chats
    // This should be called whenever we receive a new socket room invitation so we can reload
    // Only call this when accept an invite.
    this.getChats();
  }

  // Accepts an invitation when invitation received
  handleAcceptInvite(event) {
    if (this.state.currentInvitation) {
      console.log("joined room " + this.state.currentInvitation);
      joinRoom(this.state.currentInvitation, [], function(success) {})
    } 

    // Deletes the invite from the table once user accepts it
    axios.post('/api/users/' + this.props.username + '/chats/' + 1 + '/deleteInvite')
    .then(checkData => {
        // If success is true, user has deleted invite already
        if(checkData.data.success === true) {
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
  /*
  * TODO display this list in a table somewhere
  */
  getInvites(event) {
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
  getChats() {
    axios.get('/api/users/' + this.props.username + '/chats')
    .then(checkData => {
        // If success is true, user has invited already
        if(checkData.data.success === true) {
          this.setState({
            chats: checkData.data.data
          });
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
        name={ chat.name }
        id={ chat.id }
        key={ uuid() }
        />
        );
});
}

  // Render the chats co mponent
  render() {
    return (
      <div className="chat-container">
      <div className="chats">
      { this.renderChatPreviews() }
      <div className="pad-1 pad-top-0">
      <Link to="/chats/new" className="btn btn-gray marg-top-05">
      New chat &nbsp; <i className="fa fa-plus" />
      </Link>
      </div>
      </div>
      <div className="chat">
      { this.props.children }
      </div>
      <button className="btn btn-gray"
      onClick={ this.handleAcceptInvite }> 
      Accept 
      </button>
      <div> invited to join { this.state.currentInvitation } </div>
      </div>
      );
  }
}

Chats.propTypes = {
  children: PropTypes.array,
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