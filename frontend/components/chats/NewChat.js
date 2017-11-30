import React from 'react';
import Chats from './Chats';
import autosize from 'autosize';

/**
 * Component to render one of a user's group chats.
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
    /**
     * TODO
     */
    console.log("New chat for submitted");
    event.preventDefault();
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
              "btn btn-gray card-shade" :
              "btn btn-gray card-shade disabled"
            }
            value="Create chat"
          />
        </form>
      </Chats>
    );
  }
}

export default NewChat;
