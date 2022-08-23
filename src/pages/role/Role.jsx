import React, {Component} from 'react';
import {
    Card, Button, Table, message, Modal, Form, Input
} from "antd";

import "./Role.less"
import {PAGE_SIZE} from "../../utils/constants";
import {reqAddRole, reqRoles} from "../../api/ajaxReqs";

const Item = Form.Item;

class Role extends Component {
    createRoleForm = React.createRef();
    state = {
        tableColumns: [],//表格列定义数组
        selectedRowKeys: [],//表格被选中的行的id
        roles: [],//所有角色数组
        total: 0,//角色的总数
        modalDisplayStatus: 0,//控制创建角色、设置权限弹窗是否显示 0-隐藏，1-显示创建角色弹窗，2-显示权限设置弹窗
    }

    render() {
        const {tableColumns, roles, total, selectedRowKeys, modalDisplayStatus} = this.state;
        const cardTitle = (<span>
                <Button type={"primary"} className={"create-role-btn"} onClick={this.onCreateRoleClick}>创建角色</Button>
                <Button type={"primary"} disabled={selectedRowKeys.length === 0}>设置角色权限</Button>
            </span>)
        /*const dataSource = [
            {_id: "1", name: "测试1", create_time: "20181203", auth_time: "20181203", auth_name: "admin"},
            {_id: "2", name: "测试2", create_time: "20181203", auth_time: "20181203", auth_name: "admin"},
            {_id: "3", name: "测试3", create_time: "20181203", auth_time: "", auth_name: ""},
            {_id: "4", name: "测试4", create_time: "20181203", auth_time: "", auth_name: ""},
            {_id: "5", name: "测试5", create_time: "20181203", auth_time: "20220304", auth_name: "admin"},
        ];*/
        return (<Card title={cardTitle}>
            <Table columns={tableColumns} dataSource={roles} rowKey={"_id"} bordered
                   rowSelection={{
                       type: "radio", selectedRowKeys, onChange: this.onSelectedRowKeysChange,
                   }}
                   onRow={this.onRow}
                   pagination={{
                       total, defaultPageSize: PAGE_SIZE, showQuickJumper: true, // onChange: this.getProducts
                   }}/>
            <Modal title={"创建角色"} visible={modalDisplayStatus === 1}
                   onOk={this.handleAddRole} onCancel={this.handleModalCancel}>
                <Form ref={this.createRoleForm}>
                    <Item name={"roleName"} label={"角色名称"}
                          rules={[{required: true, message: "角色名称不能为空"}]}>
                        <Input placeholder={"请输入角色名称"}/>
                    </Item>
                </Form>
            </Modal>
        </Card>);
    }

    componentDidMount() {
        this.initTableColumns();//初始化表格的列结构
        this.getRoles();//查询所有角色信息
    }

    initTableColumns = () => {
        const tableColumns = [{
            title: "角色名称", dataIndex: "name", align: "center"
        }, {
            title: "创建时间", dataIndex: "create_time", align: "center"
        }, {
            title: "授权时间", dataIndex: "auth_time", align: "center"
        }, {
            title: "授权人", dataIndex: "auth_name", align: "center"
        },];
        this.setState({tableColumns});
    }

    getRoles = async () => {
        const response = await reqRoles();
        if (response.status === 0) {
            let roles = response.data;
            roles = roles.map(role => {
                //将milliseconds形式的创建时间处理为年月日时分秒的形式
                const createDate = new Date(role.create_time);
                role.create_time = createDate.getFullYear() + "-" + (createDate.getMonth() + 1) + "-" + createDate.getDate() + " " + createDate.getHours() + ":" + createDate.getMinutes() + ":" + createDate.getSeconds();
                return role;
            });
            this.setState({roles, total: roles.length});
        } else {
            message.error("获取角色信息失败");
        }
    }

    onRow = (role) => {
        return {
            onClick: () => {
                this.selectRow(role);
            },
        }
    }

    selectRow(record) {
        const selectedRowKeys = [];//默认初始化一个空数组
        //当前点击的是一个未被选中的行，则将id加入数组，在更新state时将其选中
        //当前点击的是一个已被选中的行，则直接使用空数组更新state，取消选中
        if (this.state.selectedRowKeys.indexOf(record._id) < 0) {
            selectedRowKeys.push(record._id);
        }
        this.setState({selectedRowKeys});
    }

    onSelectedRowKeysChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }

    onCreateRoleClick = () => {
        this.setState({modalDisplayStatus: 1});
    }

    handleAddRole = () => {
        this.createRoleForm.current.validateFields().then(async values => {
            // console.log("add role name--------", values);
            const response = await reqAddRole(values.roleName);
            if (response.status === 0) {
                this.setState({modalDisplayStatus: 0});//关闭弹窗
                message.success("添加角色成功");
                this.getRoles();//重新加载表格
            } else {
                message.error("添加角色失败");
            }
        }).catch(error => {
            console.log("error in handleAddRole", error);
        })
    }

    handleModalCancel = () => {
        this.createRoleForm.current.resetFields();//弹窗取消时，清空内部表单
        this.setState({modalDisplayStatus: 0});
    }
}

export default Role;