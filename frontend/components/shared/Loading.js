import React from 'react';

/**
 * Wrapper component of medium width which renders whatever component you put
 * within it.
 */
const Loading = () => {
  return (
    <div className="loading">
      <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw" />
      <span className="sr-only">
        Loading...
      </span>
    </div>
  );
};

export default Loading;
