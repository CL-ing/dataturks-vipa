/*
 * @Author: Azhou
 * @Date: 2021-05-12 15:29:10
 * @LastEditors: Azhou
 * @LastEditTime: 2021-05-12 20:21:31
 */

// 开发环境下才会启用的转发代理
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(createProxyMiddleware(
        '/dataturks',
        {
            // target : 'http://localhost:9090/',
            target : 'http://47.111.17.95:9090/',
            changeOrigin : true,
            ws: true,
    }));
};