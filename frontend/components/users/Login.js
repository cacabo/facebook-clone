import React from 'react';
import Thin from '../shared/Thin';
import { Link } from 'react-router-dom';

/**
 * Component to render a user's login form
 */
const Login = () => {
  return (
    <Thin>
      <div className="card">
        <h3 className="bold marg-bot-1">
          Login
        </h3>
        <form className="line-form">
          <label>
            Email
          </label>
          <input type="email" name="email" className="form-control marg-bot-1" autoFocus="true" />

          <label>
            Password
          </label>
          <input type="password" name="password" className="form-control marg-bot-1" />

          <input type="submit" className="btn btn-primary full-width cursor" value="Create account" />
        </form>
        <p className="marg-top-1 marg-bot-0">
          Don't have an account? <Link to="/register" className="inline">create one here.</Link>
        </p>
      </div>
    </Thin>
  );
};

export default Login;
