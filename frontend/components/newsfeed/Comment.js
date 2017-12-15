import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';

/**
 * Component to render an individual comment.
 */
class Comment extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      isNew: this.props.isNew,
    };
  }

  // When the component has mounted
  componentDidMount() {
    // Set a timeout for removing isNew after 5 seconds
    if (this.state.isNew) {
      setTimeout(() => {
        this.setState({
          isNew: false,
        });
      }, 5000);
    }
  }

  // Render method
  render() {
    // Find the date from the timestamp
    const d = new Date(this.props.createdAt);
    const timestamp = moment(d).fromNow(true);

    // Return the component
    return (
      <div className={ this.state.isNew ? "comment new" : "comment" }>
        <div
          className="img"
          style={{ backgroundImage: `url(${this.props.userData.profilePicture})`}}
        />
        <div className="text">
          <p className="content">
            <Link className="name" to={ "/users/" + this.props.userData.username }>
              { this.props.userData.name }
            </Link>
            { this.props.text }
          </p>
        </div>
        <p className="timestamp">
          { timestamp }
        </p>
      </div>
    );
  }
}

Comment.propTypes = {
  text: PropTypes.string,
  userData: PropTypes.object,
  createdAt: PropTypes.string,
  isNew: PropTypes.bool,
};

export default Comment;
