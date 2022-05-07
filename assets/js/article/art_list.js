$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data);

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要请求对象提交到服务器

    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    initTable()
    initCate()

    // 获取文章的列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章的列表数据失败');
                }
                //使用模板引擎渲染数据
                console.log(res);
                // layer.msg('获取文章的列表数据成功');
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);
                // console.log(htmlStr);
                // 渲染分页
                renderPage(res.total);
            }
        })
    }


    // 获取文章分类列表
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败哦');
                }
                //调用模板引擎渲染分类数据

                var htmlStr = template('tpl-cate', res)
                // console.log(htmlStr);
                $('[name="cate_id"]').html(htmlStr)
                // 通知layui重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 未筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('[name="cate_id"]').val()
        var state = $('[name="state"]').val()
        // 为查询对象中q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 重新渲染页面
        initTable()

    })

    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total,//数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    //do something
                    initTable()
                }
            }
        });
    }

    // 通过代理的形式，未删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取页面上删除按钮的个数
        var len = $('.btn-delete').length
        // 获取文章的id
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })

})