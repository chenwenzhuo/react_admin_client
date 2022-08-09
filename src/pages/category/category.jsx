import React, {Component} from 'react';
import {
    Card, Table, Button, message, Modal
} from 'antd';
import {PlusOutlined, ArrowRightOutlined} from '@ant-design/icons';

import AddForm from './add-form'
import UpdateForm from './update-form'
import {reqCategories, reqAddCategory, reqUpdateCategory} from "../../api/ajaxReqs";
import './category.less'

class Category extends Component {
    state = {
        tableLoading: false,//表格数据是否正在加载中
        tableColumns: [],//表格列名数组
        categories: [],//一级分类数组
        subCategories: [],//二级分类数组
        parentId: "0",//父分类ID
        parentName: "",//父分类名称
        modalDisplayStatus: 0,//控制是否显示添加/修改分类的对话框  0-都不显示，1-显示添加，2-显示修改
        newCategoryName: "",//修改分类时，输入的新分类名称
    }

    render() {
        const {
            tableLoading,
            tableColumns,
            categories,
            subCategories,
            parentId,
            parentName,
            modalDisplayStatus
        } = this.state;
        const category = this.category || {name: ""};//获取保存的分类对象
        const title = parentId === "0" ? "一级分类列表" : (
            <span>
                <button className="oprt-button" onClick={this.backToMainCateList}>一级分类列表</button>
                <ArrowRightOutlined/>
                <span className="subCate-parentNm">{parentName}</span>
            </span>
        );//左侧标题
        const extra = (<Button type="primary" icon={<PlusOutlined/>} onClick={this.showAddCateModal}>添加</Button>);
        return (
            <Card title={title} extra={extra}>
                <Table dataSource={parentId === '0' ? categories : subCategories}
                       columns={tableColumns} bordered rowKey="_id"
                       loading={tableLoading}
                       pagination={{
                           defaultPageSize: 10,
                           pageSizeOptions: [5, 10, 20],
                           showQuickJumper: true,
                           showSizeChanger: true,
                       }}/>
                <Modal title="添加分类" visible={modalDisplayStatus === 1}
                       onOk={this.handleAddCategory} onCancel={this.handleModalCancel}>
                    {/*将一级分类数组传入AddForm组件，初始化select选项，传入parentId，初始化select默认值*/}
                    {/*向AddForm组件传入一个函数，用于将AddForm表单对象传回category中*/}
                    <AddForm parentCategories={categories}
                             parentId={parentId}
                             setFormInstance={(formInstance) => {
                                 this.addFormInstance = formInstance;
                             }}/>
                </Modal>
                <Modal title="修改分类" visible={modalDisplayStatus === 2}
                       onOk={this.handleUpdateCategory} onCancel={this.handleModalCancel}>
                    {/*将保存的category对象的名称传入UpdateForm组件*/}
                    {/*向UpdateForm组件传入一个函数，用于将UpdateForm表单对象传回category中*/}
                    <UpdateForm categoryName={category.name}
                                setFormInstance={(formInstance) => {
                                    this.updateFormInstance = formInstance;
                                }}/>
                </Modal>
            </Card>
        );
    }

    componentDidMount() {
        this.getCategories();
        this.initTableColumns();
    }

    initTableColumns = () => {
        const tableColumns = [
            {
                title: '分类名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 400,
                render: (category) => (
                    <span>
                        <button className="oprt-button" onClick={() => {
                            this.showUpdateCateModal(category);
                        }}>修改分类</button>
                        {this.state.parentId !== '0' ? null :
                            <button className="oprt-button" onClick={() => {
                                this.showSubCategories(category);
                            }}>查看子分类</button>}
                    </span>
                )
            },
        ];
        this.setState({tableColumns});
    }

    getCategories = async (parentId) => {
        //发送请求前显示loading
        this.setState({tableLoading: true});
        // 发送请求获取指定parentId下的分类数据
        parentId = parentId || this.state.parentId;
        const response = await reqCategories(parentId);
        if (response.status !== 0) {
            message.error("获取分类列表失败");//出错时弹窗提示
        } else {
            const categories = response.data;
            //根据parentId决定更新哪一个数组
            if (parentId === '0') {
                this.setState({categories});//更新一级分类数组
            } else {
                this.setState({subCategories: categories});//更新二级分类数组
            }
        }
        //请求完成后取消loading
        this.setState({tableLoading: false});
    }

    // 显示指定一级分类之下的二级分类列表
    showSubCategories = (parentCate) => {
        //更新父分类列表
        this.setState({
            parentId: parentCate._id,
            parentName: parentCate.name
        }, () => {
            this.getCategories();
        });
        /* setState是异步更新的，查询分类列表应该在setState完成后进行
        * 故需要将其写在回调函数中*/
    }

    //从二级列表返回一级列表显示
    backToMainCateList = () => {
        this.setState({
            parentId: "0",
            parentName: "",
            subCategories: []
        });
    }

    //显示添加分类对话框
    showAddCateModal = () => {
        this.setState({modalDisplayStatus: 1});
    }

    //显示修改分类对话框
    showUpdateCateModal = (category) => {
        this.category = category;//保存分类对象
        this.setState({modalDisplayStatus: 2});//修改状态，显示对话框
    }

    //发送添加分类请求
    handleAddCategory = () => {
        //1.触发表单验证
        this.addFormInstance.current.validateFields().then(async values => {
            //2.隐藏对话框
            this.setState({modalDisplayStatus: 0});
            //3.发送请求，添加分类
            const parentId = values.belongingCate;
            const categoryName = values.newCategoryName;
            const response = await reqAddCategory(parentId, categoryName);
            //4.请求成功时重新加载列表，失败弹出提示
            if (response.status === 0) {
                // 添加的分类就是当前分类列表下的分类
                if (parentId === this.state.parentId) {
                    // 重新获取当前分类列表显示
                    this.getCategories();
                } else if (parentId === '0') { // 在二级分类列表下添加一级分类, 重新获取一级分类列表, 但不需要显示一级列表
                    this.getCategories('0');
                }
            } else {
                message.error("添加分类失败");
            }
            this.addFormInstance.current.resetFields();//清除表单数据
        }).catch(error => {
            message.error("请输入分类名称");
        });
    }

    //发送修改分类请求
    handleUpdateCategory = () => {
        //1.触发表单验证
        this.updateFormInstance.current.validateFields().then(async values => {
            //2.隐藏对话框
            this.setState({modalDisplayStatus: 0});
            //3.发送请求，更新分类
            const categoryId = this.category._id;
            const categoryName = values.newCategoryName;
            const response = await reqUpdateCategory(categoryId, categoryName);
            //4.请求成功时重新加载列表，失败弹出提示
            if (response.status === 0) {
                this.getCategories();
            } else {
                message.error("更新分类失败");
            }
            this.updateFormInstance.current.resetFields();//清除表单数据
        }).catch(error => {
            message.error("请输入分类名称");
        });
    }

    //隐藏添加/更新分类对话框
    handleModalCancel = () => {
        //清除表单数据
        if (this.addFormInstance) {
            this.addFormInstance.current.resetFields();
        }
        if (this.updateFormInstance) {
            this.updateFormInstance.current.resetFields();
        }
        //隐藏表单
        this.setState({modalDisplayStatus: 0});
    }
}

export default Category;