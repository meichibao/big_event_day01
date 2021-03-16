$(function () {

    let form = layui.form;

    //设置表单信息,用于编辑
    // console.log(location);
    function initForm() {
        // 获取到当前需要被修改文章的id值
        let id = location.search.split("=")[1];
        // console.log(id);
        $.ajax({
            url: '/my/article/' + id,
            method: 'get',
            // data: {},
            dataType: 'json',
            success: (res) => {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                //将获取到的内容添加到表单中
                form.val('form-edit', res.data);
                //富文本编辑器tinymce获取文本内容和设置文本内容
                // tinyMCE.activeEditor.setContent(res.data.content);
                // tinymce.activeEditor.setContent(res.data.content);
                // console.log(baseURL);
                // 处理图片
                if (!res.data.cover_img) {
                    return layui.layer.msg('该用户没有上传文章封面!')
                }
                //拼接图片路径
                let newImgURL = baseURL + res.data.cover_img;

                console.log(newImgURL);

                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', newImgURL)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域
            }
        })

    }


    // 初始化分类
    initCate();

    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            method: 'get',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                let htmlstr = template('tpl-cate', { data: res.data });
                $("[name=cate_id]").html(htmlstr);

                form.render();
                // 文章分类渲染完毕 再调用该函数
                initForm();
            }
        })
    }

    // 初始化富文本编辑器
    initEditor();


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);


    // 点击按钮选择图片
    $("#btnChooseImage").on('click', function () {
        $("#coverFile").click();
    });

    // 设置图片
    $("#coverFile").on('change', function (e) {
        let file = e.target.files[0];
        //非空校验
        if (file == undefined) {
            return layui.layer.msg("你可以选择一张图片作为封面")
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });

    //设置状态
    let state = "已发布";
    /* $("#btnSave1").on('click', function () {
        state = "已发布"
    }) */
    $("#btnSave2").on('click', function () {
        state = "草稿"
    });


    //添加文章
    $("#form-pub").on('submit', function (e) {
        e.preventDefault();
        // 创建FoemData对象  收集数据
        let fd = new FormData(this);
        //放入状态
        fd.append('state', state);
        //放入图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            //将Canvas 画布上的内容,转化为文件对象
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // console.log(...fd);
                // ajax请求  在外面封装成函数,结构清晰
                publishArticle(fd);
            });
    })

    //添加文章方法
    function publishArticle(fd) {
        $.ajax({
            url: '/my/article/edit',
            method: 'POST',
            data: fd,
            // FormData数据类型数据ajax提交 需要cp组合
            contentType: false,
            processData: false,
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg(res.message);

                //跳转  用location方法左侧的列表不会跳转
                // location.href = '/article/art_list.html'
                setTimeout(function () {
                    window.parent.document.querySelector("#art_list").click();
                }, 500)

            }
        })
    }

});

