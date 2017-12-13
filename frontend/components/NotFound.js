import React from 'react';
import { Link } from 'react-router-dom';
import Thin from './shared/Thin';
import PropTypes from 'prop-types';

/**
 * Component rendered when the URL entered by a user is not found
 */
const NotFound = ({ title, text }) => (
  <Thin>
    <div className="card">
      <h3 className="bold">
        { title ? title : "Content not found" }
      </h3>
      <p>
        { text ? text : "It seems like what you are looking for was either moved or does not exist." }
      </p>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </div>
  </Thin>
);

NotFound.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
};

export default NotFound;
