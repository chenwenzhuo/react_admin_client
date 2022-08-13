import React, {Component} from 'react';
import {Modal, Upload, message} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import PropTypes from "prop-types";

import {reqDeleteImg} from "../../api/ajaxReqs";
import {BASE_IMG_URL} from "../../utils/constants";

//用于上传商品图片的组件
class PicturesWall extends Component {
    state = {
        previewVisible: false,//标识是否显示大图预览弹窗
        previewImage: "",//预览大图的url
        previewTitle: "",//预览大图的窗口标题
        fileList: [],//所有已上传图片的数组
    }

    static propTypes = {
        imgs: PropTypes.array,//图片名称，数组，非必传
    }

    render() {
        const {fileList, previewVisible, previewTitle, previewImage} = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined/>
                <div style={{marginTop: 8}}>上传</div>
            </div>
        );
        return (
            <div>
                <Upload action="http://localhost:3000/ajaxProxy/manage/img/upload"/*上传图片的接口地址*/
                        name={"image"}/*请求参数名*/
                        accept={"image/*"}/*接受的文件类型*/
                        listType="picture-card"/*组件在页面上展示的样式*/
                        fileList={fileList}/*所有已上传的文件对象数组*/
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}>
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%',}} src={previewImage}/>
                </Modal>
            </div>
        );
    }

    componentDidMount() {
        //初始化图片信息数组
        let fileList = [];
        this.setState({fileList});
        const {imgs} = this.props;
        if (imgs && imgs.length > 0) {//若传入了图片
            fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: "done",
                url: BASE_IMG_URL + img
            }));
        }
        this.setState({fileList});
    }

    //将图片文件序列化
    getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    //隐藏大图预览弹窗
    handleCancel = () => {
        this.setState({previewVisible: false});
    }

    handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
        });
    }

    handleChange = async ({file, fileList}) => {
        if (file.status === "done") {//图片上传完成
            const {response: {status, data: {name, url}}} = file;//连续结构赋值，从file对象中取出数据
            if (status === 0) {
                message.success("图片上传成功");
                /*初始时，fileList数组元素中没有url属性，name属性为图片上传前的原始名称
                * 上传后，后端会对图片重命名，前端需要拿到重命名后的名称，和上传后的url
                * 故使用file对象中数据更新fileList*/
                //需要更新的是fileList中的最后一个对象
                file = fileList[fileList.length - 1];
                file.name = name;
                file.url = url;
            } else {
                message.error("图片上传失败");
            }
        } else if (file.status === "removed") {
            const response = await reqDeleteImg(file.name);
            if (response.status === 0) {
                message.success("删除图片成功");
            } else {
                message.error("删除图片失败");
            }
        }
        this.setState({fileList});
    }

    getImageNames = () => {
        //返回一个图片名的数组
        return this.state.fileList.map(item => item.name);
    }
}

export default PicturesWall;