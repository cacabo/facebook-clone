import React from 'react';
import autosize from 'autosize';

/**
 * Render the status form to appear at the top of the newsfeed and at the top
 * of a user's profile page.
 *
 * Post button only shows after the user clicks on the form.
 */
class StatusForm extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      status: "",
    };

    // Bind this to helper methods
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
    /**
     * TODO
     */
    event.preventDefault();
  }

  // Render method
  render() {
    return (
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
            ></textarea>
            <div className={ this.state.active ? "buttons right" : "buttons right hidden" }>
              <input
                type="submit"
                value="Post"
                className={
                  (this.state.status && this.state.status.length > 0) ? "btn btn-gray btn-sm card-shade" : "btn btn-gray btn-sm card-shade disabled"
                } />
            </div>
          </div>
        </form>
      </div>
    );
  }
};

export default StatusForm;
