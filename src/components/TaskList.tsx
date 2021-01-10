import React, { useContext, useState, useEffect } from 'react';
import {
  Typography, message, Spin, Card, Col, Row,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getTasks } from '../api';
import UserContext from '../context/UserContext';

type Task = {
  id: string,
  title: string,
  description: string,
  date: string,
}

type TaskResponse = {
  type: string;
  message: Task[] | string;
  prevState: null
};

const { Title } = Typography;

export default () => {
  const { sessionId } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[] | null>(null);

  useEffect(() => {
    getTasks(sessionId)
      .then((response) => {
        const taskResponse = (response as TaskResponse).message;
        if (taskResponse instanceof Array) {
          setTasks(taskResponse);
        } else {
          message.error(taskResponse);
        }
        setLoading(false);
      })
      .catch((error) => {
        message.error(error.toString());
        setLoading(false);
      });
  }, []);

  return (
    <Spin spinning={loading}>
      <div className="TaskList">
        <Row gutter={[16, 16]}>
          {tasks != null && tasks.map((task) => (
            <Col
              span={8}
              key={task.id}
            >
              <Card
                title={task.title}
                extra={
                  <Link to={`edit/${task.id}`}><EditOutlined key="edit" /></Link>
                }
              >
                {task.description}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Spin>
  );
};
