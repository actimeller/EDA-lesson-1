import React, { useContext, useEffect, useState } from 'react';
import {
  Typography, Form, Input, Button, Result, Spin, message, Select,
} from 'antd';
import { Link, useParams } from 'react-router-dom';
import { getTask, editTask, ITask } from '../api';
import UserContext from '../context/UserContext';

type CustomInputProps = {
  value?: string;
  id?: string;
  onChange?: (event: React.ChangeEvent | string) => void
}

type TaskResponse = {
  type: string;
  message: ITask
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};

const { Title } = Typography;

const CustomInput = ({ value, id, onChange = () => {} }: CustomInputProps) => {
  switch (id) {
    case 'description': return <Input.TextArea value={value} onChange={onChange} rows={4} />;
    case 'priority': return (
      <Select
        value={value}
        style={{ width: '100%' }}
        placeholder={id}
        onChange={(newValue: string) => onChange(newValue)}
      >
        <Select.Option value="low">Low</Select.Option>
        <Select.Option value="high">High</Select.Option>
      </Select>
    );
    default: return <Input value={value} onChange={onChange} />;
  }
};

export default () => {
  const { sessionId } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<ITask | undefined>();
  const params = useParams();
  const taskId = (params as {id: string}).id;

  useEffect(() => {
    setLoading(true);
    getTask(sessionId, taskId)
      .then((response) => {
        setTask((response as TaskResponse).message);
        setLoading(false);
      })
      .catch((error) => {
        message.error(error.toString());
        setLoading(false);
      });
  }, []);

  const onFinish = (data: ITask) => {
    setLoading(true);
    editTask(sessionId, { ...data, id: taskId })
      .then((response) => {
        message.success((response as TaskResponse).message);
        setLoading(false);
      })
      .catch((error) => {
        message.error(error.toString());
        setLoading(false);
      });
  };

  if (!loading && !task) {
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
      <div className="TaskEdit">
        <Title level={2}>Edit task</Title>
        <Form
          {...layout}
          onFinish={onFinish}
        >
          {task && Object.entries(task)
            .filter(([key]) => key !== 'id')
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
