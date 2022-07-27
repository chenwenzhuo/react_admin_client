import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'

import memoryUtils from '../../utils/memoryUtils';

// 登陆的路由组件
class Admin extends Component {
    render() {
        const loginUser = memoryUtils.user;
        if (!loginUser || !loginUser._id) {// 没有已登陆的用户，自动跳转到登陆
            // 在render()中跳转，使用<Redirect/>
            return <Redirect to='/login'/>
        }
        return (
            <div>
                Hello,{loginUser.username}
            </div>
        );
    }
}

export default Admin;