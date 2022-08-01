# React后台管理系统

## 项目搭建过程

### 创建

通过`create-react-app react_admin_client`命令创建React模板项目。

create-react-app 生成的默认目录结构:

├── README.md  
├── package.json  
├── public  
│ ├── favicon.ico  
│ └── index.html  
├── src  
│ ├── App.css  
│ ├── App.js  
│ ├── App.test.js  
│ ├── index.css  
│ ├── index.js  
│ └── logo.svg  
└── yarn.lock

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

### 登陆页面

登陆页面分为标题区和表单区。表单区使用antd的Form表单组件。

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

### 左侧导航栏

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

class LeftNav extends Component { }
export default withRouter(LeftNav);
```