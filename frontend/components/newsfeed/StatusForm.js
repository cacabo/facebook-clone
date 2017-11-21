import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="status-form marg-bot-1">
      <form>
        <div className="card pad-0 marg-bot-05">
          <textarea
            type="text"
            name="status"
            className="form-control"
            placeholder="What's on your mind?"
          ></textarea>
        </div>
        <div className="buttons right">
          <Link to="/users/TODO" className="btn btn-info btn-sm card-shade">Profile</Link>
          <input type="submit" value="Post" className="btn btn-primary btn-sm card-shade cursor" />
        </div>
      </form>
    </div>
  );
};

export default Home;
