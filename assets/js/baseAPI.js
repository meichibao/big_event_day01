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


        if (options.url.indexOf('/my/') !== -1) {
            options.headers = {
                Authorization: localStorage.getItem('tokens') || ''
            }
        }



        // 登录拦截
        options.complete = function (res) {
            console.log(res);

            const obj = res.responseJSON;
            // console.log(obj);
            if (obj.status === 1 && obj.message === '身份认证失败！') {
                localStorage.removeItem('tokens');
                location.href = '/login.html';
            }


        }
    });

    //添加完功能记得添加到笔记
})