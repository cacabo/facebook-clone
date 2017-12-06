import React from 'react';
import StatusForm from './StatusForm';
import Status from './Status';
import FriendRecommendations from './FriendRecommendations';
import OnlineNow from './OnlineNow';
import uuid from 'uuid-v4';
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
 */
class Home extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      pending: true,
      statuses: [],
    };

    // Bind this
    this.renderStatuses = this.renderStatuses.bind(this);
  }

  /**
   * Pull the statuses from the database
   * TODO pull only statuses from friends
   * TODO denote errors to the user
   */
  componentDidMount() {
    axios.get('/api/statuses')
      .then(res => {
        console.log(res);
        if (res.data.success) {
          this.setState({
            pending: false,
            statuses: res.data.data.statusArr,
          });
        } else {
          this.setState({
            error: "There was an error pulling information from the database."
          });
        }
      })
      .catch(err => {
        // Update the state to have an error
        this.setState({
          error: err,
        });
      });
  }

  /**
   * Helper function to render statuses on the homepage
   * This renders the statuses contained in the state of the component
   * NOTE map is a funcitonal iterator method
   * TODO add like counts
   */
  renderStatuses() {
    return this.state.statuses.map((status) => {
      return (
        <Status
          content={ status.content }
          image={ status.image }
          username={ status.username }
          key={ uuid() }
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
          <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-0 col-xl-5">
            {
              this.props.success ? (
                <div className="alert alert-success">
                  { this.props.success }
                </div>
              ) : (
                ""
              )
            }
            <StatusForm placeholder="What's on your mind?" />
            { this.state.pending ? (<Loading />) : (this.renderStatuses()) }
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
