import React, { useContext, useEffect, useState } from 'react';
import {
  Button, Result, Spin, message,
} from 'antd';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  getTask, editTask, Task, removeTask,
} from '../api';
import UserContext from '../context/UserContext';
import TaskForm from './TaskForm';
import { setTasks } from '../store/tasks/actions';

export default () => {
  const dispatch = useDispatch();
  const { sessionId } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<Task | undefined>();
  const params = useParams<{id: string}>();
  const taskId = (params).id;
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    getTask(sessionId, taskId)
      .then((response) => {
        setTask(response.data);
        setLoading(false);
      })
      .catch((error) => {
        message.error(error.toString());
        setLoading(false);
      });
  }, []);

  const onFinish = async (data: Task) => {
    setLoading(true);
    const newData = { ...data, id: taskId };
    try {
      const response = await editTask(sessionId, newData);
      message.success(response.message);
      dispatch(setTasks(response.data));
      setLoading(false);
    } catch (error) {
      message.error(error.toString());
      setLoading(false);
    }
  };

  const onTaskRemove = async (data: Task) => {
    setLoading(true);
    try {
      const response = await removeTask(sessionId, data);
      dispatch(setTasks(response.data));
      setLoading(false);
      history.push('/');
    } catch (error) {
      message.error(error.toString());
    }
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
          onTaskRemove={onTaskRemove}
          task={task}
        />
      )}
    </Spin>
  );
};
