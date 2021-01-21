import React, {
  useContext, useState, useEffect, useCallback, useRef,
} from 'react';
import {
  message, Spin, Card, Col, Row, Input, Select, Empty, Tabs, Button,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { getFilteredTasks, Task, TaskFilter } from '../api';
import UserContext from '../context/UserContext';
import { connectionChecker, debounce } from '../utils';

const { TabPane } = Tabs;

export default () => {
  const { sessionId } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>({
    title: '',
  });
  const filterRef = useRef<TaskFilter>();
  filterRef.current = filter;

  const onTitleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => setFilter({
    ...filter,
    title: event.target.value,
  });

  const ontypeFilterChange = (value: Task['type']) => setFilter({
    ...filter,
    type: value || null,
  });

  const onDateFilterChange = (value: string) => {
    setFilter({
      ...filter,
      plannedStartDate: value === 'today' ? +moment().startOf('day') : undefined,
    });
  };

  const onFilterReset = () => setFilter({
    ...filter,
    type: undefined,
    title: '',
  });

  const fetchTasks = async () => {
    if (!filterRef.current) return;
    setLoading(true);
    try {
      const response = await connectionChecker(
        getFilteredTasks(sessionId, filterRef.current), fetchTasks,
      );
      const filteredTasksResponse = response.message;
      setTasks(filteredTasksResponse);
      setLoading(false);
    } catch (error) {
      message.error(error.toString());
    }
  };

  const debouncedFetchTasks = useCallback(
    debounce(fetchTasks, 300),
    [],
  );

  useEffect(() => {
    debouncedFetchTasks();
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
                value={filter.type}
                style={{ width: '100%', marginTop: '16px' }}
                placeholder="type"
                allowClear
                onChange={ontypeFilterChange}
              >
                <Select.Option value="default">Default</Select.Option>
                <Select.Option value="urgent">Urgent</Select.Option>
                <Select.Option value="outdated">Outdated</Select.Option>
              </Select>
            </Card>
          </Col>
          <Col span={20}>
            <Row gutter={[16, 16]}>
              <Col span={22}>
                <Tabs
                  defaultActiveKey=""
                  onChange={onDateFilterChange}
                >
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
                    style={task.type === 'urgent' ? { border: '1px solid red' } : undefined}
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
