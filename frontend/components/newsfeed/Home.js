import React from 'react';
import StatusForm from './StatusForm';
import Status from './Status';

const Home = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xl-5 offset-xl-3">
          <StatusForm />

          <div className="card">
            <h3>
              NETS 212 Final Project
            </h3>
            <p className="marg-bot-0">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>

          <Status
            name="Terry Jo"
            status="I'm a fool loool"
            img="https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/15585239_1133593586737791_6146771975815537560_o.jpg?oh=1f5bfe8e714b99b823263e2db7fa3329&oe=5A88DA92"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
