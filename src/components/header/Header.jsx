import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {Cascader, Modal} from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';

import {reqWeather} from '../../api/ajaxReqs';
import memoryUtils from '../../utils/memoryUtils';
import {formatDate} from "../../utils/dateUtils";
import './Header.less';
import storageUtils from "../../utils/storageUtils";

class Header extends Component {
    state = {
        currentTime: formatDate(Date.now()),//当前时间字符串
        weatherDesc: "",//天气文本描述
        options: [{
            value: 'beijing', label: '北京', children: [{
                value: '110105', label: '朝阳'
            }, {
                value: '110106', label: '丰台'
            }, {
                value: '110108', label: '海淀'
            }],
        }, {
            value: 'sichuan', label: '四川', children: [{
                value: '510100', label: '成都'
            }, {
                value: '510700', label: '绵阳'
            }, {
                value: '511500', label: '宜宾'
            }],
        }, {
            value: 'chongqing', label: '重庆', children: [{
                value: '500102', label: '涪陵'
            }, {
                value: '500103', label: '渝中'
            }, {
                value: '500106', label: '沙坪坝'
            }, {
                value: '500107', label: '九龙坡'
            }, {
                value: '500152', label: '潼南'
            }],
        }]
    }

    render() {
        const {username} = memoryUtils.user;//当前已登陆的用户名称
        const {options, currentTime, weatherDesc} = this.state;
        const menuName = this.props.location.state ? this.props.location.state.menuName : "首页";
        return (<div className='header'>
            <div className="header-top">
                <span>欢迎，{username}</span>
                <button onClick={this.handleQuitClick}>退出</button>
            </div>
            <div className="header-bottom">
                <div className="header-bottom-left">{menuName}</div>
                <div className="header-bottom-right">
                    <span className="header-bottom-right-time">{currentTime}</span>
                    <Cascader defaultValue={['北京', '朝阳']} options={options}
                              onChange={this.handleLocationChange} expandTrigger="hover"
                              placement="bottomLeft" style={{width: "150px"}}/>
                    <span className="header-bottom-right-weather">{weatherDesc}</span>
                </div>
            </div>
        </div>);
    }

    componentDidMount() {
        this.updateCurrentTime();
        this.reqWeatherData("110105");
    }

    componentWillUnmount() {
        clearInterval(this.updateTimeInterval);//清除定时器
    }

    handleQuitClick = async () => {
        Modal.confirm({
            title: "是否确认退出登陆？",
            icon: <ExclamationCircleOutlined/>,
            content: "点击\"确认\"立即退出，点击\"取消\"保持登陆状态",
            okText: "确认",
            cancelText: "取消",
            onOk: () => {
                //删除保存的用户数据，并跳转到登陆界面
                storageUtils.removeLoginUser();
                memoryUtils.user = {};
                this.props.history.replace("/login");
            },
        });
    }

    // 按秒更新当前时间
    updateCurrentTime = () => {
        this.updateTimeInterval = setInterval(() => {
            const currentTime = formatDate(Date.now());
            this.setState({currentTime});
        }, 1000);
    }

    // 获取天气数据
    reqWeatherData = async (district_id) => {
        const response = await reqWeather(district_id);
        const weatherDesc = response.data.result.now.text;
        this.setState({weatherDesc});
    }

    handleLocationChange = (value) => {
        this.reqWeatherData(value[1]);
    }
}

export default withRouter(Header);