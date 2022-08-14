import React, {Component} from 'react';
import {
    Card, Select, Input, Button, Table
} from "antd";
import {PlusOutlined} from '@ant-design/icons';

import {reqProducts} from "../../api/ajaxReqs";
import {PAGE_SIZE} from "../../utils/constants";
import './products.less';

const Option = Select.Option;

// Products组件-默认子路由组件，用于展示商品信息
class ProdHome extends Component {
    state = {
        tableColumns: [],//表格列定义数组
        products: [],//表格商品数据数组
        total: 0,//商品的总数量
        loading: false,//表格数据是否正在加载中
    }

    render() {
        const {tableColumns, products, total, loading} = this.state;
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
        const cardExtra = (
            <Button type="primary" icon={<PlusOutlined/>}
                    onClick={() => this.props.history.push("/products/add_update")}>
                添加商品
            </Button>);
        const dataSource = [
            {
                _id: "1",
                name: "联想ThinkPad 翼480",
                desc: "年度重量级新品",
                price: "66000",
                status: "在售",
                pCategoryId: "62ef5909c9014e6ea101b4f3",
                categoryId: "62ef7055c9014e6ea101b508",
                imgs: ["image-1660375711767.jpg", "image-1660375758973.jpg"],
                detail: "<p><strong>联想</strong><em><ins>ThinkPad</ins></em> <del>翼480</del></p>"
            },
            {
                _id: "2",
                name: "华硕（ASUS）飞行堡垒",
                desc: "15.6英寸窄边游戏本",
                price: "6999",
                status: "在售",
                pCategoryId: "62ef5909c9014e6ea101b4f3",
                categoryId: "62ef7055c9014e6ea101b508",
                imgs: ["image-1660375774809.jpg", "image-1660376339071.jpg"],
                detail: "<p style=\"text-align:center;\"><code>华硕</code>（ASUS）<sup>飞行堡垒</sup></p>"
            },
            {
                _id: "3",
                name: "你不知道的JavaScript（上卷）",
                desc: "图灵程序设计丛书",
                price: "35",
                status: "下架",
                pCategoryId: "0",
                categoryId: "62ef6405c9014e6ea101b4f4",
                imgs: ["image-1660379880396.jpg", "image-1660380021229.jpg"],
                detail: "<p><ins>你不知道的</ins><code><strong>JavaScript</strong></code><sub>（上卷）</sub></p>"
            },
        ]
        return (
            <Card title={cardTitle} extra={cardExtra}>
                <Table dataSource={dataSource} columns={tableColumns} rowKey={"_id"} bordered loading={loading}
                       pagination={{
                           total,
                           defaultPageSize: PAGE_SIZE,
                           showQuickJumper: true,
                           onChange: this.getProducts
                       }}
                />
            </Card>
        );
    }

    componentDidMount() {
        this.initTableColumns();
        this.getProducts(1);
    }

    //初始化表格列定义数组
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
            dataIndex: 'desc',
            render: (desc) => (
                <p style={{textAlign: 'left'}}>{desc}</p>
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
            render: (product) => (
                <span>
                    <button className="oprt-button-prod detail-btn-prod-home">详情</button>
                    <button className="oprt-button-prod"
                            onClick={() => this.props.history.push("/products/add_update", product)}>
                        修改
                    </button>
                </span>
            )
        },];
        this.setState({tableColumns});
    }

    //获取指定页码的商品数据
    getProducts = async (pageNum) => {
        this.setState({loading: true});//显示loading效果
        const response = await reqProducts(pageNum, 5);
        this.setState({loading: false});//隐藏loading
        if (response.status === 0) {
            const {total, list} = response.data;
            this.setState({total, products: list});
        }
    }
}

export default ProdHome;