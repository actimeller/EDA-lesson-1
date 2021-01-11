import React, { useContext, useState, useEffect } from 'react';
import {
  message, Spin, Card, Col, Row, Input, Select, Empty, Tabs, Button,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getFilteredTasks, ITask, ITaskFilter } from '../api';
import UserContext from '../context/UserContext';

type TaskResponse = {
  type: string;
  message: ITask[] | string;
};
const { TabPane } = Tabs;

export default () => {
  const { sessionId } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [filter, setFilter] = useState<ITaskFilter>({
    title: '',
    priority: undefined,
    date: '',
  });

  const onTitleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => setFilter({
    ...filter,
    title: event.target.value,
  });

  const onPriorityFilterChange = (value: any) => setFilter({
    ...filter,
    priority: value || null,
  });

  const onDateFilterChange = (value: string) => setFilter({
    ...filter,
    date: value,
  });

  const onFilterReset = () => setFilter({
    ...filter,
    priority: undefined,
    title: '',
  });

  useEffect(() => {
    setLoading(true);
    getFilteredTasks(sessionId, filter)
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
  }, [filter]);

  return (
    <Spin spinning={loading}>
      <div className="TaskList">
        <Row gutter={56}>
          <Col span={4}>
            <Card
              title="Filter"
              extra={(
                <Button type="link" onClick={onFilterReset}>
                  Reset filters
                </Button>
              )}
            >
              <Input
                value={filter.title}
                placeholder="Task title"
                onChange={onTitleFilterChange}
              />

              <Select
                value={filter.priority}
                style={{ width: '100%', marginTop: '16px' }}
                placeholder="Priority"
                allowClear
                onChange={onPriorityFilterChange}
              >
                <Select.Option value="low">Low</Select.Option>
                <Select.Option value="high">High</Select.Option>
              </Select>
            </Card>
          </Col>
          <Col span={20}>

            <Row gutter={[16, 16]}>
              <Col span={22}>
                <Tabs defaultActiveKey="" onChange={onDateFilterChange}>
                  <TabPane tab="All tasks" key="" />
                  <TabPane tab="Tasks for today" key="today" />
                </Tabs>
              </Col>
              <Col span={2}>
                <Link to="/task-create">
                  <Button type="primary">Create task</Button>
                </Link>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              {tasks.map((task) => (
                <Col
                  span={8}
                  key={task.id}
                >
                  <Card
                    title={task.title}
                    extra={
                      <Link to={`/task-edit/${task.id}`}><EditOutlined key="edit" /></Link>
                    }
                    style={task.priority === 'high' ? { border: '1px solid red' } : undefined}
                  >
                    {task.description}
                  </Card>
                </Col>
              ))}
              {(tasks.length === 0 && !loading) && (
                <Empty
                  style={{ width: '100%' }}
                  description="Nothing found"
                />
              )}
            </Row>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};
