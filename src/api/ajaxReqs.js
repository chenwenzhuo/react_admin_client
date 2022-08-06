/*
* 包含应用中所有接口请求函数的模块
* 每个函数的返回值都是Promise对象
* 由于配置了代理，请求路径中需要加上/ajaxProxy前缀
*/
import ajax from './ajax'

/**登陆
 * @param username 用户名，字符串类型
 * @param password 密码，字符串类型
 * */
export const reqLogin = (username, password) => ajax('/ajaxProxy/login', {username, password}, 'POST');

/**添加用户
 * @param user 用户信息对象
 * */
export const reqAddUser = (user) => ajax('/ajaxProxy/manage/user/add', user, 'POST');

export const reqWeather = (district_id) => ajax('/weatherProxy/weather/v1/', {
    district_id: district_id,
    data_type: 'all',
    output: 'json',
    ak: 'ZBFdHGeqtensMmvLAgPhc22VUBp6u87O'
});
//https://api.map.baidu.com/weather/v1/?district_id=500152&data_type=all&output=json&ak=ZBFdHGeqtensMmvLAgPhc22VUBp6u87O
