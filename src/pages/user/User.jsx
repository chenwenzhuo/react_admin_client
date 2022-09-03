import React, {Component} from 'react';
import {
    Card, Button, Table, message, Modal, Form, Input, Select
} from "antd";

import './User.less'
import {PAGE_SIZE} from "../../utils/constants";
import {formatDate} from "../../utils/dateUtils";
import {reqAddUser, reqDeleteUser, reqUpdateUser, reqUsers} from "../../api/ajaxReqs";

const {Item} = Form;
const {Option} = Select;

class User extends Component {
    addModifyUserForm = React.createRef();
    state = {
        tableColumns: [],//表格列数组
        total: 0,//表格中用户数据总数
        users: [],//所有用户数组
        roles: [],//所有角色数组
        roleNames: {},//key为角色id，value为角色名称的对象
        addModModalVisible: false,//添加/修改用户弹窗是否显示
    }

    render() {
        const {tableColumns, total, users, roles, addModModalVisible} = this.state;
        const userToMod = this.userToMod || {};//取出保存的待修改用户对象，若不存在则赋默认值为空对象
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
                <Modal title={userToMod._id ? "修改用户" : "创建用户"}
                       visible={addModModalVisible}
                       destroyOnClose={true}
                       onOk={this.handleAddOrUpdateUser} onCancel={this.handleModalCancel}>
                    {/*labelCol和wrapperCol用于设置表单布局*/}
                    <Form ref={this.addModifyUserForm}
                          labelCol={{xs: {span: 24}, sm: {span: 6}}}
                          wrapperCol={{xs: {span: 24}, sm: {span: 14}}}>
                        <Item name={"username"} label={"用户名"} initialValue={userToMod.username}
                              rules={[{
                                  required: true, message: "用户名必须输入"
                              }, {
                                  min: 4, message: "用户名不少于4位"
                              }, {
                                  max: 12, message: "用户名不多于12位"
                              }, {
                                  pattern: /^[a-zA-Z0-9_]+$/, message: "用户名应由字母、数字、下划线组成"
                              },]}>
                            <Input placeholder={"请输入用户名"}/>
                        </Item>
                        {/*判断userToMod对象是否存在，存在则显示密码栏位，否则不显示*/}
                        {userToMod._id ? null :
                            <Item name={"password"} label={"密码"}
                                  rules={[{
                                      required: true, message: "密码必须输入"
                                  }, {
                                      min: 4, message: "密码不少于4位"
                                  }, {
                                      max: 12, message: "密码不多于12位"
                                  }, {
                                      pattern: /^[a-zA-Z0-9_]+$/, message: "密码应由字母、数字、下划线组成"
                                  }]}>
                                <Input type={"password"} placeholder={"请输入密码"}/>
                            </Item>}
                        <Item name={"phone"} label={"手机号"} initialValue={userToMod.phone}
                              rules={[{
                                  required: true, message: "手机号必须输入"
                              }, {
                                  pattern: /^[0-9]+$/, message: "手机号仅由数字组成"
                              }, {
                                  len: 11, message: "手机号长度应为11位"
                              }]}>
                            <Input placeholder={"请输入手机号"}/>
                        </Item>
                        <Item name={"email"} label={"邮箱"} initialValue={userToMod.email}
                              rules={[{required: true, message: "邮箱必须输入"}]}>
                            <Input placeholder={"请输入邮箱"}/>
                        </Item>
                        <Item name={"role_id"} label={"角色"} initialValue={userToMod.role_id}
                              rules={[{required: true, message: "请选择角色"}]}>
                            <Select placeholder="请选择角色">
                                {roles.map(role => {
                                    return <Option value={role._id} key={role._id}>{role.name}</Option>
                                })}
                            </Select>
                        </Item>
                    </Form>
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
                                onClick={() => this.onModifyUserClick(user)}>
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
        this.userToMod = null;
        this.setState({addModModalVisible: true});
    }

    onModifyUserClick = (userToMod) => {
        this.userToMod = userToMod;//保存待修改的用户对象
        this.setState({addModModalVisible: true});
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
        this.addModifyUserForm.current.validateFields().then(async values => {
            // console.log("handleAddOrUpdateUser-----values-----", values);
            this.setState({addModModalVisible: false});//隐藏弹窗
            this.addModifyUserForm.current.resetFields();//清空表单
            if (this.userToMod) {
                values._id = this.userToMod._id;
                const response = await reqUpdateUser(values);
                this.afterUpdateUserResponse(response);
            } else {
                const response = await reqAddUser(values);//发送请求，添加用户
                this.afterAddUserResponse(response);
            }
        }).catch(error => {
            console.log(error);
        });
    }

    handleModalCancel = () => {
        this.userToMod = null;//关闭弹窗时清除掉待修改对象
        this.addModifyUserForm.current.resetFields();//隐藏弹窗时清空内部表单
        this.setState({addModModalVisible: false});
    }

    afterAddUserResponse = (response) => {
        if (response.status === 0) {
            message.success("添加用户成功");
            //将新用户对象加入用户数组
            this.setState((state) => {
                const users = [...state.users];
                users.push(response.data);
                return {users};
            })
        } else {
            message.error("添加用户出错");
        }
    }

    afterUpdateUserResponse = (response) => {
        if (response.status === 0) {
            message.success("修改用户成功");
            //修改当前用户在数组中的信息
            this.setState((state) => {
                const users = [...state.users];
                //从数组中将原对象去除
                let targetIndex = -1;
                const newUsers = users.filter((user, index) => {
                    if (user._id === this.userToMod._id) {
                        targetIndex = index;//记录当前对象在数组中的位置
                    }
                    return user._id !== this.userToMod._id
                });
                newUsers.splice(targetIndex, 0, response.data);//将新对象插入到数组指定位置
                return {users: newUsers};
            });
        } else {
            message.error("修改用户出错");
        }
    }
}

export default User;