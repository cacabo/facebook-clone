import React from 'react';
import StatusForm from './StatusForm';

const Home = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
          <StatusForm />

          <div className="card">
            <h1>NETS 212 Final Project</h1>
            <p>
              Lorem ipsum
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
