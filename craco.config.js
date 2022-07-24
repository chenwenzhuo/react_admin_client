const CracoLessPlugin = require('craco-less');

module.exports = {
    //按需引入
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
                    modifyVars: {'@primary-color': '#1DA57A'}, javascriptEnabled: true,
                },
            },
        },
    },],
};