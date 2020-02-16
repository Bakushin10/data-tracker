//client/routes.js
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import App from './components/App';
import Update from './components/Update';

export const Routes = () => (
    <Switch>
      <Route exact path='/' component={App} />
      <Route path='/Update' component={Update} />
    </Switch>
);

export default Routes;