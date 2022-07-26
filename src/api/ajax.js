/*
* 发送异步ajax请求的函数模块
* 封装ajax库
* 函数的返回值是Promise对象
*/
import axios from "axios"
import {message} from 'antd'


/**
 * @param url 请求地址
 * @param data 请求数据，默认值为空对象
 * @param type 请求方式，默认值为"GET"
 * */
export default function ajax(url, data = {}, type = 'GET') {
    /*为所有ajax请求统一进行异常处理
    * 由于此自定义ajax接口需要返回一个Promise，故在所有操作外层包装一层Promise对象
    * 当axios请求成功时，调用外层Promise当resolve方法，将其状态设为成功
    * 当axios请求失败，直接进行错误处理（弹窗提示），而不是调用外层Promise当reject
    * 所以此自定义ajax接口的返回值始终是一个成功的Promise对象，故在调用此接口的地方不再需要分别进行异常处理*/
    return new Promise((resolve, reject) => {
        let promise;
        // 1.执行异步请求
        if (type === 'GET') {
            promise = axios.get(url, {params: data});//发送get请求
        } else {
            promise = axios.post(url, data);//发送post请求
        }
        // 2.若成功，调用resolve
        promise.then(response => {
            resolve(response);
        }).catch(error => {// 3.若失败，不调用reject，而是弹窗提示异常信息
            console.log('请求出错！',error);
            message.error('请求出错！' + error.message);
        });
    });
}
