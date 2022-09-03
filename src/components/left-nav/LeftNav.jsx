import React, {Component} from 'react';
import {Link, withRouter} from "react-router-dom";
import {
    AppstoreOutlined, UserOutlined, CheckCircleOutlined, HomeOutlined, AreaChartOutlined, UnorderedListOutlined,
    ToolOutlined, BarChartOutlined, LineChartOutlined, PieChartOutlined
} from '@ant-design/icons';
import {Menu} from 'antd';

import './LeftNav.less'
import logo from '../../assets/img/logo.png'
import memoryUtils from "../../utils/memoryUtils";

class LeftNav extends Component {
    state = {
        items: [],//菜单项数组，包含当前用户可访问的菜单信息
        itemParams: [
            {label: '首页', key: '/home', icon: <HomeOutlined/>},
            {label: '品类管理', key: '/category', icon: <UnorderedListOutlined/>},
            {label: '商品管理', key: '/products', icon: <ToolOutlined/>},
            {label: '用户管理', key: '/user', icon: <UserOutlined/>},
            {label: '角色管理', key: '/role', icon: <CheckCircleOutlined/>},
            {label: '柱形图', key: '/charts/barchart', icon: <BarChartOutlined/>},
            {label: '折线图', key: '/charts/linechart', icon: <LineChartOutlined/>},
            {label: '饼图', key: '/charts/piechart', icon: <PieChartOutlined/>},
        ],
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

    componentDidMount() {
        this.initMenuItems();
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

    getItem = (label, key, icon, children, type) => {
        return {key, icon, children, label, type};
    }

    //根据用户权限，设置菜单访问权限
    initMenuItems = () => {
        const curUser = memoryUtils.user;//当前登陆的用户
        if (curUser.username === "admin") {//当前用户是管理员admin，授予所有菜单的访问权限
            this.initAdminMenus();
            return;
        }
        //非管理员用户，根据用户的menus数组授予权限
        const curUserMenus = curUser.role.menus;//当前用户的可访问菜单key数组
        const {itemParams} = this.state;//菜单参数数组
        const items = [];
        itemParams.forEach(param => {
            //当前菜单key不在用户的可访问菜单key数组中，直接返回
            if (curUserMenus.indexOf(param.key) === -1) {
                return;
            }
            //当前用户可访问此菜单，则将菜单对象加入items数组中
            let fatherMenu = null;
            switch (param.key) {
                //有子菜单权限，则一定要有父菜单权限
                case"/category":
                case"/products":
                    //检查父菜单是否已添加
                    fatherMenu = items.find(it => it.key === "/prodCate");//寻找父菜单
                    if (!fatherMenu) {//父菜单不存在时，添加父菜单
                        items.push(this.getItem("商品", "/prodCate", <AppstoreOutlined/>, [
                            this.getItem(param.label, param.key, param.icon)//同时将子菜单添加
                        ]));
                    } else {//父菜单已存在，则直接添加子菜单
                        fatherMenu.children.push(this.getItem(param.label, param.key, param.icon));
                    }
                    break;
                case"/charts/barchart":
                case"/charts/linechart":
                case"/charts/piechart":
                    fatherMenu = items.find(it => it.key === "/charts");
                    if (!fatherMenu) {//父菜单不存在时，添加父菜单
                        items.push(this.getItem("图形图表", "/charts", <AreaChartOutlined/>, [
                            this.getItem(param.label, param.key, param.icon)//同时将子菜单添加
                        ]));
                    } else {//父菜单已存在，则直接添加子菜单
                        fatherMenu.children.push(this.getItem(param.label, param.key, param.icon));
                    }
                    break;
                default://当前菜单不是子菜单，直接添加
                    items.push(this.getItem(param.label, param.key, param.icon));
                    break;
            }
        });
        this.setState({items});//更新state
    }

    initAdminMenus = () => {
        //admin用户可访问所有菜单
        const items = [
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
        ];
        this.setState({items});
    }
}

export default withRouter(LeftNav);