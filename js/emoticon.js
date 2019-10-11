var self = document.getElementsByClassName('bar-self')[0];
var afterLogin = document.getElementsByClassName('bar-afterLogin')[0]; 
var logout = document.getElementsByClassName('bar-logout')[0];
var login = document.getElementsByClassName('bar-right')[0];
var barAvatar = document.getElementsByClassName('bar-avatar')[0];
// 懒加载所需dom
var ul = document.getElementsByClassName('emoticons')[0];
var timer = null;
var dataSetArr = [];
// 点击跳转海报页dom
var toShow = document.getElementsByClassName('toShow')[0];
function init() {
    // 检测是否登陆
    getSession();
    // 设置后个人状态栏鼠标移入事件
    slideInSelf();
    // 登出
    clickLogout();
    // 懒加载
    initLazyLoad2();
    // 点击跳转海报页
    clickToHref();
}
init();
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
function initLazyLoad2() {
    dataSetArr = [
        './img/emoticon/01.gif',
        './img/emoticon/02.gif',
        './img/emoticon/03.gif',
        './img/emoticon/04.gif',
        './img/emoticon/05.gif',
        './img/emoticon/06.gif',
        './img/emoticon/07.gif',
        './img/emoticon/08.gif',
        './img/emoticon/09.gif',
        './img/emoticon/10.gif',
        './img/emoticon/11.gif',
        './img/emoticon/12.gif',
        './img/emoticon/13.gif',
        './img/emoticon/14.gif',
        './img/emoticon/15.gif',
        './img/emoticon/16.gif',
    ];
    var len = dataSetArr.length;
    for(var i = 0; i < len; i++) {
        var li = document.createElement('li');
        li.classList.add('poster');
        li.innerHTML = '<div class="posterImg" data-src="' + dataSetArr[i] + '"></div>';
        ul.appendChild(li)
    }
    window.onload = function () {
        var imgs = document.getElementsByClassName('posterImg');
        imgs = Array.prototype.slice.call(imgs);
        judgePosition2(imgs);
        // 函数节流，函数防抖
        window.onscroll = function () {
            if(timer) {
                clearTimeout(timer);
            }
            setTimeout(function () {
                clearTimeout(timer);
                judgePosition2(imgs);
            }, 500)
        }
    }
}
function judgePosition2(poster) {
    var imgs = poster;
    var len = imgs.length;
    var oheight = imgs[0].offsetHeight;
    console.log(oheight)
    var inner = window.innerHeight;
    for(var i = 0; i < len; i++) {
        var top = imgs[i].getBoundingClientRect().top;
        if(top <= inner && top >= -oheight) {
            imgs[i].style.backgroundImage = 'url(' + imgs[i].dataset.src + ')';
        }
    }
}
function clickToHref () {
    toShow.onclick = function () {
        window.location.href = './show.html';
    }
}