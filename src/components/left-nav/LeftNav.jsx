import React, {Component} from 'react';
import {Link, withRouter} from "react-router-dom";
import {
    AppstoreOutlined, UserOutlined, CheckCircleOutlined, HomeOutlined, AreaChartOutlined, UnorderedListOutlined,
    ToolOutlined, BarChartOutlined, LineChartOutlined, PieChartOutlined
} from '@ant-design/icons';
import {Menu} from 'antd';

import './LeftNav.less'
import logo from '../../assets/img/logo.png'

class LeftNav extends Component {
    getItem = (label, key, icon, children, type) => {
        return {key, icon, children, label, type};
    }

    state = {
        items: [
            this.getItem('首页', '/home', <HomeOutlined/>),
            this.getItem('商品', '/prodCate', <AppstoreOutlined/>, [
                this.getItem('品类管理', '/category', <UnorderedListOutlined/>),
                this.getItem('商品管理', '/products', <ToolOutlined/>)
            ]),
            this.getItem('用户管理', '/user', <UserOutlined/>),
            this.getItem('角色管理', '/role', <CheckCircleOutlined/>),
            this.getItem('图形图表', '/charts', <AreaChartOutlined/>, [
                this.getItem('柱形图', '/charts/barchart', <BarChartOutlined/>),
                this.getItem('折线图', '/charts/linechart', <LineChartOutlined/>),
                this.getItem('饼图', '/charts/piechart', <PieChartOutlined/>),
            ]),
        ]
    };

    render() {
        const {items} = this.state;
        let curPath = this.props.location.pathname;//当前菜单路径
        if (curPath.indexOf("/products") === 0) {//若当前请求的是/products或其子路由界面
            curPath = "/products";//将curPath值改为/products，使得进入子路由界面后leftNav中菜单项也能选中
        }
        //查找当前菜单项的父菜单
        const curItem = items.find(item => {
            if (!item.children) {
                return false;
            }
            return (item.children.find(it => it.key === curPath) !== undefined);
        });
        return (
            <div className='left-nav'>
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt="logo"/>
                    <h2>硅谷后台</h2>
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                    items={items}
                    selectedKeys={[curPath]}
                    defaultOpenKeys={curItem ? [curItem.key] : []}
                    onClick={(itemInfo) => {
                        this.handleMenuClick(itemInfo);
                    }}
                />
            </div>
        );
    }

    handleMenuClick = (itemInfo) => {
        const {items} = this.state;
        const menuKey = itemInfo.key;
        const menuItem = items.find(item => {
            return item.key === menuKey ||
                (item.children ? item.children.find(it => it.key === menuKey) : false);
        });
        let menuName = menuItem.children ?
            menuItem.children.find(item => item.key === menuKey).label : menuItem.label;
        this.props.history.push(itemInfo.key, {menuName});
    }
}

export default withRouter(LeftNav);