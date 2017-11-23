import React from 'react';
import StatusForm from './StatusForm';
import { Link } from 'react-router-dom';
import Comment from './Comment';

/**
 * Renders a status posted by a user. This can show up either on the newsfeed
 * or on a user's profile page.
 *
 * State handles whether comments show up or not. By default, they are hidden.
 * Toggle the comments box by clicking on the comments icon or text.
 *
 * TODO stateful likes
 */
class Status extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      toggledComments: false,
      isLiked: false,
    };
    this.commentOnClick = this.commentOnClick.bind(this);
    this.likeOnClick = this.likeOnClick.bind(this);
  }

  commentOnClick() {
    this.setState({
      toggledComments: !this.state.toggledComments,
    });
  }

  likeOnClick() {
    this.setState({
      isLiked: !this.state.isLiked,
    });
  }

  // Render method
  render() {
    return(
      <div className="card status">
        <div className="user">
          <div className="userImg" style={{backgroundImage: "url(" + this.props.userImg + ")"}}></div>
          <p>
            <Link to={ "/users/" + this.props.id } >
              { this.props.name }
            </Link>
          </p>
        </div>
        <p className="marg-bot-0 text">
          { this.props.status }
        </p>
        { this.props.image ? <img src={ this.props.image } className="img-fluid image" /> : "" }
        <div className="interact">
          <div className="like" onClick={ this.likeOnClick }>
            <i className={ this.state.isLiked ? "fa fa-heart" : "fa fa-heart-o" }></i>
            12 likes
          </div>
          <div className="comment" onClick={ this.commentOnClick }>
            <i className={ this.state.toggledComments ? "fa fa-comment" : "fa fa-comment-o" }></i>
            4 comments
          </div>
        </div>
        <div className={ this.state.toggledComments ? "comments" : "comments hidden" }>
          <form className="comments-form">
            <textarea className="form-control" placeholder="Leave a comment..." name="comment" type="text" rows="1"></textarea>
            <input className="btn btn-gray btn-sm" type="submit" name="submit" value="Reply" />
          </form>
          <Comment text="Really good stuff" />
        </div>
      </div>
    );
  }
}

export default Status;
