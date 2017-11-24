import React from 'react';
import Thin from '../shared/Thin';
import { Link } from 'react-router-dom';

/**
 * Component to render a form to edit a user's profile
 */
class EditProfile extends React.Component {
  render() {
    return(
      <Thin>
        <div className="card">
          <h3 className="marg-bot-1 bold">
            Edit profile information
          </h3>
          <form className="line-form">
            <label>
              Email
            </label>
            <input type="email" name="email" className="form-control marg-bot-1" />
            <div className="row">
              <div className="col-6">
                <label>
                  First name
                </label>
                <input type="text" name="firstName" className="form-control marg-bot-1" />
              </div>
              <div className="col-6">
                <label>
                  Last name
                </label>
                <input type="text" name="lastName" className="form-control marg-bot-1" />
              </div>
            </div>

            <label>
              Bio
            </label>
            <textarea name="bio" className="form-control marg-bot-1" rows="1"></textarea>

            <label>
              Interests
            </label>
            <input type="text" name="interests" className="form-control marg-bot-1" />

            <input type="submit" className="btn btn-primary full-width cursor" value="Update information" />
          </form>
          <p className="marg-top-1 marg-bot-0">
            Nevermind? <Link to={ "/users/" + this.props.match.params.id } className="inline">Back to your profile.</Link>
          </p>
        </div>
      </Thin>
    );
  }
};

export default EditProfile;
