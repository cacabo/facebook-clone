import React from 'react';
import StatusForm from './StatusForm';
import { Link } from 'react-router-dom';

const Home = ({ name, status, userImg, id, image }) => {
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
    </div>
  );
};

export default Home;
