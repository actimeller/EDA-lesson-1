import { useContext, useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getFilteredTasks, Task } from '../api';
import UserContext from '../context/UserContext';
import { setTodayTasks } from '../store/tasks/actions';
import { RootState } from '../store';

const TaskItem = ({ task }: {task: Task}) => (
  <Link
    to={`/task-edit/${task.id}`}
    className="TaskTodayWidget-item"
  >
    {task.title}
  </Link>
);

export default () => {
  const dispatch = useDispatch();
  const { todayTasks } = useSelector((state: RootState) => state.tasks);

  const { sessionId } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const grid = [];
  for (let i = 0; i <= 24; i += 1) {
    grid.push(`${i < 10 ? '0' : ''}${i}:00`);
  }

  const fetchTasks = async () => {
    setLoading(true);
    const filterTodayTasks = {
      plannedStartDate: +moment().startOf('day'),
      plannedEndDate: +moment().endOf('day'),
    };
    try {
      const response = await getFilteredTasks(sessionId, filterTodayTasks);
      dispatch(setTodayTasks(response.data));
      setLoading(false);
    } catch (error) {
      message.error(error.toString());
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Spin spinning={loading}>
      <div className="TaskTodayWidget">
        <div className="TaskTodayWidget-grid">
          {grid.map((item) => <span key={item}>{item}</span>)}
        </div>
        Tasks for today
        <div className="TaskTodayWidget-list">
          {todayTasks.map((task) => <TaskItem key={task.id} task={task} />)}
        </div>

      </div>
    </Spin>
  );
};
