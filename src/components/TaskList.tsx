import React, {
  useContext, useState, useEffect, useCallback, useRef,
} from 'react';
import {
  message, Spin, Card, Col, Row, Input, Select, Empty, Tabs, Button, Dropdown, Menu, Tag,
} from 'antd';
import { DeleteOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import {
  editTask,
  getFilteredTasks, removeTask, Task, TaskFilter,
} from '../api';
import UserContext from '../context/UserContext';
import { connectionChecker, debounce, getStatusColor } from '../utils';
import { setTasks } from '../store/tasks/actions';

const { TabPane } = Tabs;

const isFilterEmpty = (filter: TaskFilter) => Object.entries(filter)
  .reduce((total, [key, value]) => {
    if (key === 'title') return total && value === '';
    return total && value == null;
  }, true);

export default () => {
  const { tasks } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  const { sessionId } = useContext(UserContext);

  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TaskFilter>({
    title: '',
  });
  const filterRef = useRef<TaskFilter>();
  filterRef.current = filter;

  const onTitleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => setFilter({
    ...filter,
    title: event.target.value,
  });

  const onTypeFilterChange = (value: Task['type']) => setFilter({
    ...filter,
    type: value || null,
  });

  const onStatusFilterChange = (value: Task['status']) => setFilter({
    ...filter,
    status: value || null,
  });

  const onDateFilterChange = (value: string) => {
    setFilter({
      ...filter,
      plannedStartDate: value === 'today' ? +moment().startOf('day') : undefined,
      plannedEndDate: value === 'today' ? +moment().endOf('day') : undefined,
    });
  };

  const onFilterReset = () => setFilter({
    ...filter,
    type: undefined,
    status: undefined,
    title: '',
  });

  const onTaskRemove = async (task: Task) => {
    setLoading(true);
    try {
      const response = await removeTask(sessionId, task);
      setTasks(response.data);
      dispatch(setTasks(response.data));
      setLoading(false);
    } catch (error) {
      message.error(error.toString());
    }
  };

  const onTaskStatusChange = async (task: Task, status: Task['status']) => {
    setLoading(true);
    try {
      const response = await editTask(sessionId, {
        ...task,
        status,
      });
      message.success(response.message);
      dispatch(setTasks(response.data));
      setLoading(false);
    } catch (error) {
      message.error(error.toString());
      setLoading(false);
    }
  };

  const fetchFilteredTasks = async () => {
    if (!filterRef.current) return;
    if (isFilterEmpty(filterRef.current)) setFilteredTasks(tasks);
    setLoading(true);
    try {
      const response = await connectionChecker(
        getFilteredTasks(sessionId, filterRef.current), fetchFilteredTasks,
      );
      setFilteredTasks(response.data);
      setLoading(false);
    } catch (error) {
      message.error(error.toString());
    }
  };

  const debouncedFetchFilteredTasks = useCallback(
    debounce(fetchFilteredTasks, 300),
    [],
  );

  useEffect(() => {
    debouncedFetchFilteredTasks();
  }, [filter, tasks]);

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
                onChange={onTypeFilterChange}
              >
                <Select.Option value="default">Default</Select.Option>
                <Select.Option value="urgent">Urgent</Select.Option>
                <Select.Option value="outdated">Outdated</Select.Option>
              </Select>

              <Select
                value={filter.status}
                style={{ width: '100%', marginTop: '16px' }}
                placeholder="status"
                allowClear
                onChange={onStatusFilterChange}
              >
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="planned">Planned</Select.Option>
                <Select.Option value="finished">Finished</Select.Option>
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
              {filteredTasks.map((task) => (
                <Col
                  span={8}
                  key={task.id}
                >
                  <Card
                    className="TaskListCard"
                    title={task.title}
                    extra={[
                      <Tag key={task.id} color={getStatusColor(task.status)}>
                        {task.status}
                      </Tag>,
                    ]}
                    actions={[
                      <Link to={`/task-edit/${task.id}`}><EditOutlined key="edit" /></Link>,
                      <DeleteOutlined key="remove" onClick={() => onTaskRemove(task)} />,
                      <Dropdown overlay={(
                        <Menu onClick={(item) => onTaskStatusChange(task, (item.key as Task['status']))}>
                          <Menu.Item key="active">Set as active</Menu.Item>
                          <Menu.Item key="planned">Set as planned</Menu.Item>
                          <Menu.Item key="finished">Set as finished</Menu.Item>
                        </Menu>
                        )}
                      >
                        <EllipsisOutlined key="ellipsis" />
                      </Dropdown>,
                    ]}
                    style={task.type === 'urgent' ? { border: '1px solid red' } : undefined}
                  >
                    {task.description}
                  </Card>
                </Col>
              ))}
              {(filteredTasks.length === 0 && !loading) && (
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
