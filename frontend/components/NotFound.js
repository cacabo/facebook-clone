import React from 'react';
import { Link } from 'react-router-dom';
import Thin from './shared/Thin';

/**
 * Component rendered when the URL entered by a user is not found
 */
const NotFound = () => (
  <Thin>
    <div className="card">
      <h2>Content not found</h2>
      <p>
        It seems like what you are looking for was either moved or does not exist.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </div>
  </Thin>
);

export default NotFound;
