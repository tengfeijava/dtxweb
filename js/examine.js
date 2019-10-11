// 登录框所需的dom
var inputArea = document.getElementsByClassName('inputArea')[0];
var userName = document.getElementsByClassName('userName')[0];
var pwd = document.getElementsByClassName('pwd')[0];
var btn = document.getElementsByClassName('sureBtn')[0];
var backToIndex = document.getElementsByClassName('backToIndex')[0];

function init() {
    getInput();
}
init();

function getInput () {
    btn.onclick = function () {
        var u = userName.value;
        var p = pwd.value;
        if(u === 'dytz2019') {
            if(p === 'dbgs') {
                inputArea.style.display = 'none';
            }else{
                alert('输入的账号或密码有误，请重新登陆');
                userName.value = '';
                pwd.value = '';
                return false;
            }
        }else{
            alert('输入的账号或密码有误，请重新登录');
            userName.value = '';
            pwd.value = '';
            return false;
        }
    }
    backToIndex.onclick = function () {
        window.location.href = './index.html';
    }
}

var arr = [1, 2, 3];
console.log(arr[3])  //undefined