import React from 'react';
import UserPreview from './UserPreview';
import uuid from 'uuid-v4';
import Loading from '../shared/Loading';
import ErrorMessage from '../shared/ErrorMessage';
import axios from 'axios';

/**
 * Component to render which of your friends are currently online.
 * TODO remove dummy data
 * TODO have timestamps for when a user logged off? Show most recent number?
 */
class OnlineNow extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      onlineNow: [],
      pending: true,
    };
  }

  // Pull in the data from the database
  componendDidMount() {
    axios.get("/api/online")
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        this.setState({
          error: err,
          pending: false,
        });
      });
  }

  // Helper function to return which friends are online as based on state
  renderOnlineNow() {
    return this.state.onlineNow.map(rec => {
      return (
        <UserPreview
          name={ rec.name }
          id={ rec.id }
          img={ rec.img }
          isOnline
          key={ uuid() }
        />
      );
    });
  }

  // Function to render the component
  render() {
    return (
      <div className="card pad-bot-025">
        <strong className="marg-bot-05">
          Online now
        </strong>
        {
          this.state.error && <ErrorMessage text={ this.state.error } />
        }
        { this.state.pending ? <Loading /> : this.renderOnlineNow() }
      </div>
    );
  }
}

export default OnlineNow;
