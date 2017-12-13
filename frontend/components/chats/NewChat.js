import React from 'react';
import Chats from './Chats';
import autosize from 'autosize';
import { connect } from 'react-redux';

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
      members: "",
    };
    this.handleChangeMembers = this.handleChangeMembers.bind(this);
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

  // Handle when the new chat form is submitted
  handleSubmit(event) {
    console.log("New chat for submitted");
    event.preventDefault();
    // Creates a new chat in the database

    const roomID = uuid();
    axios.post('/api/users/' + this.props.username + '/chats/' + roomID +'/newUserChatRelationship')
      .then((chatData) => {
        if (chatData.data.success) {
          const chatParams = {
            username: this.state.currentUser,
            title: messageToSend,
            room: roomID
          };

          // Sends message over the socket
          sendMessage(JSON.stringify(chatParams), (success) => {
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
        } else {
          // There was an error creating a new message
          console.log(messageData.data.err);
        }
      })
      .catch(messageErr => {
          console.log(messageErr);
      });
  }

  // Render the component
  render() {
    return (
      <Chats>
        <form className="message-form" onSubmit={ this.handleSubmit }>
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