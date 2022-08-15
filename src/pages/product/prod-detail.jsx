import React, {Component} from 'react';
import {
    Card, List
} from "antd";
import {ArrowLeftOutlined} from '@ant-design/icons';

const Item = List.Item;

// Products组件-商品详情子路由组件
class ProdDetail extends Component {
    render() {
        const cardTitle = (
            <button className={"oprt-button-prod back-btn-detail"} onClick={() => this.props.history.goBack()}>
                <ArrowLeftOutlined/>&nbsp;&nbsp;商品详情
            </button>
        );
        return (
            <Card title={cardTitle}>
                <List itemLayout={"vertical"} bordered>
                    <Item>
                        <Item.Meta title={<span className={"list-item-title"}>商品名称：</span>}/>
                        <span>商品名称商品名称商品名称商品名称</span>
                    </Item>
                    <Item>
                        <Item.Meta title={<span className={"list-item-title"}>商品描述：</span>}/>
                        <span>商品描述商品描述商品描述商品描述</span>
                    </Item>
                    <Item>
                        <Item.Meta title={<span className={"list-item-title"}>商品价格：</span>}/>
                        <span>999元</span>
                    </Item>
                    <Item>
                        <Item.Meta title={<span className={"list-item-title"}>所属分类：</span>}/>
                        <span>所属分类所属分类所属分类所属分类所属分类</span>
                    </Item>
                    <Item>
                        <Item.Meta title={<span className={"list-item-title"}>商品图片：</span>}/>
                        <img src="http://localhost:5001/upload/image-1660466730555.jpeg" alt=""/>
                        <img src="http://localhost:5001/upload/image-1660466730555.jpeg" alt=""/>
                        <img src="http://localhost:5001/upload/image-1660466730555.jpeg" alt=""/>
                    </Item>
                    <Item>
                        <Item.Meta title={<span className={"list-item-title"}>商品详情：</span>}/>
                        <span dangerouslySetInnerHTML={{
                            __html: "<p style='color: red;font-size: 16px'>商品详情商品详情商品详情商品详情</p>"
                        }}/>
                    </Item>
                </List>
            </Card>
        );
    }
}

export default ProdDetail;