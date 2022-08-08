import React, {Component} from 'react';
import {
    Card, Select, Input, Button, Table
} from "antd";
import {PlusOutlined} from '@ant-design/icons';

import './products.less';

const Option = Select.Option;

// Products组件-默认子路由组件，用于展示商品信息
class ProdHome extends Component {
    constructor(props) {
        super(props);
        this.initTableColumns();
    }

    render() {
        const cardTitle = (
            <span>
                <Select defaultValue={"name_search"} className={"card-title-select"}>
                    <Option value={"name_search"}>按名称搜索</Option>
                    <Option value={"desc_search"}>按描述搜索</Option>
                </Select>
                <Input placeholder={"关键字"} className={"card-title-input"}/>
                <Button type={"primary"}>搜索</Button>
            </span>
        );
        const cardExtra = (<Button type="primary" icon={<PlusOutlined/>}>添加商品</Button>);
        const dataSource = [
            {id: "1", name: "联想ThinkPad 翼480", description: "年度重量级新品", price: "66000", status: "在售"},
            {id: "2", name: "华硕（ASUS）飞行堡垒", description: "15.6英寸窄边游戏本", price: "6999", status: "在售"},
            {id: "3", name: "你不知道的JavaScript（上卷）", description: "图灵程序设计丛书", price: "35", status: "下架"},
        ]
        return (
            <Card title={cardTitle} extra={cardExtra}>
                <Table dataSource={dataSource} columns={this.tableColumns} rowKey={"id"}/>
            </Card>
        );
    }

    initTableColumns = () => {
        this.tableColumns = [{
            title: '商品名称',
            dataIndex: 'name',
        }, {
            title: '商品描述',
            dataIndex: 'description',
        }, {
            title: '价格',
            dataIndex: 'price',
        }, {
            title: '状态',
            render: (goods) => (
                <span>
                    <span>{goods.status}</span><br/>
                    <Button type={"primary"}>下架</Button>
                </span>
            )
        }, {
            title: '操作',
            render: () => (
                <span>
                    <button className="oprt-button">详情</button>
                    <button className="oprt-button">修改</button>
                </span>
            )
        },];
    }
}

export default ProdHome;