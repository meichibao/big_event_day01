$(function () {
    /* 提交重置密码验证 */
    let form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length < 2 || value.length > 6) {
                return "昵称长度为2-6位之间!"
            }
        }
    })



    // 导出layer
    let layer = layui.layer;
    // 用户资料渲染
    initUserInfo();


    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            type: 'get',
            // data: {},
            // dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    // 获取失败
                    return layer.msg(res.messages);
                }
                //成功后渲染
                form.val('formUserInfo', res.data)
            }
        })
    }


    ///点击重置
    $("#btnReset").on('click', function (e) {
        e.preventDefault();

        // 用户资料渲染
        initUserInfo();
    })

    //修改 用信息
    $(".layui-form").on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/userinfo',
            type: 'post',
            data: $(this).serialize(),
            // dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('用户信息修改失败!')
                }
                layer.msg('用户信息修改成功!');

                window.parent.gitUserinfo();
                // console.log(window.parent);

            }
        })
    })


})