import React, { useContext, useState } from 'react';
import {
  Card, Form, Input, Button, Spin, message,
} from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { authorization } from '../api';
import { UserContext } from '../context/UserContext';

type AuthorizationResponse = {
  type: string; message: string
}

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { setSessionId } = useContext(UserContext);

  const onFinish = (credentials : {login: string, keyword: string}) => {
    setLoading(true);
    authorization(credentials)
      .then((response) => {
        setSessionId((response as AuthorizationResponse).message);
      })
      .catch((error) => {
        message.error(error.toString());
        setLoading(false);
      });
  };

  return (
    <div className="LoginPage">
      <Spin spinning={loading}>
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
              <Link className="LoginPage--forgot" to="/restore">
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
      </Spin>
    </div>
  );
};

export default Login;