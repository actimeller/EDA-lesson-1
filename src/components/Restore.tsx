import React, { useContext, useState } from 'react';
import {
  Card, Form, Input, Button, Spin, message,
} from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { restore } from '../api';
import { UserContext } from '../context/UserContext';

type AuthorizationResponse = {
  type: string; message: string
}

const Restore = () => {
  const [loading, setLoading] = useState(false);
  const { setSessionId } = useContext(UserContext);

  const onFinish = (credentials : {login: string, password: string}) => {
    setLoading(true);
    restore(credentials)
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
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="keyword"
              rules={[
                {
                  required: true,
                  message: 'Please input your keyword!',
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Keyword"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="LoginPage--button">
                Restore password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </div>
  );
};

export default Restore;
