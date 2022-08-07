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

/**获取一级/二级分类列表
 * @param parentId 父分类编号。查询一级分类时，由于其没有父分类，parentId为0
 * */
export const reqCategories = (parentId) => ajax('ajaxProxy/manage/category/list', {parentId});

/**添加分类
 * @param parentId 父分类编号。添加一级分类时，由于其没有父分类，parentId为0
 * @param categoryName 待添加的分类名称
 * */
export const reqAddCategory = (parentId, categoryName) =>
    ajax('ajaxProxy/manage/category/list', {
        parentId,
        categoryName
    }, 'POST');

/**更新分类名称
 * @param categoryId 待更新待分类待id值（由后端生成，查询可得）
 * @param newCategoryName 分类待新名称
 * */
export const reqUpdateCategory = (categoryId, newCategoryName) =>
    ajax('ajaxProxy/manage/category/list', {
        categoryId,
        newCategoryName
    }, 'POST');

/**请求天气数据
 * @param district_id 地区编号
 * */
export const reqWeather = (district_id) => ajax('/weatherProxy/weather/v1/', {
    district_id: district_id,
    data_type: 'all',
    output: 'json',
    ak: 'ZBFdHGeqtensMmvLAgPhc22VUBp6u87O'
});
//https://api.map.baidu.com/weather/v1/?district_id=500152&data_type=all&output=json&ak=ZBFdHGeqtensMmvLAgPhc22VUBp6u87O
