import React, { useContext } from 'react';
import {
  Route, Switch, Redirect, RouteProps,
} from 'react-router-dom';
import { Layout } from 'antd';
import './App.scss';

import UserContext from './context/UserContext';
import Login from './components/Login';
import Registration from './components/Registration';
import Restore from './components/Restore';
import NotFound from './components/NotFound';
import Home from './components/Home';

interface PrivateRouteProps extends RouteProps {
  allowed?: boolean,
  redirectTo?: string
}

const App: React.FC = () => {
  const { sessionId } = useContext(UserContext);

  const defaultRouteProps = {
    allowed: sessionId != null,
    redirectTo: '/login',
  };

  const authRouteProps = {
    allowed: sessionId == null,
    redirectTo: '/',
  };

  const PrivateRoute = ({
    component: Component,
    allowed = sessionId != null,
    redirectTo = '/login',
    ...rest
  }: PrivateRouteProps) => {
    if (!Component) return null;
    return (
      <Route
        {...rest}
        render={(props) => (allowed
          ? <Component {...props} /> : <Redirect to={redirectTo} />)}
      />
    );
  };

  return (
    <Layout>
      <Switch>
        <PrivateRoute
          {...authRouteProps}
          path="/login"
          component={Login}
        />
        <PrivateRoute
          {...authRouteProps}
          path="/registration"
          component={Registration}
        />
        <PrivateRoute
          {...authRouteProps}
          path="/restore"
          component={Restore}
        />

        <PrivateRoute
          {...defaultRouteProps}
          path="/"
          exact
          component={Home}
        />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
};

export default App;
