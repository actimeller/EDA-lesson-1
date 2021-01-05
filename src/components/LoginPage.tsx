import React, { useContext } from 'react';
import {
  Card, Form, Input, Button,
} from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { authorization } from '../api';
import { UserContext } from '../context/UserContext';

type ChildrenPropsTypes = {
  onFinish: (values: any) => void
};

type AuthorizationResponse = {
  type: string; message: string
}

const Login = () => {
  const { setSessionId } = useContext(UserContext);
  const onFinish = (credentials : {login: string, password: string}) => {
    authorization(credentials)
      .then((res) => setSessionId((res as AuthorizationResponse).message))
      .catch((err) => console.info(err));
  };
  return (
    <Card title="Login">
      <Form
        onFinish={onFinish}
      >
        <Form.Item
          name="login"
          rules={[
            {
              required: true,
              message: 'Please input your Username!',
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Link className="LoginPage--forgot" to="/forgot">
            Forgot password
          </Link>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="LoginPage--button">
            Log in
          </Button>
          Or
          {' '}
          <Link to="/registration">register now!</Link>
        </Form.Item>
      </Form>
    </Card>
  );
};

const Registration = ({ onFinish }: ChildrenPropsTypes) => (
  <Card title="Registration">
    <Form
      onFinish={onFinish}
    >
      <Form.Item
        name="login"
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item
        name="confirm"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              // eslint-disable-next-line prefer-promise-reject-errors
              return Promise.reject('The two passwords that you entered do not match!');
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Confirm Password"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="LoginPage--button">
          Registration
        </Button>
      </Form.Item>
    </Form>
  </Card>
);

const Forgot = ({ onFinish }: ChildrenPropsTypes) => (
  <Card title="Forgot">
    <Form
      onFinish={onFinish}
    >
      <Form.Item
        name="login"
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username or email"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="LoginPage--button">
          Restore password
        </Button>
      </Form.Item>
    </Form>
  </Card>
);

const LoginPage = () => {
  const onFinish = (values: Object) => {
    console.log('Received values of form: ', values);
  };

  const renderLoginPageChildren = () => {
    // todo: change to switch
    switch (useLocation().pathname) {
      case '/login': return <Login />;
      case '/registration': return <Registration onFinish={onFinish} />;
      case '/forgot': return <Forgot onFinish={onFinish} />;
      default: return null;
    }
  };

  return (
    <div className="LoginPage">
      {renderLoginPageChildren()}
    </div>
  );
};

export default LoginPage;
