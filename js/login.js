var telTips = document.getElementsByClassName('tel-tips')[0];
var tel = document.getElementsByClassName('login-tel')[0];
var pwd = document.getElementsByClassName('login-pwd')[0];
var btn = document.getElementsByClassName('login-btn')[0];
function login() {
    btn.onclick = function () {
        var obj = {
            mobile : tel.value,
            password : pwd.value
        }
        obj = replaceSpace(obj);
        console.log(obj)
        if(ifNum(obj.mobile) && obj.mobile.length === 11) {
            var user = JSON.stringify(obj);
            // 发送请求
            $.ajax({
                url : 'http://39.97.243.38:6116/user/login',
                type : 'post',
                dataType : 'json',
                data : user,
                contentType: 'application/json',
                success : function (res) {
                    console.log(res);
                    if(res.flag) {
                        sessionStorage.setItem("token", res.data.token);
                        sessionStorage.setItem("avatar", res.pojos.avatar);
                        sessionStorage.setItem("name", res.pojos.nickname);
                        sessionStorage.setItem("mobile", res.data.mobile);
                        alert('登录成功，点击后跳转至主页');
                        location.href = './index.html';
                    }else{
                        alert('输入电话号或密码有误或未注册，请重新输入！');
                        return false;
                    }
                }
            })
        }else{
            telTips.style.display = 'block';
        }
    }
}
function tipsDisappear() {
    tel.onfocus = function () {
        telTips.style.display = 'none';
    }
}
function init() {
    tipsDisappear();
    backToPrevious(); 
    login();
}
init();