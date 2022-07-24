import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// 将App组件标签渲染到index.html页面的id为root的元素上
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);
