import React from 'react';
import Chats from './Chats';
import autosize from 'autosize';
const uuid = require('uuid-v4');
import axios from 'axios';
import { connect } from 'react-redux';
import { joinRoom } from './socketrouter';

/**
 * Component to render one of a user's group chats.
 */

/*
* TODO Put in database and then simply reload it 
*/

class NewChat extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      chatTitle: "",
      members: "",
    };
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeMembers = this.handleChangeMembers.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Autosize the text area to fit the text that's pasted into it
  componentDidMount() {
    autosize(document.querySelectorAll('textarea'));
  }

  // Handle a change to the members state
  handleChangeMembers(event) {
    this.setState({
      members: event.target.value,
    });
  }

  // Handle a change to the title state
  handleChangeTitle(event) {
    this.setState({
      chatTitle: event.target.value,
    });
  }

  // Handle when the new chat form is submitted
  handleSubmit(event) {
    console.log("New chat for submitted " + this.state.chatTitle + " " + this.state.members);
    event.preventDefault();

    /*
    * TODO Use async to send invites to everyone
    */

    const roomID = uuid();

    // Creates and puts a new user chat relationship in the database
    axios.post('/api/users/' + this.props.username + '/chats/' + roomID +'/newUserChatRelationship/' + this.state.chatTitle)
    .then((chatData) => {
      if (chatData.data.success) {
        console.log("Successfully created chat: " + this.state.chatTitle);
        joinRoom(roomID, [], () => {});
      } else {
          // There was an error creating a new message
          console.log(chatData.data.err);
        }
      })
    .catch(chatErr => {
      console.log(chatErr);
    });

    // Creates and puts a new chat in the database
    axios.post('/api/chat/' + roomID + '/title/' + this.state.chatTitle + '/new')
    .then((chatData) => {
      if (chatData.data.success) {
        console.log("Successfully created chat object: " + this.state.chatTitle);
      } else {
          // There was an error creating a new message
          console.log(chatData.data.err);
        }
      })
    .catch(chatErr => {
      console.log(chatErr);
    });
  }

  // Render the component
  render() {
    return (
      <Chats>
      <form className="message-form" onSubmit={ this.handleSubmit }>
      <textarea
      name="members"
      value={ this.state.chatTitle }
      onChange={ this.handleChangeTitle }
      rows="1"
      className="form-control"
      />

      <textarea
      name="members"
      value={ this.state.members }
      onChange={ this.handleChangeMembers }
      rows="1"
      className="form-control"
      />
      <input
      type="submit"
      className={
        this.state.members ?
        "btn btn-gray" :
        "btn btn-gray disabled"
      }
      value="Create chat"
      />
      </form>
      <div className="space-1"/>
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
  )(NewChat);