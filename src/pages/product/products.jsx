import React, {Component} from 'react';
import {Switch, Route} from "react-router-dom";

import ProdHome from "./prod-home";
import ProdAddUpdate from "./prod-add-update";
import ProdDetail from "./prod-detail";

class Products extends Component {
    render() {
        return (
            <Switch>
                {/*添加exact属性，使得在路由匹配时，目标路由路径必须与path值完全匹配，才进行路由跳转*/}
                {/*否则，无法访问到二级路由页面add_update和detail*/}
                {/*因为目标路由路径/products/add_update在匹配时，其中的/products先与path="/products"匹配成功，
                   再在ProdHome组件的子路由组件中去匹配/add_update，故无法匹配成功*/}
                <Route path="/products" component={ProdHome} exact/>
                <Route path="/products/add_update" component={ProdAddUpdate} exact/>
                <Route path="/products/detail" component={ProdDetail} exact/>
            </Switch>
        );
    }
}

export default Products;