import React from 'react';
import StatusForm from './StatusForm';

const Home = ({ name, status, img}) => {
  return (
    <div className="card status">
      <div className="user">
        <div className="img" style={{backgroundImage: "url(" + img + ")"}}></div>
        <p>
          { name }
        </p>
      </div>
      <p className="marg-bot-0">
        { status }
      </p>
    </div>
  );
};

export default Home;
