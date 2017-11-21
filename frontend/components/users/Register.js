import React from 'react';
import Thin from '../shared/Thin';
import { Link } from 'react-router-dom';

const Regsiter = () => {
  return (
    <Thin>
      <div className="card">
        <h2>New user</h2>
        <form>
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
            Password
          </label>
          <input type="password" name="password" className="form-control marg-bot-1" />

          <label>
            Confirm password
          </label>
          <input type="password" name="confirmPassword" className="form-control marg-bot-1" />

          <input type="submit" className="btn btn-primary full-width cursor" value="Register" />
        </form>
        <p className="marg-top-1 marg-bot-0">
          Already have an account? <Link to="/login" className="inline">login.</Link>
        </p>
      </div>
    </Thin>
  );
};

export default Regsiter;
