import React from 'react';
import StatusForm from './StatusForm';
import { Link } from 'react-router-dom';

/**
 * Renders a status posted by a user
 *
 * This can show up either on the newsfeed or on a user's profile page
 * Fills the size of the component it is rendered within
 */
const Status = ({ name, status, userImg, id, image }) => {
  return (
    <div className="card status">
      <div className="user">
        <div className="userImg" style={{backgroundImage: "url(" + userImg + ")"}}></div>
        <p>
          <Link to={ "/users/" + id } >
            { name }
          </Link>
        </p>
      </div>
      <p className="marg-bot-0">
        { status }
      </p>
      { image ? <img src={image} className="img-fluid image" /> : "" }
      <div className="interact">
        <div className="like">
          <i className="fa fa-heart-o"></i>
          12 likes
        </div>
        <div className="comment">
          <i className="fa fa-comment-o"></i>
          4 comments
        </div>
      </div>
    </div>
  );
};

export default Status;
