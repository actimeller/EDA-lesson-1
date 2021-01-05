import React, { useContext, useState } from 'react';
import {
  Card, Form, Input, Button, Spin, message,
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { registration } from '../api';
import { UserContext } from '../context/UserContext';

type AuthorizationResponse = {
  type: string; message: string
}

const Registration = () => {
  const [loading, setLoading] = useState(false);
  const { setSessionId } = useContext(UserContext);

  const onFinish = (credentials : {login: string, password: string}) => {
    setLoading(true);
    registration(credentials)
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
      </Spin>
    </div>
  );
};

export default Registration;
