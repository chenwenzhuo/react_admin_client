import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {Form, Input, Button, message} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';

import {reqLogin} from '../../api/ajaxReqs';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';

import './login.less'
import logo from './img/logo.png'

// 登陆的路由组件
class Login extends Component {
    formRef = React.createRef();

    render() {
        // 若用户已登陆，跳转到管理界面
        const loginUser = memoryUtils.user;
        if (loginUser && loginUser._id) {
            // 在render()中跳转，使用<Redirect/>
            return <Redirect to='/'/>
        }

        return (<div className="login">
            <div className="login-header">
                {/*React中不支持直接使用相对路径引用图片*/}
                {/*<img src="./img/logo.png" alt="logo" className="logo"/>*/}
                {/*需要先将图片import为一个变量，再使用*/}
                <img src={logo} alt="logo" className="login-logo"/>
                <h1 className="login-title">React项目：后台管理系统</h1>
            </div>
            <div className="login-content">
                <h2 className="form-title">用户登陆</h2>
                <Form onFinish={this.handleSubmit} className="login-form" ref={this.formRef}>
                    {/*对用户名进行声明式校验*/}
                    <Form.Item name='username' rules={[{required: true, message: '请输入用户名！'}, {
                        min: 4, message: '用户名不少于4位！'
                    }, {max: 12, message: '用户名不多于12位！'}, {
                        pattern: /^[a-zA-Z0-9_]+$/, message: '用户名应由字母、数字、下划线组成！'
                    },]}>
                        <Input
                            prefix={<UserOutlined/>}
                            placeholder="用户名"
                        />
                    </Form.Item>
                    {/*密码进行自定义校验*/}
                    <Form.Item name='password' rules={[{validator: this.validatePwd}]}>
                        <Input
                            prefix={<LockOutlined/>}
                            type="password"
                            placeholder="密码"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登陆
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>);
    }

    handleSubmit = async loginData => {
        console.log("click submit");
        console.log(loginData);
        console.log("this.formRef", this.formRef);
        // 直接使用axios发送请求
        /*axios.post("http://localhost:3000/ajaxProxy/login", {
            "username": loginData.username,
            "password": loginData.password
        }).then(response => {
            console.log("response", response);
            //无论用户名密码是否正确，只要网络请求成功，就会执行此成功函数
            //需要根据返回的状态码判断登陆是否成功
            if (response.data.status !== 0) {//登陆失败，抛出异常
                throw response.data.msg;
            }
            this.props.history.push("/");
        }).catch(error => {
            // 登陆失败处理
            console.log("error", error);
        })*/

        // 使用封装的方法发送请求
        /*reqLogin(loginData.username, loginData.password).then(
            response => {
                console.log("response", response);
                //无论用户名密码是否正确，只要网络请求成功，就会执行此成功函数
                //需要根据返回的状态码判断登陆是否成功
                if (response.data.status !== 0) {//登陆失败，抛出异常
                    throw response.data.msg;
                }
                this.props.history.push("/");
            }
        ).catch(error => {
            // 登陆失败处理
            console.log("error", error);
        });*/

        // 使用async/await，简化请求编写（不使用回调函数）
        const response = await reqLogin(loginData.username, loginData.password);
        console.log("response", response);
        if (response.data.status === 0) {
            message.success("登陆成功！");
            //跳转前保存用户信息
            memoryUtils.user = response.data.data;//保存到内存
            storageUtils.saveLoginUser(response.data.data);//持久化保存
            this.props.history.replace("/");
        } else {
            message.error("登陆失败！" + response.data.msg);//用户名或密码错误
        }
    }

    validatePwd = (rule, value) => {
        // console.log("validatePwd rule", rule);
        // console.log("validatePwd value", value);
        return new Promise((resolve, reject) => {
            if (!value) {
                reject("密码必须输入");
            } else if (value.length < 4) {
                reject("密码长度不低于4位！");
            } else if (value.length > 12) {
                reject("密码长度不多于12位！");
            } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                reject("密码应由字母、数字、下划线组成!");
            } else resolve();
        })
    }
}

export default Login;
