/*
* 发送异步ajax请求的函数模块
* 封装ajax库
* 函数的返回值是Promise对象
*/
import axios from "axios"


/**
 * @param url 请求地址
 * @param data 请求数据，默认值为空对象
 * @param type 请求方式，默认值为"GET"
 * */
export default function ajax(url, data = {}, type = 'GET') {
    //发送get请求
    if (type === 'GET') {
        return axios.get(url, {params: data});
    }
    //发送post请求
    return axios.post(url, data);
}