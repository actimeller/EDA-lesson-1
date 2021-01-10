import React, { useContext, useState } from 'react';
import {
  Typography, Form, Input, Button, Result, Spin, message,
} from 'antd';
import { Link } from 'react-router-dom';
import { valueType } from 'antd/lib/statistic/utils';
import { getUser, editUser } from '../api';
import UserContext from '../context/UserContext';

type CustomInputProps = {
  value?: string;
  id?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

type EditResponse = {
  type: string;
  message: string
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};

const { Title } = Typography;

const CustomInput = ({ value, id, onChange }: CustomInputProps) => {
  switch (id) {
    case 'password': return <Input.Password value={value} onChange={onChange} />;
    case 'photo': return (
      <div>
        <div className="Profile__photo" style={{ backgroundImage: `url(${value})` }} />
        <Input value={value} onChange={onChange} />
      </div>
    );
    case 'login': return <Input value={value} onChange={onChange} disabled />;
    default: return <Input value={value} onChange={onChange} />;
  }
};

export default () => {
  const { sessionId } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const user = getUser(sessionId);

  const onFinish = (data: any) => {
    setLoading(true);
    editUser(sessionId, data)
      .then((response) => {
        message.success((response as EditResponse).message);
        setLoading(false);
      })
      .catch((error) => {
        message.error(error.toString());
        setLoading(false);
      });
  };

  if (!user) {
    return (
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={<Link to="/"><Button type="primary">Back Home</Button></Link>}
      />
    );
  }

  return (
    <Spin spinning={loading}>
      <div className="Profile">
        <Title level={2}>Profile</Title>
        <Form
          {...layout}
          onFinish={onFinish}
        >
          {Object.entries(user)
            .filter(([key]) => key !== 'tasks')
            .map(([key, value]: [key:string, value: string]) => (
              <Form.Item
                name={key}
                label={key}
                key={key}
                initialValue={value}
              >
                <CustomInput />
              </Form.Item>
            ))}
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
};
