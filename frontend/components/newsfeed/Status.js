import React from 'react';
import autosize from 'autosize';
import { Link } from 'react-router-dom';
import Comment from './Comment';
import PropTypes from 'prop-types';
import moment from 'moment';

/**
 * Renders a status posted by a user. This can show up either on the newsfeed
 * or on a user's profile page.
 *
 * State handles whether comments show up or not. By default, they are hidden.
 * Toggle the comments box by clicking on the comments icon or text.
 *
 * TODO stateful likes
 * TODO pull user information from DB
 * TODO actually render comments
 * TODO put in timestamp at bottom right
 */
class Status extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      toggledComments: false,
      isLiked: false,
    };

    // Bind this to helper functions
    this.commentOnClick = this.commentOnClick.bind(this);
    this.likeOnClick = this.likeOnClick.bind(this);
  }

  // Autosize textarea when user types
  componentDidMount() {
    autosize(document.querySelectorAll('textarea'));
  }

  // Handle a click on the comments icon
  commentOnClick() {
    this.setState({
      toggledComments: !this.state.toggledComments,
    });
  }

  // Handle a click on the likes icon
  likeOnClick() {
    this.setState({
      isLiked: !this.state.isLiked,
    });
  }

  // Render method
  render() {
    // Find the date from the timestamp
    const d = new Date(this.props.createdAt);
    const timestamp = moment(d).fromNow();

    return(
      <div className="card status">
        <div className="user">
          <div className="userImg" style={
            { backgroundImage: "url(" + this.props.userData.profilePicture + ")" }
          } />
          <div className="header-text">
            <Link to={ "/users/" + this.props.user } >
              { this.props.userData.firstName + " " + this.props.userData.lastName }
            </Link>
            <p className="timestamp">
              { timestamp }
            </p>
          </div>
        </div>
        <p className="marg-bot-0 text">
          { this.props.content }
        </p>
        { this.props.image ? <img alt={ this.props.content } src={ this.props.image } className="img-fluid image" /> : "" }
        <div className="interact">
          <div className="like" onClick={ this.likeOnClick }>
            <i className={ this.state.isLiked ? "fa fa-heart" : "fa fa-heart-o" } />
            { this.props.likesCount } likes
          </div>
          <div className="comment" onClick={ this.commentOnClick }>
            <i className={ this.state.toggledComments ? "fa fa-comment" : "fa fa-comment-o" } />
            { this.props.commentsCount } comments
          </div>
        </div>
        <div className={ this.state.toggledComments ? "comments" : "comments hidden" }>
          <form className="comments-form">
            <textarea className="form-control animate" placeholder="Leave a comment..." name="comment" type="text" rows="1" />
            <input className="btn btn-gray btn-sm marg-left-05" type="submit" name="submit" value="Reply" />
          </form>
          <Comment text="Nice post" />
        </div>
      </div>
    );
  }
}

Status.propTypes = {
  userImg: PropTypes.string,
  image: PropTypes.string,
  content: PropTypes.string,
  user: PropTypes.string,
  userData: PropTypes.object,
  commentsCount: PropTypes.number,
  likesCount: PropTypes.number,
  createdAt: PropTypes.string,
};

export default Status;
