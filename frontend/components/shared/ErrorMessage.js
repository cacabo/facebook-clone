import React from 'react';
import PropTypes from 'prop-types';

/**
 * Helper component to render the error passed into it
 */
const ErrorMessage = ({ title, text }) => {
  return (
    <div className="alert alert-danger error">
      <p className="bold marg-bot-05">
        { title ? title : "There was an error:" }
      </p>
      <p className="marg-bot-0">
        { text }
      </p>
    </div>
  );
};

ErrorMessage.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
};

export default ErrorMessage;
