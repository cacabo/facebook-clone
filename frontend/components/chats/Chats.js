import React from 'react';
import ChatPreview from './ChatPreview';
import uuid from 'uuid-v4';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
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
      //store room names here after making a query to the database
      //temporary storage. Should be an array
      currentInvitation: 'testRoom',
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
  }

  componentDidMount() {
    subscribeToInvitations((data) => {
      const invitationData = JSON.parse(data);
      console.log("invited to join " + invitationData.roomToJoin);
      this.setState({
        currentInvitation: invitationData.roomToJoin
      })
      console.log("received invitation!!!");
    });
  }

  handleAcceptInvite(event) {
    console.log("joined room " + this.state.currentInvitation);
    joinRoom(this.state.currentInvitation, function(success) {
    })
    event.preventDefault();
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

  // Render the chats component
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
        <button onClick={ this.handleAcceptInvite }>Accept</button>
      </div>
    );
  }
}

Chats.propTypes = {
  children: PropTypes.array,
};

export default Chats;
