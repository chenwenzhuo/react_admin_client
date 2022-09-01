import React, {Component} from 'react';
import {
    Card, Button, Table, message, Modal, Form, Input, Tree
} from "antd";

import './User.less'
import {PAGE_SIZE} from "../../utils/constants";
import {formatDate} from "../../utils/dateUtils";
import {reqDeleteUser, reqUsers} from "../../api/ajaxReqs";

class User extends Component {
    state = {
        tableColumns: [],//表格列数组
        total: 0,//表格中用户数据总数
        users: [],//所有用户数组
        roles: [],//所有角色数组
        roleNames: {},//key为角色id，value为角色名称的对象
        cmModalVisible: false,//添加/修改用户弹窗是否显示
    }

    render() {
        const {tableColumns, total, users, cmModalVisible} = this.state;
        const cardTitle = (
            <Button type={"primary"} onClick={this.onCreateUserClick}>创建用户</Button>
        );
        /*const dataSource = [{
            _id: "1", username: "test1", email: "mail1", phone: "123456", create_time: 1234252341120, role_id: "role1"
        }, {
            _id: "2", username: "test2", email: "mail2", phone: "123456", create_time: 1234252341, role_id: "role2"
        }, {
            _id: "3", username: "test3", email: "mail3", phone: "123456", create_time: 1234252341, role_id: "role3"
        }, {
            _id: "4", username: "test3", email: "mail3", phone: "123456", create_time: 1234252341, role_id: "role3"
        }, {
            _id: "5", username: "test3", email: "mail3", phone: "123456", create_time: 1234252341, role_id: "role3"
        }, {
            _id: "6", username: "test3", email: "mail3", phone: "123456", create_time: 1234252341, role_id: "role3"
        }, {
            _id: "7", username: "test3", email: "mail3", phone: "123456", create_time: 1234252341, role_id: "role3"
        },];*/
        return (
            <Card title={cardTitle}>
                <Table columns={tableColumns} dataSource={users} rowKey={"_id"}
                       pagination={{
                           total,
                           defaultPageSize: PAGE_SIZE,
                           showQuickJumper: true,
                       }}/>
                <Modal visible={cmModalVisible}
                       onOk={this.handleAddOrUpdateUser} onCancel={this.handleModalCancel}>
                    添加/修改用户
                </Modal>
            </Card>
        );
    }

    componentDidMount() {
        this.initTableColumns();
        this.getUsers();
    }

    initTableColumns = () => {
        const tableColumns = [{
            title: "用户名", dataIndex: "username", align: "center"
        }, {
            title: "邮箱", dataIndex: "email", align: "center"
        }, {
            title: "电话", dataIndex: "phone", align: "center"
        }, {
            title: "注册时间", dataIndex: "create_time", align: "center", render: formatDate
        }, {
            title: "所属角色", dataIndex: "role_id", align: "center",
            render: (role_id) => {
                const {roleNames} = this.state;
                return roleNames[role_id];
            }
        }, {
            title: "操作", align: "center", render: (user) => {
                return (
                    <span>
                        <button className={"oprt-button-user"}
                                onClick={this.onModifyUserClick}>
                            修改
                        </button>
                        <button className={"oprt-button-user del-button-user"}
                                onClick={() => this.onDeleteUserClick(user)}>
                            删除
                        </button>
                    </span>
                )
            }
        },];
        this.setState({tableColumns});
    }

    getUsers = async () => {
        const response = await reqUsers();
        if (response.status === 0) {
            //同时返回用户列表和角色列表
            const {users, roles} = response.data;
            this.initRoleNames(roles);//生成roleNames对象，在根据角色id取角色名称时提高效率
            this.setState({users, roles, total: users.length});
        } else {
            message.error("获取用户列表失败");
        }
    }

    //根据角色数组，键值对为 角色id->角色名称 的对象
    initRoleNames = (roles) => {
        //以空对象为起始值，使用reduce累积构造对象
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name;
            return pre;
        }, {});
        this.setState({roleNames});
    }

    onCreateUserClick = () => {
        this.setState({cmModalVisible: true});
    }

    onModifyUserClick = () => {
        this.setState({cmModalVisible: true});
    }

    onDeleteUserClick = (userToDel) => {
        Modal.confirm({
            content: `确认删除用户"${userToDel.username}"？`,
            onOk: async () => {
                const response = await reqDeleteUser(userToDel._id);
                if (response.status === 0) {
                    message.success(`删除用户${userToDel.username}成功`);
                    //删除用户后更新状态
                    this.setState(state => {
                        const {users} = state;
                        //使用filter方法，将已删除的用户从数组中过滤掉
                        const restUsers = users.filter(user => user._id !== userToDel._id);
                        return {users: restUsers};
                    });
                } else {
                    message.error(`删除用户出错`);
                }
            }
        })
    }

    handleAddOrUpdateUser = () => {
        this.setState({cmModalVisible: false});
    }

    handleModalCancel = () => {
        this.setState({cmModalVisible: false});
    }
}

export default User;