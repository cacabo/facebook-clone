import React from 'react';
import UserPreview from './UserPreview';
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
  componentDidMount() {
    axios.get("/api/online")
      .then(res => {
        if (res.data.success) {
          this.setState({
            pending: false,
            error: "",
            onlineNow: res.data.data,
          });
        } else {
          this.setState({
            pending: false,
            error: res.data.error,
          });
        }
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
          name={ rec.userData.name }
          username={ rec.userData.username }
          profilePicture={ rec.userData.profilePicture }
          key={ rec.userData.username }
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
