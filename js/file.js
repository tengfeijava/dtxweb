var self = document.getElementsByClassName('bar-self')[0];
var afterLogin = document.getElementsByClassName('bar-afterLogin')[0]; 
var logout = document.getElementsByClassName('bar-logout')[0];
var login = document.getElementsByClassName('bar-right')[0];
var barAvatar = document.getElementsByClassName('bar-avatar')[0];
// 下载文件所需要的dom
var content = document.getElementsByClassName('content')[0];
var ul = document.querySelector('ul');

function init () {
    // 检测是否登陆
    getSession();
    // 设置页面高度
    setHeight();
    // 设置后个人状态栏鼠标移入事件
    slideInSelf();
    // 登出
    clickLogout();
    // 查询下载资料
    findAllFile();
}
init()

function getSession() {
    var contentId = sessionStorage.getItem('id');
    var nickname = sessionStorage.getItem('name');
    var avatar = sessionStorage.getItem('avatar');
    if(nickname === null) {
        return false;
    }else{
        login.style.display = 'none';
        barAvatar.style.display = 'block';
        self.style.display = 'block';
        self.innerText = '您好， ' + nickname;
        barAvatar.src = avatar;
    }
}
function setHeight() {
    var height = window.innerHeight;
    content.style.height = height - 80 + 'px';
    window.onresize = function () {
        var height = window.innerHeight;
        content.style.height = height - 80 + 'px';
    }
}
function slideInSelf() {
    var arr = [self, afterLogin];
    for(var i = 0; i < arr.length; i++) {
        arr[i].onmouseover = function () {
            afterLogin.style.display = 'block';
        }
        arr[i].onmouseleave = function () {
            afterLogin.style.display = 'none';
        }
    }
}
function clickLogout() {
    logout.onclick = function () {
        console.log(2)
        sessionStorage.clear();
        location.reload();
    }
}
function findAllFile () {
    $.ajax({
        url : 'http://39.97.243.38:6116/usfile/fileAllpdf',
        type : 'get',
        dataType : 'json',
        success : function (res) {
            if(res.code === 20000) {
                for(var i = 0; i < res.data.length; i++) {
                    var a = document.createElement('a');
                    var li = document.createElement('li');
                    var span = document.createElement('span');
                    span.classList.add('fileTime');
                    span.innerText = '2019-10-10';
                    li.appendChild(span);
                    res.data[i].pdfName = res.data[i].pdfName.substring(8);
                    a.setAttribute('href', 'javascript:;');
                    a.classList.add('downloadFile');
                    a.dataset.pdfAddress = res.data[i].pdfAddress;
                    a.innerText = i + 1 + '.' + res.data[i].pdfName;
                    li.appendChild(a);
                    ul.appendChild(li);
                    // 点击下载资料  此处是异步的，或者让ajax设置为同步也可以
                    clickDownLoad();
                }
            }
        }
    })
}
function clickDownLoad () {
    var downloadFile = document.getElementsByClassName('downloadFile');
    for(var i = 0; i < downloadFile.length; i++) {
        downloadFile[i].onclick = function () {
            window.location.href = this.dataset.pdfAddress;
        }
    }
}

