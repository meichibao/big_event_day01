$(function () {
    template.defaults.imports.dateFormat = function (dtStr) {
        let dt = new Date(dtStr);
        let y = pad(dt.getFullYear());
        let m = pad(dt.getMonth() + 1);
        let d = pad(dt.getDate());

        let hh = pad(dt.getHours());
        let mm = pad(dt.getMinutes());
        let ss = pad(dt.getSeconds());

        return `${y}-${m}-${d}  ${hh}:${mm}:${ss}`;
    }

    // 补零操作
    function pad(num) {
        return num < 10 ? '0' + num : num
    }

    // 获取参数
    let q = {
        pagenum: 1,	            //是	int	页码值
        pagesize: 3,            //	是	int	每页显示多少条数据
        cate_id: "",            //否	string	文章分类的 Id
        state: ""	            //否	string	文章的状态，可选值有：已发布、草稿
    }
    initTable();

    function initTable() {
        $.ajax({
            url: '/my/article/list',
            type: 'GET',
            data: q,
            // dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    layui.layer.msg(res.message);
                }
                let htmlstr = template("tpl-bable", { data: res.data });
                // console.log(htmlstrs);
                $("tbody").html(htmlstr);


                // 调用分页
                renderPage(res.total);
            }
        })
    }


    // 初始化分类
    let form = layui.form;
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
                // console.log(htmlstr);

                $("[name=cate_id]").html(htmlstr);
                form.render();
            }
        })
    }

    //筛选功能
    $("#form-search").on('submit', function (e) {
        e.preventDefault()
        // 获取
        let cate_id = $("[name=cate_id]").val();
        let state = $("[name=state]").val();

        q.cate_id = cate_id;
        q.state = state;
        // 初始化
        initTable()
    });


    // 分页

    var laypage = layui.laypage;
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,   //每页几条
            curr: q.pagenum,     //第几页

            layout: ['prev', 'limit', 'page', 'next', 'skip'],
            limits: [3, 6, 9, 12, 15],
            // 分页切换会触发
            jump: function (obj, first) {
                if (!first) {
                    // 页码值赋值给q中的pagenum
                    q.pagenum = obj.curr;
                    // console.log(q.pagenum);
                    q.pagesize = obj.limit;
                    // 从新渲染页面
                    initTable();
                }
            }

        });
    }


    // 删除
    $("tbody").on('click', '.btn-delete', function () {
        //id需要在弹出框外面获取,在里面的话this指向会发生改变
        let Id = $(this).attr("data-id");
        layer.confirm('确定删除数据?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/delete/' + Id,
                method: 'get',
                success: (res) => {
                    // console.log(res);
                    if (res.status !== 0) {
                        // 失败
                        return layer.msg(res.message)
                    }
                    //成功
                    layer.msg(res.message);
                    //页面汇总删除按钮个数等于1(只有一条数据),页码大于1
                    if ($(".btn-delete").length == 1 && q.pagenum > 1) q.pagenum--;
                    //从新渲染页面
                    initTable();
                }
            })
            // 关闭弹出框
            layer.close(index);
        });

    })


});

