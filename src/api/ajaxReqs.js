/*
* 包含应用中所有接口请求函数的模块
* 每个函数的返回值都是Promise对象
*/
import ajax from './ajax'

/**登陆
 * @param username 用户名，字符串类型
 * @param password 密码，字符串类型
 * */
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST');

/**添加用户
 * @param user 用户信息对象
 * */
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST');
