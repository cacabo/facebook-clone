import React from 'react';
import { Link } from 'react-router-dom';
import Thin from '../shared/Thin';
import Loading from '../shared/Loading';
import UserPreview from '../newsfeed/UserPreview';
import PropTypes from 'prop-types';
import axios from 'axios';

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
          });
        } else {
          /**
           * TODO handle this
           */
          console.log(res.data.error);
          this.setState({
            pending: false,
          });
        }
      })
      .catch(err => {
        /**
         * TODO handle this
         */
        console.log(err);
        this.setState({
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
    return (
      <Thin>
        <div className="card">
          <h3 className="bold">Search suggestions</h3>
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
};

export default Search;
