$(function () {
    // 设置点击事件
    //点击去注册,隐藏登录界面
    $("#link_reg").on('click', function () {
        // console.log(123);
        $(".login_box").hide();
        $(".reg_box").show();
    });
    //点击去登录隐藏注册盒子
    $("#link_login").on('click', function () {
        // console.log(123);
        $(".reg_box").hide();
        $(".login_box").show();
    })



    // /* 密码验证 */
    let form = layui.form;

    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],

        // 自定义确认密码注册校验
        regpwd: function (value, item) {
            // console.log(value, item);
            const pwd = $(".reg_box input[name=password]").val();
            // console.log(pwd);
            if (value !== pwd) {
                return '两次输入密码不一致'
            }
        }
    });

    // 注册用户
    $("#form-reg").on('submit', function (e) {
        // 阻止表单默认提交事件
        e.preventDefault();

        $.ajax({
            url: '/api/reguser',
            type: 'post',
            data: {
                username: $(".reg_box input[name=username]").val(),
                password: $(".reg_box input[name=password]").val()
            },
            // dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    //失败状态
                    return layer.msg(res.message, { icon: 5 });
                }
                //成功状态
                layer.msg(res.message, { icon: 6 });

                //成功跳转到登录页面
                $("#link_login").click();
                // 清空表单
                $("#form-reg")[0].reset();
            }
        })
    })

    // 登录
    $("#form-login").on('submit', function (e) {
        // 阻止表单默认提交事件
        e.preventDefault();

        $.ajax({
            url: '/api/login',
            type: 'post',
            data: $(this).serialize(),
            // dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    //失败状态
                    return layer.msg(res.message, { icon: 5 });
                }

                //成功操作
                layer.msg(res.message, { icon: 6 });
                //跳转后台首页
                location.href = '/index.html'
                //将返回的token保存到本地
                localStorage.setItem('tokens', res.token)
            }
        })
    })


});