import React from 'react';

const Home = ({ placeholder }) => (
  <div className="status-form marg-bot-1">
    <form>
      <div className="card pad-0 marg-bot-05">
        <textarea
          type="text"
          name="status"
          className="form-control"
          placeholder={ placeholder }
        ></textarea>
      </div>
      <div className="buttons right">
        <input type="submit" value="Post" className="btn btn-primary btn-sm card-shade cursor" />
      </div>
    </form>
  </div>
);

export default Home;
