import React from 'react';
import { Link } from 'react-router-dom';
import Thin from './shared/Thin';

/**
 * Component rendered when the URL entered by a user is not found
 */
const NotFound = () => (
  <Thin>
    <div className="card">
      <h3 className="bold">Content not found</h3>
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
