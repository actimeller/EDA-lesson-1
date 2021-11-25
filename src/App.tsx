import React, { useContext, useEffect } from 'react';
import {
  Redirect,
  Route, Switch,
} from 'react-router-dom';
import { Layout } from 'antd';
import './App.scss';

import { useDispatch } from 'react-redux';
import UserContext from './context/UserContext';
import Login from './components/Login';
import Registration from './components/Registration';
import Restore from './components/Restore';
import NotFound from './components/NotFound';
import TaskList from './components/TaskList';
import Profile from './components/Profile';
import Wrapper from './components/Wrapper';
import TaskEdit from './components/TaskEdit';
import TaskCreate from './components/TaskCreate';
import TaskTodayWidget from './components/TaskTodayWidget';

export const sharedWorker = new SharedWorker('/shared.worker.js');

export default () => {
  const dispatch = useDispatch();
  const { sessionId } = useContext(UserContext);

  useEffect(() => {
    sharedWorker.port.start();
    sharedWorker.port.onmessage = ({ data }) => dispatch(data);

    // eslint-disable-next-line no-console
    sharedWorker.port.onmessageerror = (e) => console.log(e);
  }, []);

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
        <button
          type="button"
          onClick={async () => {
            try {
              const response = await fetch('/api/tasks/12345');
              console.info(response);
              if (response.ok) {
                const max = await response.text();
                console.info(max);
              }
            } catch (error) {
              console.info(error);
            }
            // console.info(res);
          }}
        >
          get
        </button>

        <Switch>
          <Route
            path={['/', '/task']}
          >
            <TaskTodayWidget />
            <Route
              path="/"
              exact
              component={TaskList}
            />
            <Route
              path="/task-edit/:id"
              component={TaskEdit}
            />
            <Route
              path="/task-create"
              exact
              component={TaskCreate}
            />
          </Route>

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
