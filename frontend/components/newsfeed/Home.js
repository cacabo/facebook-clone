import React from 'react';
import StatusForm from './StatusForm';
import Status from './Status';
import FriendRecommendations from './FriendRecommendations';
import OnlineNow from './OnlineNow';

const Home = () => {
  return (
    <div className="container-fluid marg-top-1">
      <div className="row">
        <div className="col-lg-3 hidden-md-down">
          <FriendRecommendations />
        </div>
        <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-0 col-xl-5">
          <StatusForm placeholder="What's on your mind?" />

          <Status
            name="Terry Jo"
            status="I'm a fool loool"
            userImg="https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/15585239_1133593586737791_6146771975815537560_o.jpg?oh=1f5bfe8e714b99b823263e2db7fa3329&oe=5A88DA92"
            id="1"
          />

          <Status
            name="Terry Jo"
            status="Look at this dog"
            userImg="https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/15585239_1133593586737791_6146771975815537560_o.jpg?oh=1f5bfe8e714b99b823263e2db7fa3329&oe=5A88DA92"
            id="1"
            image="http://www.insidedogsworld.com/wp-content/uploads/2016/03/Dog-Pictures.jpg"
          />
        </div>
        <div className="col-lg-3 col-xl-4 hidden-lg-down">
          <OnlineNow />
        </div>
      </div>
    </div>
  );
};

export default Home;
