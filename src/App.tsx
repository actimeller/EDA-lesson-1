import React, { useContext } from 'react';
import {
  Redirect,
  Route, Switch,
} from 'react-router-dom';
import { Layout } from 'antd';
import './App.scss';

import UserContext from './context/UserContext';
import Login from './components/Login';
import Registration from './components/Registration';
import Restore from './components/Restore';
import NotFound from './components/NotFound';
import TaskList from './components/TaskList';
import Profile from './components/Profile';
import Wrapper from './components/Wrapper';

export default () => {
  const { sessionId } = useContext(UserContext);

  if (sessionId == null) {
    return (
      <Layout>
        <div className="LoginPage">
          <Switch>
            <Route
              path="/login"
              component={Login}
            />
            <Route
              path="/registration"
              component={Registration}
            />
            <Route
              path="/restore"
              component={Restore}
            />
            <Redirect to="/login" />
          </Switch>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Wrapper>
        <Switch>
          <Route
            path="/"
            exact
            component={TaskList}
          />
          <Route
            path="/profile"
            exact
            component={Profile}
          />
          <Route component={NotFound} />
        </Switch>
      </Wrapper>
    </Layout>
  );
};
