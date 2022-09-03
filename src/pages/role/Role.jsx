import React, {Component} from "react";
import {
    Card, Button, Table, message, Modal, Form, Input, Tree
} from "antd";

import "./Role.less"
import {PAGE_SIZE} from "../../utils/constants";
import {reqAddRole, reqRoles, reqUpdateRole} from "../../api/ajaxReqs";
import memoryUtils from "../../utils/memoryUtils";

const Item = Form.Item;

class Role extends Component {
    createRoleForm = React.createRef();
    state = {
        tableColumns: [],//表格列定义数组
        selectedRowKeys: [],//表格被选中的行的id
        selectedRole: {},//表格被选中行的role对象
        selectedRoleMenus: [],//表格被选中行的role对象的权限列表
        roles: [],//所有角色数组
        total: 0,//角色的总数
        modalDisplayStatus: 0,//控制创建角色、设置权限弹窗是否显示 0-隐藏，1-显示创建角色弹窗，2-显示权限设置弹窗
    }

    render() {
        const {
            tableColumns,
            roles,
            total,
            selectedRowKeys,
            selectedRole,
            selectedRoleMenus,
            modalDisplayStatus
        } = this.state;
        const cardTitle = (<span>
                <Button type={"primary"} className={"create-role-btn"} onClick={this.onCreateRoleClick}>创建角色</Button>
                <Button type={"primary"} disabled={selectedRowKeys.length === 0}
                        onClick={this.onAuthRoleClick}>
                    设置角色权限
                </Button>
            </span>);
        const treeData = [{
            title: "首页", key: "/home"
        }, {
            title: "商品", key: "/prodCate", children: [{
                title: "品类管理", key: "/category"
            }, {
                title: "商品管理", key: "/products"
            },]
        }, {
            title: "用户管理", key: "/user"
        }, {
            title: "角色管理", key: "/role"
        }, {
            title: "图形图表", key: "/charts", children: [{
                title: "柱形图", key: "/charts/barchart"
            }, {
                title: "折线图", key: "/charts/linechart"
            }, {
                title: "饼图", key: "/charts/piechart"
            }]
        }];
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
            {/*Form的initialValues不能被setState更新，设置destroyOnClose属性，关闭时销毁Modal里的子元素*/}
            {/*否则会出现重新选了表格选项，但表格中角色名称还是上一个选项名称但情况*/}
            <Modal title={"设置角色权限"} visible={modalDisplayStatus === 2} destroyOnClose={true}
                   onOk={this.handleAuthRole} onCancel={this.handleModalCancel}>
                <Item label={"角色名称"}>
                    <Input value={selectedRole.name} disabled/>
                </Item>
                <Item label={"平台权限"}>
                    <Tree checkable defaultExpandAll={true} treeData={treeData}
                          checkedKeys={selectedRoleMenus}
                          onSelect={this.checkTreeNode}
                          onCheck={this.checkTreeNode}/>
                </Item>
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
            title: "创建时间", dataIndex: "create_time_format", align: "center"
        }, {
            title: "授权时间", dataIndex: "auth_time_format", align: "center"
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
                //将milliseconds形式的创建/授权时间处理为年月日时分秒的形式
                const createDate = new Date(role.create_time);
                role.create_time_format = createDate.getFullYear() + "-" + (createDate.getMonth() + 1) +
                    "-" + createDate.getDate() + " " + createDate.getHours() +
                    ":" + createDate.getMinutes() + ":" + createDate.getSeconds();
                if (role.auth_time) {
                    const authDate = new Date(role.auth_time);
                    role.auth_time_format = authDate.getFullYear() + "-" + (authDate.getMonth() + 1) +
                        "-" + authDate.getDate() + " " + authDate.getHours() +
                        ":" + authDate.getMinutes() + ":" + authDate.getSeconds();
                }
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
        let selectedRole = {};
        //当前点击的是一个未被选中的行，则将id加入数组，在更新state时将其选中
        //当前点击的是一个已被选中的行，则直接使用空数组更新state，取消选中
        if (this.state.selectedRowKeys.indexOf(record._id) < 0) {
            selectedRowKeys.push(record._id);
            selectedRole = this.state.roles.find(role => role._id === record._id);
        }
        this.setState({selectedRowKeys, selectedRole});
    }

    onSelectedRowKeysChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }

    onCreateRoleClick = () => {
        this.setState({modalDisplayStatus: 1});
    }

    onAuthRoleClick = () => {
        const {selectedRole} = this.state;
        this.setState({
            modalDisplayStatus: 2,
            selectedRoleMenus: [...selectedRole.menus]//每次打开授权弹窗前，重新读取selectedRoleMenus的值
        });
    }

    handleAddRole = () => {
        this.createRoleForm.current.validateFields().then(async values => {
            // console.log("add role name--------", values);
            const response = await reqAddRole(values.roleName);
            this.createRoleForm.current.resetFields();//清空内部表单
            this.setState({modalDisplayStatus: 0});//关闭弹窗
            if (response.status === 0) {
                const newRole = response.data;//返回的数据即为新的角色对象
                //不推荐直接更新state中的数据对象
                /*const roles = this.state.roles;
                roles.push(newRole);
                this.setState({roles});*/
                const roles = [...this.state.roles];//取出state中的角色数组，创建一个新数组
                roles.push(newRole);
                this.setState({roles});
                message.success("添加角色成功");
            } else {
                message.error("添加角色失败");
            }
        }).catch(error => {
            console.log("error in handleAddRole", error);
        })
    }

    handleAuthRole = async () => {
        const {selectedRole, selectedRoleMenus} = this.state;
        //更新选中对象的menus属性数组
        selectedRole.menus = [...selectedRoleMenus];
        selectedRole.auth_name = memoryUtils.user.username;//获取当前已登陆的用户的名称
        //发送请求更新角色权限
        const response = await reqUpdateRole(selectedRole);
        this.setState({modalDisplayStatus: 0});
        console.log("auth role response------------", response);
        if (response.status === 0) {
            message.success("设置角色权限成功");
            this.getRoles();//重新加载表格
        } else {
            message.error("设置角色权限失败");
        }
    }

    handleModalCancel = () => {
        //弹窗取消时，清空内部表单
        if (this.state.modalDisplayStatus === 1) {
            this.createRoleForm.current.resetFields();
        }
        this.setState({modalDisplayStatus: 0});
    }

    checkTreeNode = (selectedKeys) => {
        this.setState({selectedRoleMenus: selectedKeys});
    }
}

export default Role;