import React, {Component} from 'react';
import {
    Card, Select, Input, Button, Table, message
} from "antd";
import {PlusOutlined} from '@ant-design/icons';

import {reqProducts, reqSearchProducts, reqUpdateProductStatus} from "../../api/ajaxReqs";
import {PAGE_SIZE} from "../../utils/constants";

const Option = Select.Option;

// Products组件-默认子路由组件，用于展示商品信息
class ProdHome extends Component {
    state = {
        tableColumns: [],//表格列定义数组
        products: [],//表格商品数据数组
        total: 0,//商品的总数量
        loading: false,//表格数据是否正在加载中
        searchKey: "",//搜索的关键字
        searchType: "productName",//搜索的类型，默认按名称搜索
    }

    render() {
        const {tableColumns, products, total, loading, searchKey, searchType} = this.state;
        const cardTitle = (
            <span>
                <Select value={searchType} className={"card-title-select"}
                        onChange={value => this.setState({searchType: value})}>
                    <Option value={"productName"}>按名称搜索</Option>
                    <Option value={"productDesc"}>按描述搜索</Option>
                </Select>
                <Input placeholder={"关键字"} className={"card-title-input"} value={searchKey}
                       onChange={event => this.onSearchKeyChange(event.target.value)}/>
                <Button type={"primary"} onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        );
        const cardExtra = (
            <Button type="primary" icon={<PlusOutlined/>}
                    onClick={() => this.props.history.push("/products/add_update", {menuName: "添加商品"})}>
                添加商品
            </Button>);
        return (
            //pagination.current用于设置当前页码，
            //搜索商品时将this.pageNum设为1，搜索完成重新render时表格回到第一页
            //若不设置current，则仍停留在表格搜索前的页码
            <Card title={cardTitle} extra={cardExtra}>
                <Table dataSource={products} columns={tableColumns} rowKey={"_id"} bordered loading={loading}
                       pagination={{
                           total,
                           current: this.pageNum,
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
            render: (product) => (
                <span>
                    <span>{product.status === 1 ? "在售" : "已下架"}</span>
                    <br/>
                    <Button type={"primary"}
                            onClick={() => this.changeProductStatus(product)}>
                        {product.status === 1 ? "下架" : "上架"}
                    </Button>
                </span>
            )
        }, {
            title: '操作',
            align: 'center',
            width: 150,
            render: (product) => (
                <span>
                    <button className="oprt-button-prod detail-btn-prod-home"
                            onClick={() => this.props.history.push("/products/detail", {
                                product,
                                menuName: "商品详情"
                            })}>
                        详情
                    </button>
                    <button className="oprt-button-prod"
                            onClick={() => this.props.history.push("/products/add_update", {
                                product,
                                menuName: "修改商品"
                            })}>
                        修改
                    </button>
                </span>
            )
        },];
        this.setState({tableColumns});
    }

    //获取指定页码的商品数据
    getProducts = async (pageNum) => {
        this.pageNum = pageNum;//保存当前页码
        this.setState({loading: true});//显示loading效果
        const {searchKey, searchType} = this.state;
        let response;
        if (searchKey) {
            response = await reqSearchProducts({
                pageNum,
                pageSize: PAGE_SIZE,
                searchKey,
                searchType
            });
        } else {
            response = await reqProducts(pageNum, PAGE_SIZE);
        }
        this.setState({loading: false});//隐藏loading
        if (response.status === 0) {
            const {total, list} = response.data;
            this.setState({total, products: list});
        }
    }

    onSearchKeyChange = (searchKey) => {
        this.setState({searchKey}, () => {
            /*若关键词被清空，则自动查询全部数据。
            * setState为异步，查询操作必须在setState完成后进行，
            * 故必须使用回调函数*/
            if (searchKey === "") {
                this.getProducts(1);
            }
        });
    }

    changeProductStatus = async (product) => {
        const newStatus = product.status === 0 ? 1 : 0;
        const response = await reqUpdateProductStatus(product._id, newStatus);
        if (response.status === 0) {
            message.success((newStatus === 0 ? "下架" : "上架") + "成功");
            this.getProducts(this.pageNum);//更新后重新请求当前页的商品数据
        } else {
            message.error((newStatus === 0 ? "下架" : "上架") + "失败");
        }
    }
}

export default ProdHome;