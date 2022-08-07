import React from 'react';
import ReactDOM from 'react-dom/client';
import {ConfigProvider} from 'antd';
import zhCN from 'antd/es/locale/zh_CN';// 在需要用到的 组件文件中引入中文语言包

import './index.css';
import App from './App';
import memoryUtils from './utils/memoryUtils';
import storageUtils from './utils/storageUtils';

//从持久存储中获取登陆用户信息，存入内存
const loginUser = storageUtils.getLoginUser();
memoryUtils.user = loginUser;

// 将App组件标签渲染到index.html页面的id为root的元素上
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ConfigProvider locale={zhCN}>
            <App/>
        </ConfigProvider>
    </React.StrictMode>
);
