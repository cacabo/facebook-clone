import React from 'react';
import Thin from '../shared/Thin';
import Loading from '../shared/Loading';
import UserPreview from '../newsfeed/UserPreview';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import Login from './Login';
import ErrorMessage from '../shared/ErrorMessage';

/**
 * Component rendered when the URL entered by a user is not found
 */
class Search extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      pending: true,
      error: "",
      users: [],
    };
  }

  // Load suggestions
  componentDidMount() {
    // Make the API request
    axios.get("/api/users/search/" + this.props.match.params.prefix)
      .then(res => {
        if (res.data.success) {
          this.setState({
            users: res.data.data,
            pending: false,
            error: "",
          });
        } else {
          this.setState({
            error: "Error fetching users.",
            pending: false,
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

  // Helper method to render users
  renderUsers() {
    if (this.state.users.length) {
      return this.state.users.map(user => {
        return (
          <UserPreview
            name={ user.name }
            username={ user.username }
            profilePicture={ user.profilePicture }
            key={ user.username }
          />
        );
      });
    }

    // If no users are found
    return (
      <p className="marg-bot-0">
        No users matching your search were found.
      </p>
    );
  }

  // Render the component
  render() {
    if (!this.props.username) {
      // If the user is not logged in
      return (<Login notice="You must be logged in to view this page." />);
    }

    // If the user is logged in
    return (
      <Thin>
        <div className="card">
          <h3 className="bold marg-bot-1">
            User search suggestions
          </h3>
          {
            this.state.error && (<ErrorMessage text={ this.state.error } />)
          }
          {
            this.state.pending ? (
              <Loading />
            ) : (
              this.renderUsers()
            )
          }
        </div>
      </Thin>
    );
  }
}

Search.propTypes = {
  match: PropTypes.object,
  username: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    username: state.userState.username,
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
