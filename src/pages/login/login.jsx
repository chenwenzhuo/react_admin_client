import React, {Component} from 'react';
import {Form, Input, Button} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';

import './login.less'
import logo from './img/logo.png'

// 登陆的路由组件
class Login extends Component {
    formRef = React.createRef();

    render() {
        return (
            <div className="login">
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
                        <Form.Item name='username' rules={[
                            {required: true, message: '请输入用户名！'},
                            {min: 4, message: '用户名不少于4位！'},
                            {max: 12, message: '用户名不多于12位！'},
                            {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名应由字母、数字、下划线组成！'},
                        ]}>
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
            </div>
        );
    }

    handleSubmit = (loginData) => {
        console.log("click submit");
        console.log(loginData);
        console.log("this.formRef",this.formRef);
        // 提交时对表单输入项进行统一验证
        this.formRef.current.validateFields().then(values => {
            console.log("表单验证通过", values);
        }).catch(error => {
            console.log("表单验证失败", error);
        });
    }

    validatePwd = (rule, value) => {
        // console.log("validatePwd rule", rule);
        // console.log("validatePwd value", value);
        return new Promise((resolve, reject) => {
            if (!value) reject("密码必须输入");
            else if (value.length < 4) reject("密码长度不低于4位！");
            else if (value.length > 12) reject("密码长度不多于12位！");
            else if (!/^[a-zA-Z0-9_]+$/.test(value)) reject("密码应由字母、数字、下划线组成!");
            else resolve();
        })
    }
}

export default Login;
