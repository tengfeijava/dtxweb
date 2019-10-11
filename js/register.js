var getCode = document.getElementsByClassName('register-getCode')[0];
var register = document.getElementsByClassName('register-btn')[0];
var timer = null;
var seconds = 60;
var flag = false;
var tel = document.getElementsByClassName('register-tel')[0];
var pwd = document.getElementsByClassName('register-pwd')[0];
var confirm = document.getElementsByClassName('register-confirm')[0];
var code = document.getElementsByClassName('register-inputCode')[0];

var telTips = document.getElementsByClassName('tel-tips')[0];
var pwdTips = document.getElementsByClassName('pwd-tips')[0];
var codeTips = document.getElementsByClassName('code-tips')[0];

function tipsDisappear() {
    tel.onfocus = function () {
        telTips.style.display = 'none';
    }
    pwd.onfocus = function () {
        pwdTips.style.display = 'none';
    }
    confirm.onfocus = function () {
        pwdTips.style.display = 'none';
    }
    code.onfocus = function () {
        codeTips.style.display = 'none';
    }
}

function regist() {
    register.onclick = function () {
        var obj = {
            mobile : tel.value,
            password : pwd.value,
            confirm : confirm.value,
            code : code.value
        }
        obj = replaceSpace(obj);
        console.log(obj);
        for(var i in obj){
            if(obj[i] === ''){
                alert('输入内容不可为空');
                return;
            }
            if(!ifReg(obj[i])){
                alert('不可输入非数字，大小写字母以外任何符号以及汉字');
                return;
            }
        }
        if(ifNum(obj.mobile)) {
            if(obj.mobile.length !== 11){
                telTips.style.display = 'block';
                return;
            }
        }else{
            telTips.style.display = 'block';
            return;
        }
        if(obj.password !== obj.confirm){
            pwdTips.style.display = 'block';
            return;
        }
        if(ifNum(obj.code)) {
            if(obj.code.length !== 6){
                codeTips.style.display = 'block';
                return;
            }
        }else{
            codeTips.style.display = 'block';
            return;
        }
        console.log(1)
        sendRegistAjax(obj)
    }
}
function codeTime () {
    getCode.onclick = function () {
        if(flag) {
            return;
        }
        var mobile = tel.value.replace(/\s*/g,"");
        if(ifNum(mobile)) {
            if(mobile.length === 11){
                telTips.style.display = 'none';
                console.log(true);
                setTimeout(function() {
                    sendCodeAjax(mobile)
                }, 1001)
            }else{
                telTips.style.display = 'block';
                return;
            }
        }else{
            telTips.style.display = 'block';
            return;
        }
        // 此处应发ajax请求，看是否发送出验证码
        setTimeout(function () {
            clearInterval(timer);
            _this.innerText = '点击获取验证码'
            seconds = 60;
            flag = false;
        }, 60000);
        var _this = this;
        flag = true;
        _this.innerText = seconds + '秒后重新发送验证码';
        timer = setInterval(function () { 
            seconds--;
            _this.innerText = seconds + '秒后重新发送验证码'; 
        }, 1000)
        ;
    }
} 
// 发送验证码
function sendCodeAjax(mobile) {
    $.ajax({
        url : 'http://39.97.243.38:6116/user/sendsms/' + mobile,
        type : 'post',
        dataType : 'json',
        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
        success : function (res) {
            if(res.flag){
                alert('验证码已发送');
            }else{
                alert('验证码发送失败，60s以后再试');
            }
        }
    }) 
}

// 发送注册请求
function sendRegistAjax(obj) {
    delete obj['confirm'];
    delete obj['code'];
    var codeValue = code.value;
    obj = JSON.stringify(obj);
    console.log(obj)
    $.ajax({
        url : 'http://39.97.243.38:6116/user/register/' + codeValue,
        type : 'post',
        data : obj,
        contentType : 'application/json; charset=UTF-8',
        dataType : 'json',
        success : function (res) {
            console.log(res);
            if(res.code === 20000){
                sessionStorage.setItem("token", res.data.token);
                sessionStorage.setItem("nickname", res.pojos.nickname);
                sessionStorage.setItem("avatar", res.pojos.avatar);
                alert('您已注册成功！点击确定按钮进行跳转页面');
                location.href = './setUp.html'
            }else if(res.code === 20002){
                alert('验证码已失效，请重新获取验证码');
                return false;
            }else if(res.code === 20003) {
                alert('验证码错误，请确认一下');
                return false;
            }else if(res.code === 20006) {
                alert('手机号码已被注册，请登录。若忘记密码的话，可以去往登录页更改密码');
                return false;
            }
        }
    })
}


function init() {
    backToPrevious(); 
    regist();
    codeTime();
    tipsDisappear();
}
init();
