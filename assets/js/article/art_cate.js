$(function () {
    var layer = layui.layer;
    var form = layui.form;

    initArtCateList()

    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加按钮绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    // 通过代理的形式，为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg('新增分类失败');
                }
                initArtCateList()
                layer.msg('新增分类成功');
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的形式，为btn-add表单绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function (e) {
        // console.log(e);
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id')
        // 发起请求获取对应的数据

        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)

            }
        })
    })

    // 通过代理的形式，为form-edit表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg('更新分类失败');
                }
                initArtCateList()
                layer.msg('更新分类成功');
                layer.close(indexEdit)
            }
        })

    })

    // 通过代理的形式，为btn-delete绑定点击事件
    $('tbody').on('click', '.btn-delete', function (e) {
        // console.log('ok');
        var id = $(this).attr('data-id')
        // console.log(id);

        layer.confirm('是否删除分类?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功')
                    initArtCateList()
                }
            })
            layer.close(index);
        });

    })

})