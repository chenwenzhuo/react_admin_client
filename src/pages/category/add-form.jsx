import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form, Select, Input} from "antd";

const Item = Form.Item;
const Option = Select.Option;

class AddForm extends Component {
    addForm = React.createRef();
    static propTypes = {
        parentCategories: PropTypes.array.isRequired,//parentCategories属性，数组，必传
        parentId: PropTypes.string.isRequired,//parentId属性，字符串，必传
        setFormInstance: PropTypes.func.isRequired,//setFormInstance属性，函数，必传
    }

    constructor(props) {
        super(props);
        //调用传入的setFormInstance函数，将表单对象传入父组件
        this.props.setFormInstance(this.addForm);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.addForm.current.setFieldsValue({belongingCate: this.props.parentId});
    }

    render() {
        const {parentCategories} = this.props;
        return (
            <Form ref={this.addForm} initialValues={{belongingCate: this.props.parentId}}>
                <Item label="所属分类：" name="belongingCate"
                      rules={[{required: true, message: "请选择所属分类！"}]}>
                    <Select>
                        <Option value="0" key="0">一级分类</Option>
                        {
                            parentCategories.map(item => {
                                return (
                                    <Option value={item._id} key={item._id}>{item.name}</Option>
                                )
                            })
                        }
                    </Select>
                </Item>
                <Item label="分类名称：" name="newCategoryName"
                      rules={[{required: true, message: "请输入分类名称！"}]}>
                    <Input placeholder="请输入分类名称"/>
                </Item>
            </Form>
        );
    }
}

export default AddForm;