$(function () {
    getUserinfo();


    var layer = layui.layer;
    $('#btnLogout').on('click', function () {
        // console.log('ok');
        layer.confirm('确认退出登录', { icon: 3, title: '提示' }, function (index) {
            //do something
            //清空本地存储中的token
            localStorage.removeItem('token');
            // 重新跳转到登录页
            location.href = '/login.html'

            layer.close(index);
        });
    })
});

// 获取用户的基本信息
function getUserinfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization:localStorage.getItem('token') || ''
        // },
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }

            renderAvatar(res.data);
        }
        // // 不论成功还是失败，最终都会调用complete函数
        // complete: function(res){
        //     console.log(res);
        //     if( res.responseJSON.status === 1 && res.responseJSON.message==='身份认证失败！'){
        //         // 强制清空token
        //         localStorage.removeItem('token');
        //         location.href = '/login.html'
        //     }
        // }

    });
}

// 渲染用户的头像
function renderAvatar(user) {
    // 获取用户的名称
    var name = user.nickname || user.username
    // 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 按需渲染用户的头像
    if (user.user_pic != null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }

}