import React, { useContext, useState } from 'react';
import {
  Card, Form, Input, Button, Spin, message,
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { restore } from '../api';
import UserContext from '../context/UserContext';

export default () => {
  const [loading, setLoading] = useState(false);
  const { setSessionId } = useContext(UserContext);
  const history = useHistory();

  const onFinish = (credentials : {login: string, keyword: string}) => {
    setLoading(true);
    restore(credentials)
      .then((response) => {
        setSessionId(response.message);
        history.push('/');
      })
      .catch((error) => {
        message.error(error.toString());
        setLoading(false);
      });
  };

  return (
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
  );
};
