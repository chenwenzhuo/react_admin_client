import React, {Component} from 'react';
import {
    Card, Button, Table
} from "antd";

import "./Role.less"
import {PAGE_SIZE} from "../../utils/constants";

class Role extends Component {
    state = {
        tableColumns: [],//表格列定义数组
        total: 5,//角色的总数
        selectedRowKeys: [],//表格被选中的行的id
    }

    render() {
        const cardTitle = (
            <span>
                <Button type={"primary"} className={"create-role-btn"}>创建角色</Button>
                <Button type={"primary"} disabled>设置角色权限</Button>
            </span>
        )
        const dataSource = [
            {id: "1", name: "测试1", create_time: "20181203", auth_time: "20181203", auth_name: "admin"},
            {id: "2", name: "测试2", create_time: "20181203", auth_time: "20181203", auth_name: "admin"},
            {id: "3", name: "测试3", create_time: "20181203", auth_time: "", auth_name: ""},
            {id: "4", name: "测试4", create_time: "20181203", auth_time: "", auth_name: ""},
            {id: "5", name: "测试5", create_time: "20181203", auth_time: "20220304", auth_name: "admin"},
        ];
        const {tableColumns, total, selectedRowKeys} = this.state;
        return (
            <Card title={cardTitle}>
                <Table columns={tableColumns} dataSource={dataSource} rowKey={"id"} bordered
                       rowSelection={{
                           type: "radio",
                           selectedRowKeys,
                           onChange: this.onSelectedRowKeysChange,
                       }}
                       onRow={this.onRow}
                       pagination={{
                           total,
                           defaultPageSize: PAGE_SIZE,
                           showQuickJumper: true,
                           // onChange: this.getProducts
                       }}/>
            </Card>
        );
    }

    componentDidMount() {
        this.initTableColumns();
    }

    initTableColumns = () => {
        const tableColumns = [{
            title: "角色名称",
            dataIndex: "name",
            align: "center"
        }, {
            title: "创建时间",
            dataIndex: "create_time",
            align: "center"
        }, {
            title: "授权时间",
            dataIndex: "auth_time",
            align: "center"
        }, {
            title: "授权人",
            dataIndex: "auth_name",
            align: "center"
        },];
        this.setState({tableColumns});
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
        if (this.state.selectedRowKeys.indexOf(record.id) < 0) {
            selectedRowKeys.push(record.id);
        }
        this.setState({selectedRowKeys});
    }

    onSelectedRowKeysChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }
}

export default Role;