import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom'
import {Layout} from 'antd';

import memoryUtils from '../../utils/memoryUtils';
import LeftNav from '../../components/left-nav/LeftNav'
import Header from '../../components/header/Header'
import Home from '../home/home'
import Category from '../category/category'
import Products from '../product/products'
import User from '../user/User'
import Role from '../role/Role'
import BarChart from '../charts/barchart'
import LineChart from '../charts/linechart'
import PieChart from '../charts/piechart'

import './admin.less'

const {Footer, Sider, Content} = Layout;

// 登陆的路由组件
class Admin extends Component {
    render() {
        const loginUser = memoryUtils.user;
        if (!loginUser || !loginUser._id) {// 没有已登陆的用户，自动跳转到登陆
            // 在render()中跳转，使用<Redirect/>
            return <Redirect to='/login'/>
        }
        return (
            <Layout className='layout'>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header/>
                    <Content className='content'>
                        <Switch>
                            <Route path="/home" component={Home}/>
                            <Route path="/category" component={Category}/>
                            <Route path="/products" component={Products}/>
                            <Route path="/user" component={User}/>
                            <Route path="/role" component={Role}/>
                            <Route path="/charts/barchart" component={BarChart}/>
                            <Route path="/charts/linechart" component={LineChart}/>
                            <Route path="/charts/piechart" component={PieChart}/>
                            <Redirect to="/home"/>
                        </Switch>
                    </Content>
                    <Footer className='footer'>推荐使用谷歌浏览器，可获得更佳使用体验</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default Admin;