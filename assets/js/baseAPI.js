$(function () {
    // $.ajaxPrefilter()可以在调用ajax调用时,拦截所有请求,对参数进行处理
    // 开发环境服务器路径地址
    let baseURL = 'http://ajax.frontend.itheima.net';
    // // 测试环境服务器路径地址
    // let baseURL = 'http://ajax.frontend.itheima.net';
    // // 生产环境服务器路径地址
    // let baseURL = 'http://ajax.frontend.itheima.net';

    $.ajaxPrefilter(function (options) {
        options.url = baseURL + options.url;
    })
})