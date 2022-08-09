import React, {Component} from 'react';
import {
    Card, Select, Input, Button, Table
} from "antd";
import {PlusOutlined} from '@ant-design/icons';

import './products.less';

const Option = Select.Option;

// Products组件-默认子路由组件，用于展示商品信息
class ProdHome extends Component {
    state = {
        tableColumns: []
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
                <Table dataSource={dataSource} columns={this.state.tableColumns} rowKey={"id"}/>
            </Card>
        );
    }

    componentDidMount() {
        this.initTableColumns();
    }

    initTableColumns = () => {
        //通过align属性将表格内容居中
        //若希望表头居中，表体左对齐，则在render中进行自定义
        const tableColumns = [{
            title: '商品名称',
            dataIndex: 'name',
            align: 'center',
            render: (name) => (
                <p style={{textAlign: 'left'}}>{name}</p>
            )
        }, {
            title: '商品描述',
            align: 'center',
            dataIndex: 'description',
            render: (description) => (
                <p style={{textAlign: 'left'}}>{description}</p>
            )
        }, {
            title: '价格',
            dataIndex: 'price',
            align: 'center',
            width: 150,
            //通过dataIndex指定了价格对应的属性，故render收到的参数即为属性值
            render: (price) => '¥' + price
        }, {
            title: '状态',
            align: 'center',
            width: 120,
            render: (goods) => (
                <span>
                    <span>{goods.status}</span>
                    <br/>
                    <Button type={"primary"}>下架</Button>
                </span>
            )
        }, {
            title: '操作',
            align: 'center',
            width: 150,
            render: () => (
                <span>
                    <button className="oprt-button">详情</button>
                    <button className="oprt-button">修改</button>
                </span>
            )
        },];
        this.setState({tableColumns});
    }
}

export default ProdHome;