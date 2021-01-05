import React, { useContext } from 'react';
import {
  Layout, Menu, Breadcrumb, Dropdown,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import UserContext from '../context/UserContext';

const { Header, Content } = Layout;

const Home = () => {
  const { setSessionId } = useContext(UserContext);

  return (
    <>
      <Header className="Header">
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
        <Dropdown overlay={(
          <Menu>
            <Menu.Item onClick={() => setSessionId(null)}>
              Logout
            </Menu.Item>
          </Menu>
      )}
        >
          <UserOutlined />
        </Dropdown>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content">Content</div>
      </Content>
    </>
  );
};

export default Home;
