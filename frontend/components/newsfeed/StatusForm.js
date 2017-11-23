import React from 'react';

class StatusForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState({
      active: true,
    });
  }

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
