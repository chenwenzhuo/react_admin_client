import React, {Component} from 'react';
import {Card, List} from "antd";
import {ArrowLeftOutlined} from '@ant-design/icons';

import {reqCategoryInfo} from "../../api/ajaxReqs";

const Item = List.Item;

// Products组件-商品详情子路由组件
class ProdDetail extends Component {
    state = {
        pCateName: "",//商品所属分类的父分类名称
        cateName: ""//商品所属分类名称
    }

    render() {
        const cardTitle = (
            <button className={"oprt-button-prod back-btn-detail"} onClick={() => this.props.history.goBack()}>
                <ArrowLeftOutlined/>&nbsp;&nbsp;商品详情
            </button>
        );
        const {product} = this.props.location.state;//取出state参数
        const {name, desc, price, imgs, detail, pCategoryId} = product;
        const {pCateName, cateName} = this.state;
        return (
            <Card title={cardTitle}>
                <List itemLayout={"vertical"} bordered>
                    <Item>
                        <Item.Meta title={<span className={"list-item-title"}>商品名称：</span>}/>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <Item.Meta title={<span className={"list-item-title"}>商品描述：</span>}/>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <Item.Meta title={<span className={"list-item-title"}>商品价格：</span>}/>
                        <span>{price}元</span>
                    </Item>
                    <Item>
                        <Item.Meta title={<span className={"list-item-title"}>所属分类：</span>}/>
                        <span>{pCateName}{pCategoryId === "0" ? "" : " --> "}{cateName}</span>
                    </Item>
                    <Item>
                        <Item.Meta title={<span className={"list-item-title"}>商品图片：</span>}/>
                        {imgs.map(img => (
                            <img src={`http://localhost:5001/upload/` + img} alt="" key={img}/>
                        ))}
                    </Item>
                    <Item>
                        <Item.Meta title={<span className={"list-item-title"}>商品详情：</span>}/>
                        <span dangerouslySetInnerHTML={{
                            __html: detail
                        }}/>
                    </Item>
                </List>
            </Card>
        );
    }

    componentDidMount() {
        const {product} = this.props.location.state;//取出state参数
        const {pCategoryId, categoryId} = product;
        this.getProductCategory(pCategoryId, categoryId);//获取商品的分类名称
    }

    getProductCategory = async (pCategoryId, categoryId) => {
        // const response1 = await reqCategoryInfo(pCategoryId);
        // const response2 = await reqCategoryInfo(categoryId);
        /*使用Promise.all，连续发送多个请求
        * 若使用多个await，则后面的请求会在前面的请求成功返回后才发送*/
        const responses = await Promise.all([reqCategoryInfo(pCategoryId), reqCategoryInfo(categoryId)]);
        const pCateName = responses[0].status === 0 ? responses[0].data.name : "";
        const cateName = responses[1].status === 0 ? responses[1].data.name : "";
        this.setState({pCateName, cateName});
    }
}

export default ProdDetail;