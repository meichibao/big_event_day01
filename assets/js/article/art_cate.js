$(function () {
    //文章类别列表
    initArtCateList();

    // 函数封装  使用模板引擎动态渲染
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            type: 'GET',
            // data: {},
            // dataType: 'json',
            success: (res) => {
                // console.log(res);
                let htmlstr = template('tpl-art', { data: res.data })
                $("tbody").html(htmlstr);
            }
        })
    }

    let layer = layui.layer;
    /*  //当你想关闭当前页的某个层时
    var index = layer.open();
    //正如你看到的，每一种弹层调用方式，都会返回一个index
    layer.close(index); //此时你只需要把获得的index，轻轻地赋予layer.close即可 */
    let indexAdd = null;
    //由于将结构写在js中较为繁琐,可使用模板引擎的方式将结构写好,渲染到弹出层模块
    $("#btnAdd").on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#dialog-add").html()
        });
    });

    // 提交文章分类   事件委托
    $("body").on('submit', "#form-add", function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/article/addcates',
            type: 'POST',
            data: $(this).serialize(),
            // dataType: 'json',
            success: (res) => {
                console.log(res);
                if (res.status !== 0) {
                    // 失败
                    return layer.msg(res.message);
                }

                //成功
                // 重新渲染
                initArtCateList();
                // 清空表单
                // $("#form-add").reset();
                layer.msg(res.message);
                //关弹出框
                layer.close(indexAdd);
            }
        });
    });

    let indexEdit = null;
    let form = layui.form;
    //由于将结构写在js中较为繁琐,可使用模板引擎的方式将结构写好,渲染到弹出层模块
    $("tbody").on('click', '#btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#dialog-Edit").html()
        });
        //获取id
        let Id = $(this).attr("data-id")
        $.ajax({
            url: '/my/article/cates/' + Id,
            type: 'GET',
            // data: {},
            // dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                form.val('form-Edit', res.data)
            }
        })
    });


    //提交修改
    $("body").on('submit', '#form-Edit', function (e) {
        e.preventDefault();

        $.ajax({
            url: '/my/article/updatecate',
            type: 'POST',
            data: $(this).serialize(),
            // dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    // 失败/
                    return layer.msg(res.message);
                }
                // 重新渲染
                initArtCateList();
                layer.msg(res.message);
                //关闭弹出框
                layer.close(indexEdit);
            }
        })
    })


    //删除
    $("tbody").on('click', '.btn-delete', function () {
        //获取id
        let Id = $(this).attr("data-id");
        //提示框
        layer.confirm('确定删除该文章?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/deletecate/' + Id,
                type: 'GET',
                // data: {},
                // dataType: 'json',
                success: (res) => {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    // 重新渲染
                    initArtCateList();
                    layer.msg(res.message);
                }
            })
            layer.close(index);
        });

    });


});

