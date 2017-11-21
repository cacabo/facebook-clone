import React from 'react';

const Thin = ({ children }) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
          { children }
        </div>
      </div>
    </div>
  );
};

export default Thin;
