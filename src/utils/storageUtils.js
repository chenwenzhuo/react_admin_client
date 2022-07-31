/*
* 持久化保存登陆用户信息
*/
import store from 'store';

const USER_KEY = 'login_user';

const storageUtils = {
    // 保存登陆用户
    saveLoginUser(user) {
        store.set(USER_KEY, user);
    },
    // 获取登陆用户
    getLoginUser() {
        return store.get(USER_KEY) || {};
    },
    // 删除登陆用户
    removeLoginUser() {
        store.remove(USER_KEY);
    }
}

export default storageUtils;