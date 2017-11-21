import React from 'react';
import PropTypes from 'prop-types';

const Title = () => {
    return (
        <div>
          <h1>NETS 212 Final Project!</h1>
          <p>
            Lorem ipsum
          </p>
        </div>
    );
};

Title.propTypes = {
    name: PropTypes.string,
};

export default Title;
