import React from 'react';
import StatusForm from './StatusForm';
import Status from './Status';
import FriendRecommendations from './FriendRecommendations';
import OnlineNow from './OnlineNow';
import PropTypes from 'prop-types';
import axios from 'axios';
import Loading from '../shared/Loading';

/**
 * Component to render a user's newsfeed.
 *
 * On smaller screens, exclusively the newsfeed shows up. On larger screens,
 * however, a user sees 1. recommended friends (to the left), 2. their newsfeed,
 * 3. a list of friends currently online.
 *
 * TODO handle success / push notifications when the user successfully logs in,
 * creates a post, etc.
 *
 * TODO render errors when loading content
 */
class Home extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      pending: true,
      statuses: [],
      error: "",
    };

    // Bind this to helper methods
    this.renderStatuses = this.renderStatuses.bind(this);
    this.newStatusCallback = this.newStatusCallback.bind(this);
  }

  /**
   * Pull the statuses from the database
   * TODO pull only statuses from friends
   * TODO denote errors to the user
   */
  componentDidMount() {
    // Make the AJAX request
    axios.get('/api/statuses')
      .then(res => {
        // Check if the response was successful
        if (res.data.success) {
          this.setState({
            pending: false,
            statuses: res.data.data,
            error: "",
          });
        } else {
          this.setState({
            pending: false,
            error: "There was an error pulling information from the database."
          });
        }
      })
      .catch(err => {
        // Update the state to have an error
        this.setState({
          pending: false,
          error: err,
        });
      });
  }

  // Helper method to render a newly created status
  newStatusCallback(data) {
    // Get the object
    const status = data.data;

    // Get the status information
    axios.get("/api/users/" + status.user)
      .then(userData => {
        const userObj = userData.data.data;
        status.userData = userObj;

        // Update state to contain the new status
        this.setState({
          statuses: [
            status,
            ...this.state.statuses,
          ],
        });
      })
      .catch(err => {
        /**
         * TODO
         */
        console.log(err);
      });
  }

  /**
   * Helper function to render statuses on the homepage
   * This renders the statuses contained in the state of the component
   */
  renderStatuses() {
    return this.state.statuses.map((status) => {
      return (
        <Status
          content={ status.content }
          image={ status.image }
          user={ status.user }
          key={ status.id }
          receiver={ status.receiver }
          userData={ status.userData }
          receiverData={ status.receiverData }
          commentsCount={ status.commentsCount }
          createdAt={ status.createdAt }
          likesCount={ status.likesCount }
          type={ status.type }
          id={ status.id }
        />
      );
    });
  }

  // Render the component
  render() {
    return (
      <div className="container-fluid marg-top-1">
        <div className="row">
          <div className="col-lg-3 hidden-md-down">
            <FriendRecommendations />
          </div>
          <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-0 col-xl-5 no-pad-wide">
            {
              this.props.success ? (
                <div className="alert alert-success">
                  { this.props.success }
                </div>
              ) : (
                ""
              )
            }
            <StatusForm
              placeholder="What's on your mind?"
              callback={ this.newStatusCallback }
            />
            { this.state.error && (
              <div className="alert alert-danger error">
                <p className="strong marg-bot-05">
                  There was an error
                </p>
                <p className="marg-bot-1">
                  { this.state.error }
                </p>
              </div>
            ) }
            { (this.state.pending && !this.state.error) ? (<Loading />) : (this.renderStatuses()) }
            { !this.state.pending && (
              <div className="card">
                <p className="marg-bot-0">
                  There are no more statuses to show. Add more friends or wait and refresh your page for more content.
                </p>
              </div>
            ) }
            <div className="space-4" />
          </div>
          <div className="col-md-3 col-xl-4 hidden-md-down">
            <OnlineNow />
          </div>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  success: PropTypes.string,
};

export default Home;
