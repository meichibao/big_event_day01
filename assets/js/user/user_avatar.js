$(window).on('load', function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);


    // let src = $("#image").attr('src');
    // console.log(src);


    //选择文件
    $("#btnChooseImg").on('click', function () {
        $("#file").click();
    })

    //修改裁剪图片
    $("#file").on('change', function (e) {
        //拿到用户选择的文件
        let file = e.target.files[0];
        // alert(file)
        //非空校验
        if (file == undefined) {
            return layui.layer.msg('请选择图片');
        }
        //根据选择的文件,创建一个对应的URL地址
        let newImgURL = URL.createObjectURL(file)
        // console.log(newImgURL);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });

    // 上传头像 
    $("#btnUpLoad").on('click', function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        $.ajax({
            url: '/my/update/avatar',
            type: 'post',
            data: {
                avatar: dataURL
            },
            // dataType: 'json',
            success: (res) => {
                console.log(res);
                if (res.status !== 0) {
                    //上传失败
                    return layui.layer.msg(res.message)
                }
                //上传成功
                layui.layer.msg(res.message);
                //渲染头像
                window.parent.gitUserinfo();
            }
        })
    })
})