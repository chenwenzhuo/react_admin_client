/*
* 包含应用中所有接口请求函数的模块
* 每个函数的返回值都是Promise对象
* 由于配置了代理，请求路径中需要加上/ajaxProxy前缀
*/
import ajax from './ajax'

const AJAX_PREFIX = 'ajaxProxy/';

/**登陆
 * @param username 用户名，字符串类型
 * @param password 密码，字符串类型
 * */
export const reqLogin = (username, password) => ajax(AJAX_PREFIX + 'login', {username, password}, 'POST');


/**获取一级/二级分类列表
 * @param parentId 父分类编号。查询一级分类时，由于其没有父分类，parentId为0
 * */
export const reqCategories = (parentId) => ajax(AJAX_PREFIX + 'manage/category/list', {parentId});

/**根据categoryId获取分类信息
 * @param categoryId 分类Id
 * */
export const reqCategoryInfo = (categoryId) => ajax(AJAX_PREFIX + 'manage/category/info', {categoryId});

/**添加分类
 * @param parentId 父分类编号。添加一级分类时，由于其没有父分类，parentId为0
 * @param categoryName 待添加的分类名称
 * */
export const reqAddCategory = (parentId, categoryName) => ajax(AJAX_PREFIX + 'manage/category/add', {
    parentId, categoryName
}, 'POST');

/**更新分类名称
 * @param categoryId 待更新待分类待id值（由后端生成，查询可得）
 * @param categoryName 分类的新名称
 * */
export const reqUpdateCategory = (categoryId, categoryName) => ajax(AJAX_PREFIX + 'manage/category/update', {
    categoryId, categoryName
}, 'POST');

/**获取商品分页列表
 * @param pageNum 当前请求的分页页码
 * @param pageSize 当前请求的页大小（单页数据条数）
 * */
export const reqProducts = (pageNum, pageSize) => ajax(AJAX_PREFIX + 'manage/product/list', {pageNum, pageSize});

/**根据商品名称/描述，搜索产品分页列表
 * @param pageNum 搜索的页码
 * @param pageSize 搜索的页大小
 * @param searchKey 搜索的关键词
 * @param searchType 搜索类型，值productName/productDesc分别标识根据名称/描述搜索
 * */
export const reqSearchProducts = ({pageNum, pageSize, searchKey, searchType}) =>
    ajax(AJAX_PREFIX + 'manage/product/search', {
        pageNum,
        pageSize,
        [searchType]: searchKey//[searchType]表示使用searchType变量的值，作为对象的属性名
    });

/**更新商品的在售/下架状态
 * @param productId 待更新状态的商品id
 * @param status 商品的新状态
 * */
export const reqUpdateProductStatus = (productId, status) => ajax(AJAX_PREFIX + 'manage/product/updateStatus',
    {productId, status}, 'POST');

/**删除指定名称的已上传图片
 * @param name 要删除的图片名称
 * */
export const reqDeleteImg = (name) => ajax(AJAX_PREFIX + 'manage/img/delete', {name}, 'POST');

/**添加/更新商品
 * 若商品对象参数product中存在 _id 属性，则为更新，否则为添加
 * @param product 商品信息对象
 * */
export const reqAddOrUpdateProduct = (product) => ajax(
    AJAX_PREFIX + 'manage/product/' + (product._id ? 'update' : 'add'),
    product,
    'POST');

/**获取所有角色列表，进行前台分页
 * */
export const reqRoles = () => ajax(AJAX_PREFIX + 'manage/role/list');

/**添加角色
 * @param roleName 角色名称
 * */
export const reqAddRole = (roleName) => ajax(AJAX_PREFIX + 'manage/role/add', {roleName}, 'POST');

/**修改角色权限
 * @param role 角色对象
 * */
export const reqUpdateRole = (role) => ajax(AJAX_PREFIX + 'manage/role/update', role, 'POST');

/**获取所有用户列表
 * */
export const reqUsers = () => ajax(AJAX_PREFIX + 'manage/user/list');

/**添加用户
 * @param user 用户信息对象
 * */
export const reqAddUser = (user) => ajax(AJAX_PREFIX + 'manage/user/add', user, 'POST');

/**删除指定用户
 * @param userId 待删除的用户id
 * */
export const reqDeleteUser = (userId) => ajax(AJAX_PREFIX + 'manage/user/delete', {userId}, 'POST');

/**请求天气数据
 * @param district_id 地区编号
 * */
export const reqWeather = (district_id) => ajax('weatherProxy/weather/v1/', {
    district_id: district_id, data_type: 'all', output: 'json', ak: 'ZBFdHGeqtensMmvLAgPhc22VUBp6u87O'
});
//https://api.map.baidu.com/weather/v1/?district_id=500152&data_type=all&output=json&ak=ZBFdHGeqtensMmvLAgPhc22VUBp6u87O
