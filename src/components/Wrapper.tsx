import React, { useContext } from 'react';
import {
  Layout, Menu, Dropdown,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useHistory, Link } from 'react-router-dom';
import UserContext from '../context/UserContext';

const { Header, Content } = Layout;

export default ({ children }: {children: React.ReactNode}) => {
  const { setSessionId } = useContext(UserContext);
  const history = useHistory();

  const logout = () => {
    setSessionId(null);
    history.push('/login');
  };

  return (
    <>
      <Header className="Header">
        <Link to="/">Home</Link>
        <Dropdown overlay={(
          <Menu>
            <Menu.Item>
              <Link to="/profile">Profile</Link>
            </Menu.Item>
            <Menu.Item onClick={logout}>
              Logout
            </Menu.Item>
          </Menu>
      )}
        >
          <UserOutlined />
        </Dropdown>
      </Header>
      <Content className="Content">
        {children}
      </Content>
    </>
  );
};

// export default Main;
