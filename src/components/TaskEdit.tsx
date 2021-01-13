import React, { useContext, useEffect, useState } from 'react';
import {
  Button, Result, Spin, message,
} from 'antd';
import { Link, useParams } from 'react-router-dom';
import {
  getTask, editTask, Task,
} from '../api';
import UserContext from '../context/UserContext';
import TaskForm from './TaskForm';

export default () => {
  const { sessionId } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<Task | undefined>();
  const params = useParams<{id: string}>();
  const taskId = (params).id;

  useEffect(() => {
    setLoading(true);
    getTask(sessionId, taskId)
      .then((response) => {
        setTask(response.message);
        setLoading(false);
      })
      .catch((error) => {
        message.error(error.toString());
        setLoading(false);
      });
  }, []);

  const onFinish = (data: Task) => {
    setLoading(true);
    editTask(sessionId, { ...data, id: taskId })
      .then((response) => {
        message.success(response.message);
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
      {task && (
        <TaskForm
          title="Edit Task"
          onFinish={onFinish}
          task={task}
        />
      )}
    </Spin>
  );
};
