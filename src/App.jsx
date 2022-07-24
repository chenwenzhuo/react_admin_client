import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";

import Login from "./pages/login/login"
import Admin from "./pages/admin/admin"

import './App.less';

/*出现 export 'Switch' (imported as 'Switch') was not found in 'react-router-dom'
* 报错时，将react-router-dom的版本切换为5.x：yarn add react-router-dom@5*/

// 应用根组件
class App extends Component {
    render() {
        return (
            <BrowserRouter>
                {/* 使用<Switch>，一旦匹配成功，就停止匹配*/}
                <Switch>
                    <Route path="/login" component={Login}/>
                    <Route path="/" component={Admin}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
