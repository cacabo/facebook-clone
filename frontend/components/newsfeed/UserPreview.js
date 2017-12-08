import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Renders a single recommended friend for a user
 */
const UserPreview = ({ id, name, img, isOnline }) => (
  <div className="user user-sm userPreview">
    <div className="userImg" style={{backgroundImage: "url(" + img + ")"}} />
    <p>
      <Link to={ "/users/" + id }>
        { name }
      </Link>
    </p>
    { isOnline ? <div className="is-online" /> : "" }
  </div>
);

UserPreview.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  img: PropTypes.string,
  isOnline: PropTypes.bool,
};

export default UserPreview;
