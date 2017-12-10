import React from 'react';
import { Link } from 'react-router-dom';
import Thin from '../shared/Thin';
import Loading from '../shared/Loading';

/**
 * Component rendered when the URL entered by a user is not found
 */
class Search extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      pending: true,
      users: [],
    };
  }

  // Render the component
  render() {
    return (
      <Thin>
        <div className="card">
          <h3 className="bold">Search suggestions</h3>
          {
            this.state.pending ? (
              <Loading />
            ) : (
              ""
            )
          }
        </div>
      </Thin>
    );
  }
}

export default Search;
