import {
  Switch, Route,
} from 'react-router-dom';
import Login from './Login';
import Registration from './Registration';
import Restore from './Restore';

const LoginPage = () => (
  <div className="LoginPage">
    LoginPage
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
    </Switch>
  </div>
);

export default LoginPage;
