import React, {Component} from 'react';
import {Button, Card, Cascader, Form, Input, message} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons';

import {reqCategories} from "../../api/ajaxReqs";

const {Item} = Form;
const {TextArea} = Input;

// Products组件-添加、更新商品信息的子路由组件
class ProdAddUpdate extends Component {
    constructor(props) {
        super(props);
        const product = this.props.location.state;//取出state参数
        this.isAdd = !product;//取非操作，强制转换布尔类型 true-添加商品，false-修改商品
        this.product = product || {};//保存参数值
    }

    state = {
        prodCategories: [],//商品分类数组，商品分类级联选择框的数据
    }

    render() {
        const {prodCategories} = this.state;
        const title = (
            <button className={"oprt-button-prod back-btn-add-update"} onClick={() => this.props.history.goBack()}>
                <ArrowLeftOutlined/>&nbsp;&nbsp;{this.isAdd ? "添加" : "修改"}商品
            </button>
        );
        //指定Item布局的配置对象
        const formItemLayout = {
            labelCol: {span: 2},//左侧label宽度
            wrapperCol: {span: 8},//右侧包裹的宽度
        };
        const categoryIds = [];//商品分类级联选择框的初始值
        if (!this.isAdd) {//更新商品时
            categoryIds.push(this.product.categoryId);
            //父分类id不为0时，将父分类id加到数组头部
            if (this.product.pCategoryId !== "0") {
                categoryIds.unshift(this.product.pCategoryId);
            }
        }
        return (
            <Card title={title}>
                <Form {...formItemLayout} onFinish={this.onFormFinish}>
                    <Item label={"商品名称"} name={"name"} initialValue={this.product.name}
                          rules={[{required: true, message: "必须输入商品名称"}]}>
                        <Input placeholder={"请输入商品名称"}/>
                    </Item>
                    <Item label={"商品描述"} name={"desc"} initialValue={this.product.desc}
                          rules={[{required: true, message: "必须输入商品描述"}]}>
                        <TextArea placeholder={"请输入商品描述"} autoSize={{minRows: 2, maxRows: 6}}/>
                    </Item>
                    <Item label={"商品价格"} name={"price"} initialValue={this.product.price}
                          rules={[{validator: this.validatePrice}]}>{/*商品价格通过函数进行自定义校验*/}
                        <Input type={"number"} placeholder={"请输入商品价格"} addonAfter={"元"}/>
                    </Item>
                    <Item label={"商品分类"} name={"categoryIds"} initialValue={categoryIds}
                          rules={[{required: true, message: "必须选择商品分类"}]}>
                        <Cascader placeholder={"请选择商品分类"}
                            options={prodCategories} loadData={this.loadSubCategories}/>
                    </Item>
                    <Item label={"商品图片"}>
                        <div>商品图片</div>
                    </Item>
                    <Item label={"商品详情"}>
                        <div>商品详情</div>
                    </Item>
                    <Item>
                        <Button type={"primary"} htmlType={"submit"}>提交</Button>
                    </Item>
                </Form>
            </Card>
        );
    }

    componentDidMount() {
        this.getCategories("0");//获取一级分类列表
    }

    onFormFinish = (values) => {
        console.log("onFormFinish---values---", values);
    }

    //自定义校验商品价格
    validatePrice = (_, value) => {
        return new Promise((resolve, reject) => {
            if (!value) {
                reject("必须输入商品价格");
            } else if (value <= 0) {
                reject("商品价格必须大于0")
            } else {
                resolve();
            }
        });
    }

    /*为级联选择框加载二级选项菜单
    * 级联选择框支持多选，故selectedOptions为数组，包含选择的所有选项*/
    loadSubCategories = async (selectedOptions) => {
        //此处为单选，故selectedOptions数组长度为1，直接选择第一项
        const targetOption = selectedOptions[0];
        //targetOption.value为品类id，将其作为parentId，查询子品类
        const subCategories = await this.getCategories(targetOption.value);
        if (subCategories && subCategories.length > 0) {
            //根据二级品类数组生成二级选项数组，并将其关联到对应一级列表选项
            targetOption.children = subCategories.map(item => {
                return {
                    value: item._id,
                    label: item.name,
                    isLeaf: true//一定为叶子节点
                };
            });
        } else {//当前一级分类下没有二级分类
            targetOption.isLeaf = true;
        }
        this.setState({prodCategories: [...this.state.prodCategories]});//更新状态
    }

    /*获取一级/二级分类列表
    * async函数返回值为Promise对象，其状态和PromiseResult由函数return语句返回的值决定：
    * 1.若return一个Promise对象，则最终返回的Promise对象的状态和结果与return后跟的Promise对象的状态和结果相同；
    * 2.若return的值不是Promise对象，则最终返回的Promise对象状态为成功，结果为return的那个值。
    * 3.若函数内部抛出异常，则最终返回一个失败的Promise对象，结果为抛出的异常值。*/
    getCategories = async (parentId) => {
        const response = await reqCategories(parentId);
        if (response.status === 0) {
            const categories = response.data;
            if (parentId === "0") {//查询的是一级分类列表，直接初始化分类
                this.initProdCategories(categories);
            } else {//查询的是二级分类列表，将列表值返回
                return categories;//async返回一个成功的Promise对象，结果值为categories数组
            }
        } else {
            message.error("查询分类列表出错");
        }
    }

    //更新state中的prodCategories
    initProdCategories = async (categories) => {
        //根据商品品类数组，生成Cascader所需的选项数组
        const prodCategories = categories.map(item => {
            return {
                value: item._id,
                label: item.name,
                isLeaf: false
            }
        });
        //如果当前功能为更新，且商品属于二级分类下的商品
        //则需要将二级
        const {isAdd, product} = this;
        const {pCategoryId} = product;
        if (!isAdd && pCategoryId !== "0") {
            const subCategories = await this.getCategories(pCategoryId);//查询二级分类列表
            //根据二级分类列表，生成二级选项数组
            const childOptions = subCategories.map(item => {
                return {
                    value: item._id,
                    label: item.name,
                    isLeaf: true//一定为叶子节点
                };
            });
            //找到二级选项数组所属的一级选项对象
            const targetOption = prodCategories.find(item => item.value === pCategoryId);
            targetOption.children = childOptions;//将二级选项数组关联到一级选项对象上
        }
        this.setState({prodCategories});
    }
}

export default ProdAddUpdate;