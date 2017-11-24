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
    };
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    autosize(document.querySelectorAll('textarea'));
  }

  // Click handler
  onClick() {
    this.setState({
      active: true,
    });
  }

  // Render method
  render() {
    return (
      <div className="status-form marg-bot-1">
        <form onClick={ this.onClick }>
          <div className="card pad-0 marg-bot-05">
            <textarea
              type="text"
              name="status"
              className="form-control"
              placeholder={ this.props.placeholder }
            ></textarea>
            <div className={ this.state.active ? "buttons right" : "buttons right hidden" }>
              <input type="submit" value="Post" className="btn btn-gray btn-sm card-shade cursor" />
            </div>
          </div>
        </form>
      </div>
    );
  }
};

export default StatusForm;
