import React from 'react';
import StatusForm from './StatusForm';
import { Link } from 'react-router-dom';

/**
 * Renders a status posted by a user. This can show up either on the newsfeed
 * or on a user's profile page.
 *
 * State handles whether comments show up or not. By default, they are hidden.
 * Toggle the comments box by clicking on the comments icon or text.
 */
class Status extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      toggledComments: false,
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState({
      toggledComments: !this.state.toggledComments,
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
          <div className="like">
            <i className="fa fa-heart-o"></i>
            12 likes
          </div>
          <div className="comment" onClick={ this.onClick }>
            <i className="fa fa-comment-o"></i>
            4 comments
          </div>
        </div>
        <div className={ this.state.toggledComments ? "comments" : "comments hidden" }>
          <form className="comments-form">
            <textarea className="form-control" placeholder="Leave a comment..." name="comment" type="text" rows="1"></textarea>
            <input className="btn btn-gray" type="submit" name="submit" value="Reply" />
          </form>
          <p>
            These are the comments
          </p>
        </div>
      </div>
    );
  }
}

export default Status;
