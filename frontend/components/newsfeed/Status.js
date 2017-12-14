import React from 'react';
import autosize from 'autosize';
import { Link } from 'react-router-dom';
import Comment from './Comment';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';
import { connect } from 'react-redux';
import Loading from '../shared/Loading';

/**
 * Renders a status posted by a user. This can show up either on the newsfeed
 * or on a user's profile page.
 *
 * State handles whether comments show up or not. By default, they are hidden.
 * Toggle the comments box by clicking on the comments icon or text.
 *
 * TODO new friend updates (different type of status)
 * TODO profile updates (different type of status)
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
      commentsPending: true,
      comments: [],
      comment: "",
      commentError: "",
      isNew: this.props.isNew,
      type: this.props.type,
      error: "",
    };

    // Bind this to helper functions
    this.commentOnClick = this.commentOnClick.bind(this);
    this.likeOnClick = this.likeOnClick.bind(this);
    this.handleSubmitComment = this.handleSubmitComment.bind(this);
    this.handleChangeComment = this.handleChangeComment.bind(this);
  }

  // Autosize textarea when user types
  componentDidMount() {
    autosize(document.querySelectorAll('textarea'));

    /**
     * TODO make a request to check if the user has liked the status or not
     * and set the state accordingly
     */
    axios.get('/api/users/' + this.props.user + '/statuses/' + this.props.id + '/checkLike')
      .then(checkData => {
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
      .catch(err => {
        this.setState({
          error: err,
        });
      });

    // Set a timeout for removing isNew after 5 seconds
    if (this.state.isNew) {
      setTimeout(() => {
        this.setState({
          isNew: false,
        });
      }, 5000);
    }
  }

  // Handle a click on the comments icon
  commentOnClick() {
    // Toggle the comments being displayed
    this.setState({
      toggledComments: !this.state.toggledComments,
    });

    // If the comments haven't been loaded yet
    if (this.state.commentsPending) {
      // Make a request for the comments
      axios.get(`/api/users/${this.props.user}/statuses/${this.props.id}/comments`)
        .then(res => {
          // Update the state
          this.setState({
            commentsPending: false,
            comments: res.data.data,
          });
        })
        .catch(err => {
          this.setState({
            error: err,
            commentsPending: false,
            comments: [],
          });
        });
    }
  }

  /**
   * Handle a click on the likes icon
   *
   * Make a request to like or unlike the status
   * if successful, update the state
   *
   * Also update likes count if successful
   */
  likeOnClick() {
    // Assume that the request will succeed and update the state accordingly
    if (this.state.isLiked) {
      this.setState({
        isLiked: false,
        likesCount: this.state.likesCount - 1,
      });
    } else {
      this.setState({
        isLiked: true,
        likesCount: this.state.likesCount + 1,
      });
    }

    // Only be able to click if state is not pending
    if (!this.state.pending) {
      axios.get('/api/users/' + this.props.user + '/statuses/' + this.props.id + '/likes')
        .then(likeData => {
          // If updating like was done properly, we switch isLiked state
          if (!likeData.data.success) {
            // There was an error adding/deleting like
            // Revert to the past state
            if (this.state.isLiked) {
              this.setState({
                isLiked: false,
                likesCount: this.state.likesCount - 1,
              });
            } else {
              this.setState({
                isLiked: false,
                likesCount: this.state.likesCount + 1,
              });
            }
          }
        })
        .catch(() => {
          // There was an error adding/deleting like
          // Revert to the past state
          if (this.state.isLiked) {
            this.setState({
              isLiked: false,
              likesCount: this.state.likesCount - 1,
            });
          } else {
            this.setState({
              isLiked: false,
              likesCount: this.state.likesCount + 1,
            });
          }
        });
    }
  }

  // Handle a user editing the comment textarea
  handleChangeComment(event) {
    // Update the state to have the new comment value
    this.setState({
      comment: event.target.value,
    });
  }

  // Handle when a user writes a new comment
  handleSubmitComment(event) {
    // Prevent default form action
    event.preventDefault();

    // Ensure the comment is at least 1 character long and less than 200 chars
    if (this.state.comment && this.state.comment.length < 200) {
      // Remove any existing error
      this.setState({
        commentError: "",
      });

      // Create the body of the request
      const body = {
        comment: this.state.comment,
      };

      // Make an axios request to create a comment for the status
      axios.post(`/api/users/${this.props.user}/statuses/${this.props.id}/comments/new`, body)
        .then(res => {
          if (res.data.success) {
            // Find the data of the created comment
            const comment = res.data.data.data;

            // Aggregate the user information
            const userData = {
              username: this.props.username,
              name: this.props.name,
              profilePicture: this.props.profilePicture,
            };

            // Add user data to the comment
            comment.userData = userData;

            // Denote that the comment is new
            comment.isNew = true;
            comment.comment = this.state.comment;

            // Update the state
            this.setState({
              comments: [
                ...this.state.comments,
                comment,
              ],
              comment: "",
              commentsCount: this.state.commentsCount + 1,
            });
          } else {
            // There was an issue with the post request
            this.setState({
              commentError: res.data.error,
            });
          }
        })
        .catch(err => {
          // If we failed to push the comment to the database
          this.setState({
            commentError: err,
          });
        });
    } else {
      // Denote an error
      if (!this.state.comment) {
        this.setState({
          commentError: "Comment must be populated",
        });
      } else {
        this.setState({
          commentError: "Comment must be under 200 characters",
        });
      }
    }
  }

  // Helper function to render comments
  renderComments() {
    return this.state.comments.map(comment => (
      <Comment
        userData={ comment.userData }
        text={ comment.comment }
        key={ comment.id }
        id={ comment.id }
        createdAt={ comment.createdAt }
        isNew={ comment.isNew ? comment.isNew : false }
      />
    ));
  }

  // Render method
  render() {
    // Find the date from the timestamp
    const d = new Date(this.props.createdAt);
    const timestamp = moment(d).fromNow();

    // Return the component to be rendered
    return(
      <div className={ this.state.isNew ? "card status new" : "card status" }>
        <div className="user">
          <div className="userImg" style={
            { backgroundImage: "url(" + this.props.userData.profilePicture + ")" }
          } />
          <div className="header-text">
            <p className="name">
              <Link to={ "/users/" + this.props.user }>
                { this.props.userData.name }
              </Link>
              {
                (this.props.receiver && this.props.type === "STATUS") &&
                (<i className="fa fa-caret-right" />)
              }
              {
                (this.props.type === "UPDATE_PROFILE_PICTURE") && (
                  <span className="about">
                    &nbsp;updated their profile picture.
                  </span>
                )
              }
              {
                (this.props.type === "UPDATE_COVER_PHOTO") && (
                  <span className="about">
                    &nbsp;updated their cover photo.
                  </span>
                )
              }
              {
                (this.props.type === "UPDATE_BIO") && (
                  <span className="about">
                    &nbsp;updated their bio.
                  </span>
                )
              }
              {
                (this.props.type === "FRIENDSHIP") && (
                  <span className="about">
                    &nbsp;became friends with&nbsp;
                  </span>
                )
              }
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
        {
          this.state.error && (
            <div className="alert alert-danger error">
              { this.state.error }
            </div>
          )
        }
        {
          this.props.content && (
            <p className={ this.props.type === "UPDATE_BIO" ? ("marg-bot-0 text bio") : ("marg-bot-0 text") }>
              { this.props.content }
            </p>
          )
        }
        {
          (this.props.type === "FRIENDSHIP") && (<img alt="friendship" className="friendship img-fluid" src="https://s3.amazonaws.com/nets-final-project-assets/fitsbump.svg" />)
        }
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
          <div className="comments-form-wrapper">
            {
              this.state.commentError && (
                <div className="alert alert-danger error">
                  <p className="marg-bot-0">
                    { this.state.commentError }
                  </p>
                </div>
              )
            }
            <form className="comments-form" onSubmit={this.handleSubmitComment}>
              <div className="img" style={{ backgroundImage: `url(${this.props.profilePicture})` }} />
              <textarea
                className="form-control animate"
                placeholder="Leave a comment..."
                name="comment"
                type="text"
                rows="1"
                value={ this.state.comment }
                onChange={ this.handleChangeComment }
              />
              <input className="btn btn-gray btn-sm marg-left-05" type="submit" name="submit" value="Reply" />
            </form>
          </div>
          {
            (this.state.commentsPending) ? (
              <Loading />
            ) : (
              this.renderComments()
            )
          }
        </div>
      </div>
    );
  }
}

Status.propTypes = {
  profilePicture: PropTypes.string,
  userImg: PropTypes.string,
  username: PropTypes.string,
  name: PropTypes.string,
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
  isNew: PropTypes.bool,
  type: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    profilePicture: state.userState.profilePicture,
    username: state.userState.username,
    name: state.userState.name,
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Status);
