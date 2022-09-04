# React后台管理系统

## 项目搭建过程

### 创建

通过`create-react-app react_admin_client`命令创建React模板项目。

### 引入Antd

[antd官方文档](https://ant.design/index-cn)

```
yarn add antd
```

### Antd按需打包与自定义主题

使用`craco`（一个对 create-react-app 进行自定义配置的社区解决方案）对`create-react-app`的默认配置进行自定义。

```
yarn add @craco/craco
yarn add craco-less
```

修改`package.json`中的`script`属性。

```
/* package.json */
"scripts": {
    -   "start": "react-scripts start",
    -   "build": "react-scripts build",
    -   "test": "react-scripts test",
    +   "start": "craco start",
    +   "build": "craco build",
    +   "test": "craco test",
}
```

然后在项目根目录创建一个`craco.config.js`用于修改默认配置。

为自定义主题，需要把 `src/App.css` 文件修改为 `src/App.less`，然后修改样式引用为 `less` 文件。

```
/* src/App.js */
- import './App.css';
+ import './App.less';
```

```
/* src/App.less */
- @import '~antd/dist/antd.css';
+ @import '~antd/dist/antd.less';
```

修改 `craco.config.js` 文件如下:

```
const CracoLessPlugin = require('craco-less');

module.exports = {
    // 按需打包
    babel: {
        plugins: [["import", {
            "libraryName": "antd", "libraryDirectory": "es", "style": true
        }]]
    },
    // 自定义主题
    plugins: [{
        plugin: CracoLessPlugin, options: {
            lessLoaderOptions: {
                lessOptions: {
                    modifyVars: {'@primary-color': '#1DA57A'},//自定义主题色
                    javascriptEnabled: true,
                },
            },
        },
    },],
};
```

## 各组件实现要点

### 登陆 src/pages/login

登陆页面分为标题区和表单区。

标题区包含项目logo和项目名称。

React中为`<img/>`标签指定`src`属性时，不能直接使用图片路径。

```
{/*React中不支持直接使用路径引用图片*/}
{/*<img src="./img/logo.png" alt="logo"/>*/}
```

需要将图片先引入，再赋值给`src`属性。
```jsx
import logo from '../../assets/img/logo.png';

<img src={logo} alt="logo" className="login-logo"/>
```

表单区使用antd的Form表单组件。

```jsx
<Form onFinish={this.handleSubmit} className="login-form" ref={this.formRef}>
    {/*对用户名进行声明式校验*/}
    <Form.Item name='username' rules={[
        {required: true, message: '请输入用户名！'},
        {min: 4, message: '用户名不少于4位！'},
        {max: 12, message: '用户名不多于12位！'},
        {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名应由字母、数字、下划线组成！'},
    ]}>
        <Input
            prefix={<UserOutlined/>}
            placeholder="用户名"
        />
    </Form.Item>
    {/*密码进行自定义校验*/}
    <Form.Item name='password' rules={[{validator: this.validatePwd}]}>
        <Input
            prefix={<LockOutlined/>}
            type="password"
            placeholder="密码"
        />
    </Form.Item>
    <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
            登陆
        </Button>
    </Form.Item>
</Form>
```

引入所需antd组件、图标。antd v3中，图标与组件都从`antd`中引入。antd v4中，从`@ant-design/icons`中引入。

```
import {Form, Input, Button} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
```

antd v3中，Form组件使用onSubmit事件触发提交回调，antd v4中改用onFinish触发提交回调。提交时，为在回调函数中获取表单对象，需要为表单创建ref，即可通过`this.formRef.current`
获取表单对象。

每一个表单项都使用`<Form.Item>`标签包裹，`<Form.Item>`标签属性中可定义输入字段名、校验规则等。

对表单输入项进行校验时，可直接在`<Form.Item>`标签的`rules`属性中指定校验规则（声明式校验）：

```
rules={[
        {required: true, message: '请输入用户名！'},
        {min: 4, message: '用户名不少于4位！'},
        {max: 12, message: '用户名不多于12位！'},
        {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名应由字母、数字、下划线组成！'},
    ]}
```

或通过`rules`属性指定校验回调函数，进行自定义校验：

```
rules={[{validator: this.validatePwd}]}
```

```jsx
validatePwd = (rule, value) => {
    return new Promise((resolve, reject) => {
        if (!value) reject("密码必须输入");
        else if (value.length < 4) reject("密码长度不低于4位！");
        else if (value.length > 12) reject("密码长度不多于12位！");
        else if (!/^[a-zA-Z0-9_]+$/.test(value)) reject("密码应由字母、数字、下划线组成!");
        else resolve();
    })
}
```

### 左侧导航栏 src/components/left-nav

导航栏主体结构使用antd Menu组件完成。从antd 4.20.0版本开始，使用`<Menu/>`标签与`items`配置对象数组的方式定义菜单结构。

```jsx
<Menu
    mode="inline"
    theme="dark"
    items={items}
    selectedKeys={[curPath]}
    defaultOpenKeys={curItem ? [curItem.key] : []}
    onClick={(itemInfo) => {
        this.handleMenuClick(itemInfo);
    }}
/>

getItem = (label, key, icon, children, type) => {
    return {key, icon, children, label, type};
}

state = {
    items: [
        this.getItem('首页', '/home', <HomeOutlined/>),
        this.getItem('商品', '/prodCate', <AppstoreOutlined/>, [
            this.getItem('品类管理', '/category', <UnorderedListOutlined/>),
            this.getItem('商品管理', '/products', <ToolOutlined/>)
        ]),
        this.getItem('用户管理', '/user', <UserOutlined/>),
        this.getItem('角色管理', '/role', <CheckCircleOutlined/>),
        this.getItem('图形图表', '/charts', <AreaChartOutlined/>, [
            this.getItem('柱形图', '/charts/barchart', <BarChartOutlined/>),
            this.getItem('折线图', '/charts/linechart', <LineChartOutlined/>),
            this.getItem('饼图', '/charts/piechart', <PieChartOutlined/>),
        ]),
    ]
};
```

通过`withRouter`高阶函数，实现在非路由组件中使用`history`, `location`, `match`等对象：

```jsx
import {withRouter} from "react-router-dom";

class LeftNav extends Component {
}

export default withRouter(LeftNav);
```

### 右侧头部栏 src/components/header

主要实现了显示当前登陆人、退出登陆、显示当前时间、选择地点并显示实时天气的功能。

使用`antd`的`Modal`弹出框组件，在退出前进行确认：

```jsx
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
```

配置代理实现跨域，获取百度地图天气数据：

```js
createProxyMiddleware('/weatherProxy', {
    target: 'https://api.map.baidu.com',
    changeOrigin: true,
    pathRewrite: {'^/weatherProxy': ''}
});
```

定义天气数据获取接口：

```js
export const reqWeather = (district_id) => ajax('/weatherProxy/weather/v1/', {
    district_id: district_id,
    data_type: 'all',
    output: 'json',
    ak: 'ZBFdHGeqtensMmvLAgPhc22VUBp6u87O'
});
```

最终以`GET`方式获取天气数据，URL为：

```
https://api.map.baidu.com/weather/v1/?district_id=500152&data_type=all&output=json&ak=ZBFdHGeqtensMmvLAgPhc22VUBp6u87O
```

### 商品-品类管理

以表格（`antd`的`<Table/>`组件）的形式对商品品类进行展示，包含一级分类和二级分类。表格支持翻页、调整单页数据条数、跳转到指定页等功能。

实现了查询、新增、修改商品品类等请求接口，并在此基础上使表格支持添加新品类和对已有分类进行重命名等功能。添加新品类时可以选择其所属的父分类。

`antd`中`<Form/>`组件注意事项：

> 当`<Form.Item/>`设置`name`属性后，子组件会转为受控模式（只能从单一数据源获取数据）。因而输入组件（`<Input/>`、`<Select/>`等）的`defaultValue`和`value`属性不会生效。
>
> 需要在`<Form/>`上通过`initialValues`属性设置默认值。 注意`initialValues`不能被`setState`动态更新，需要用`setFieldsValue`方法来更新。

### 商品-商品管理

分页实现技术：

1. 前台分页
    - 请求获取数据: 一次获取所有数据, 翻页时不需要再发请求
    - 请求接口：不需要指定请求参数: 页码(pageNum)和每页数量(pageSize)
    - 响应数据：所有数据的数组

2. 基于后台的分页
    - 请求获取数据: 每次只获取当前页的数据, 翻页时要发请求
    - 请求接口：需要指定请求参数: 页码(pageNum)和每页数量(pageSize)
    - 响应数据：当前页数据的数组 + 总记录数(total)