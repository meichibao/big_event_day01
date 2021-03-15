$(function () {

    gitUserinfo();


    // 退出登录操作
    $("#btnLogout").on('click', function () {

        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 清空本地token
            localStorage.removeItem('tokens');
            //跳转到登录界面
            location.href = '/login.html'

            layer.close(index);
        });
    })
});

// 获取用户基本信息
function gitUserinfo() {
    $.ajax({
        url: '/my/userinfo',
        type: 'get',
        // data: {},
        // dataType: 'json',
        //将他写入ajaxPrefilter  函数中
        // headers: {
        //     Authorization: localStorage.getItem('tokens') || ''
        // },
        success: (res) => {
            // console.log(res);
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            // 请求成功,渲染头像
            renderAvatar(res.data);
        }
    });
}

function renderAvatar(user) {
    let name = user.nickname || user.username;
    if (user.user_pic !== null) {
        //有图片时,将地址改成有图片的地址
        $(".layui-nav-img").show().attr('src', user.user_pic);
        ///将文本头像隐藏
        $(".text-avatar").hide();
    } else {
        //没有头像时
        $(".layui-nav-img").hide();
        //取出名字的第一个字母,转换成大写,成文本头像
        $(".text-avatar").show().html(name[0].toUpperCase());
        $("#welcome").html('欢迎 &nbsp;&nbsp;' + name);
    }


}
