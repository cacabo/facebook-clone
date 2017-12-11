import React from 'react';
import autosize from 'autosize';
import { Link } from 'react-router-dom';
import Comment from './Comment';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';

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
      commentsCount: this.props.commentsCount,
      likesCount: this.props.likesCount,
      toggledComments: false,
      isLiked: false,
      pending: true,
    };

    // Bind this to helper functions
    this.commentOnClick = this.commentOnClick.bind(this);
    this.likeOnClick = this.likeOnClick.bind(this);
  }

  // Autosize textarea when user types
  componentDidMount() {
    autosize(document.querySelectorAll('textarea'));

    /**
     * TODO make a request to check if theuser ahs liked the status or not
     * and set the state accordingly
     */
    axios.get('/api/users/' + this.props.user + '/statuses/' + this.props.id + '/checkLike')
      .then(checkData => {
        // Set state to isLiked or not isLiked

        // If success is true, user has liked status already
        if(checkData.data.success === true) {
          this.setState({
            isLiked: true,
            pending: false,
          });
        } else {
          this.setState({
            isLiked: false,
            pending: false,
          });
        }
      })
      /**
       * TODO Figure out what to do if there is an error with axios get request
       */
      .catch(err => {
        console.log(err);
      });
  }

  // Handle a click on the comments icon
  commentOnClick() {
    this.setState({
      toggledComments: !this.state.toggledComments,
    });
  }

  // Handle a click on the likes icon
  likeOnClick() {
    /**
     * TODO make a request to like or unlike the status
     * if successful, update the state
     * if there is an error console.log it and we can figure out what to do
     * with that error later
     * Also update likes count if successful
     */
    console.log("PROPS");
    console.log(this.props);
    // Only be able to click if state is not pending
    if (!this.state.pending) {
      axios.get('/api/users/' + this.props.user + '/statuses/' + this.props.id + '/likes')
        .then(likeData => {
          // If updating like was done properly, we switch isLiked state
          if (likeData.data.success) {
            this.setState({
              isLiked: !this.state.isLiked,
            });
            // If we liked, then increase the count, else decrease count
            if(this.state.isLiked) {
              this.setState({
                likesCount: this.state.likesCount + 1,
              });
            } else {
              this.setState({
                likesCount: this.state.likesCount - 1,
              });
            }
          } else {
            // There was an error adding/deleting like
            console.log(likeData.data.err);
          }
        })
        /**
         * TODO Figure out what to do if there is an error with axios get request
         */
        .catch(likeErr => {
          console.log(likeErr);
        });
    }
  }

  // Render method
  render() {
    // Find the date from the timestamp
    const d = new Date(this.props.createdAt);
    const timestamp = moment(d).fromNow();

    // Return the component to be rendered
    return(
      <div className="card status">
        <div className="user">
          <div className="userImg" style={
            { backgroundImage: "url(" + this.props.userData.profilePicture + ")" }
          } />
          <div className="header-text">
            <p className="name">
              <Link to={ "/users/" + this.props.user }>
                { this.props.userData.name }
              </Link>
              { this.props.receiver && (<i className="fa fa-caret-right" />) }
              { this.props.receiver && (
                <Link to={ "/users/" + this.props.receiver }>
                  { this.props.receiverData.name }
                </Link>
              ) }
            </p>

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
            { this.state.likesCount } likes
          </div>
          <div className="comment" onClick={ this.commentOnClick }>
            <i className={ this.state.toggledComments ? "fa fa-comment" : "fa fa-comment-o" } />
            { this.state.commentsCount } comments
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
  receiver: PropTypes.string,
  receiverData: PropTypes.object,
  id: PropTypes.string,
};

export default Status;
