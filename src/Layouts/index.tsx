import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,


} from '@ant-design/icons';

import './index.less'

import { Link, useHistory } from 'react-router-dom';
import { menuList } from '@/router';

const { Header, Sider, Content } = Layout;




export default function Layouts(props: any) {
    const [collapsed, setCollapsed] = useState(false)
    const [defaultKey, setDefaultKey] = useState(['']);
    const history = useHistory();
    const toggle = () => {
        setCollapsed(!collapsed)
    };
    useEffect(() => {
        const pathname = history.location.pathname;
        console.log([pathname]);

        setDefaultKey([pathname])


    }, [history.location.pathname]);

    return (
        <Layout className='layouts'>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <Menu theme="dark" mode="inline" selectedKeys={defaultKey}>
                    {menuList.map(item => {
                        return (
                            <Menu.Item key={item.path} icon={item.icon} onClick={() => setDefaultKey([item.path])}>
                                <Link to={item.path}>{item.name}</Link>
                            </Menu.Item>
                        );
                    })}

                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: toggle,
                    })}
                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    {props.children}

                </Content>
            </Layout>
        </Layout>
    )
}
