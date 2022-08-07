import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form, Input} from "antd";

const Item = Form.Item;

/*
* 当Form.Item设置name属性后，子组件会转为受控模式。因而defaultValue和value不会生效。
* 需要在Form上通过initialValues设置默认值。
* 注意initialValues不能被setState动态更新，需要用setFieldsValue来更新
*/
class UpdateForm extends Component {
    updateForm = React.createRef();
    static propTypes = {
        categoryName: PropTypes.string.isRequired,//categoryName属性，类型为字符串，且必须传入
        setFormInstance: PropTypes.func.isRequired,//setFormInstance属性，类型为函数，必须传入
    }

    constructor(props) {
        super(props);
        //调用传入的setFormInstance函数，将表单对象传入父组件
        this.props.setFormInstance(this.updateForm);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.updateForm.current.setFieldsValue({newCategoryName: this.props.categoryName});
    }

    render() {
        const {categoryName} = this.props;
        return (
            <Form ref={this.updateForm} initialValues={{newCategoryName: categoryName}}>
                <Item name="newCategoryName" rules={[{required: true, message: "请输入分类名称！"}]}>
                    <Input placeholder="请输入分类名称"/>
                </Item>
            </Form>
        );
    }
}

export default UpdateForm;