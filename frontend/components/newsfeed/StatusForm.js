import React from 'react';
import autosize from 'autosize';
import PropTypes from 'prop-types';
import axios from 'axios';
import ErrorMessage from '../ErrorMessage';

/**
 * Render the status form to appear at the top of the newsfeed and at the top
 * of a user's profile page.
 *
 * Post button only shows after the user clicks on the form.
 *
 * TODO render newly created status
 */
class StatusForm extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      status: "",
      error: "",
    };

    // Bind this to helper methods
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Autosize the text area to fit the text that's pasted into it
  componentDidMount() {
    autosize(document.querySelectorAll('textarea'));
  }

  // Click handler to expand the form
  handleClick() {
    this.setState({
      active: true,
    });
  }

  // Handle a change in the form state--that is, when a user types in the status
  handleChange(event) {
    // Update the state of the form
    this.setState({
      status: event.target.value,
    });
  }

  // Handle when the status form is submitted
  handleSubmit(event) {
    // Prevent the default submit action
    event.preventDefault();

    // Ensure that the status is valid
    if (!this.state.status || this.state.status.length < 2) {
      this.setState({
        error: "Status must be at least 2 characters long."
      });
    } else {
      // Remove any existing error
      this.setState({
        error: "",
      });

      // Create the new status
      axios.post("/api/statuses/new", {
        content: this.state.status,
        receiver: this.props.receiver,
      })
        .then(res => {
          if (!res.data.success) {
            this.setState({
              error: res.data.error,
            });
          } else {
            // Reset the state
            this.setState({
              error: "",
              status: "",
              active: false,
            });

            // Propogate the data up to the home components
            this.props.callback(res.data);
          }
        })
        .catch(err => {
          // Catch an error on the post request
          if (err) {
            this.setState({
              error: err,
            });
          } else {
            this.setState({
              error: "Failed to create status."
            });
          }
        });
    }
  }

  // Render method
  render() {
    return (
      <div>
        {
          this.state.error && (<ErrorMessage text={ this.state.error } />)
        }
        <div className="status-form marg-bot-1">
          <form onClick={ this.handleClick } onSubmit={ this.handleSubmit }>
            <div className="card pad-0 marg-bot-05">
              <textarea
                type="text"
                name="status"
                className="form-control"
                placeholder={ this.props.placeholder }
                value={ this.state.status }
                onChange={ this.handleChange }
              />
              <div className={ this.state.active ? "buttons right" : "buttons right hidden" }>
                <input
                  type="submit"
                  value="Post"
                  className={
                    (this.state.status && this.state.status.length > 0) ? "btn btn-gray btn-sm" : "btn btn-gray btn-sm disabled"
                  } />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

StatusForm.propTypes = {
  placeholder: PropTypes.string,
  callback: PropTypes.func,
  receiver: PropTypes.string,
};

export default StatusForm;
