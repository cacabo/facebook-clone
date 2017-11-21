import React from 'react';
import { connect } from 'react-redux';
import Title from '../components/Title';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const AppContainer = () => (
  <Router>
    <Switch>
      <Route exact path='/' component={Title}/>
      <Route path='/lit' component={Title}/>
      <Route path='/users' component={Title}/>
    </Switch>
  </Router>
);

export default AppContainer;
