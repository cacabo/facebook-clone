import React from 'react';
import Thin from '../shared/Thin';
import { Link } from 'react-router-dom';

const Regsiter = () => {
  return (
    <Thin>
      <div className="card">
        <h3 className="marg-bot-1 bold">
          Regsiter
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
            Password
          </label>
          <input type="password" name="password" className="form-control marg-bot-1" />

          <label>
            Confirm password
          </label>
          <input type="password" name="confirmPassword" className="form-control marg-bot-1" />

          <input type="submit" className="btn btn-primary full-width cursor" value="Create account" />
        </form>
        <p className="marg-top-1 marg-bot-0">
          Already have an account? <Link to="/login" className="inline">login here.</Link>
        </p>
      </div>
    </Thin>
  );
};

export default Regsiter;
