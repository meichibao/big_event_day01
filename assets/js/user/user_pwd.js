$(function () {
    let form = layui.form;
    // 密码校验规则
    form.verify({
        // 密码格式
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],

        // 新密码  不能与原密码相同
        sampwd: function (value) {
            if (value === $("[name=oldPwd]").val()) {
                return '新密码与原密码不能相同!'
            }
        },

        //确认密码,要与新密码一致
        repwd: function (value) {
            if (value !== $("[name=newPwd]").val()) {
                return '两次输入的密码不一致'
            }
        }

    });

    // 修改密码
    $(".layui-form").on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/updatepwd',
            type: 'POST',
            data: $(this).serialize(),
            // dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    // 失败
                    return layui.layer.msg(res.message, { icon: 6 });
                }

                // 成功
                layui.layer.msg(res.message, { icon: 6 });
                // 清空表单
                $(".layui-form")[0].reset();
            }
        })
    })
})


