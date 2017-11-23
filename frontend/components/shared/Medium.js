import React from 'react';

/**
 * Wrapper component of medium width which renders whatever component you put
 * within it.
 */
const Medium = ({ children }) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
          { children }
        </div>
      </div>
    </div>
  );
};

export default Medium;
