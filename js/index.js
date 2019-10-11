var html = document.getElementsByTagName('html')[0];
// 进入主页后判断是否有token及个人状态栏变化所需要的dom
var login = document.getElementsByClassName('bar-login')[0];
var register = document.getElementsByClassName('bar-register')[0];
// initSearch所需的dom
var search = document.getElementsByClassName('search')[0];
var magnifier = document.getElementsByClassName('bar-magnifier')[0];
var personBtn = document.getElementsByClassName('bar-personBtn')[0];
var afterLogin = document.getElementsByClassName('bar-afterLogin')[0];
var personName = document.querySelector('.bar-personBtn .bar-personName');
var personImg = document.querySelector('.bar-personBtn img');
// banner所需的dom
var bannerUl = document.getElementsByClassName('banner-ul')[0];
var bannerLi = document.getElementsByClassName('banner-li');
var bannerCircle = document.getElementsByClassName('banner-circle');
var leftArrow = document.getElementsByClassName('banner-leftArrow')[0];
var rightArrow = document.getElementsByClassName('banner-rightArrow')[0];
var arrowFlag = 1;
var circleFlag = 0;
// 搜索需要的dom
var searchInput = document.getElementsByClassName('input-search')[0];
var searchUllist = document.getElementsByClassName('search-ullist')[0];
var searchArr = [];
// 注销功能的dom
var logout = document.getElementsByClassName('bar-logout')[0];
// 切换按钮样式所需的dom
var recommendVideo = document.getElementsByClassName('recommend-video')[0];
var newestVideo = document.getElementsByClassName('newest-video')[0];
var recommendArticle = document.getElementsByClassName('recommend-article')[0];
var newestArticle = document.getElementsByClassName('newest-article')[0];
// 文章视频展示所需要的dom
var showFlag = 0;
var titleArr = [];
var articleContent = document.getElementsByClassName('article-content')[0];
var video = document.getElementsByClassName('video')[0];
var videoContent = document.getElementsByClassName('video-content')[0];
var videoArea = document.getElementsByClassName('video-area')[0];
// 搜索栏里需要点击的按钮
var as = document.querySelectorAll('.search-label li a');
var spanBtn = document.querySelectorAll('.spanBtn');
// 电梯导航
var popular = document.getElementsByClassName('search-popular')[0];
// 跳转至海报页、表情包页所需的dom
var poster = document.getElementsByClassName('special-poster')[0];
var emoticon = document.getElementsByClassName('special-file')[0];
var world = document.getElementsByClassName('special-world')[0];

function init() {
    // 进入主页时从session里拿东西，判断是否登陆
    getSession();
    // 鼠标移入个人状态栏设置及登出
    initPerson();
    // 鼠标移入显示搜索框
    initSearch();
    // 轮播图功能
    banner();
    // 进入页面后发送获取网站内容标题的请求
    getTitle();
    // 注销功能
    clickLogout();
    // 按钮状态切换功能
    btnChange();
    // 点击搜索栏里的按钮跳转
    cilckSearchBtn();
    // 电梯导航
    elevatorNavigation();
}

init();
// 进入主页拿session中的数据
function getSession() {
    var token = sessionStorage.getItem('token');
    var nickname = sessionStorage.getItem('name');
    var avatar = sessionStorage.getItem('avatar');
    if(nickname === null) {
        return;
    }else{
        login.style.display = 'none';
        register.style.display = 'none';
        personBtn.style.display = 'block';
        personName.innerText = '您好， ' + nickname;
        personImg.src = avatar;
    }
}
// 鼠标移入显示输入框部分
function initSearch() {
    var arr = [search, magnifier];
    var arr2 = [personName, afterLogin];
    for(var i = 0; i < arr.length; i++) {
        arr[i].onmouseover = function() {
            search.style.display = 'block';
        }
        arr[i].onmouseleave = function() {
            search.style.display = 'none';
            searchInput.val = '';
        }
    }
} 
// 鼠标移入显示个人状态部分
function initPerson() {
    var arr = [personBtn, afterLogin];
    for(var i = 0; i < arr.length; i++) {
        arr[i].onmouseover = function () {
            afterLogin.style.display = 'block';
        }
        arr[i].onmouseleave = function () {
            afterLogin.style.display = 'none';
        }
    }
}
// 轮播图部分
function banner() {
    // 将伪数组变为数组
    var circleArr = [];
    for(var i = 0; i < bannerCircle.length; i++) {
        circleArr[i] = bannerCircle[i];
    }
    clickCircle(circleArr);
    clickArrow(circleArr);
}
function clickCircle(arr) {
    for(var i = 0; i < arr.length; i++) {
        (function (i) {
            arr[i].onclick = function () {
                if(arrowFlag === 4) {
                    arrowFlag = 1;
                    bannerUl.style.left = -1285 + 'px';
                }
                if(arrowFlag === 0) {
                    arrowFlag = 3;
                    bannerUl.style.left = -3855 + 'px';
                }
                arrowFlag = i + 1;
                circleFlag = arrowFlag * -1285;
                bannerMove(bannerUl, circleFlag);
                for(var j = 0; j < arr.length; j++) {
                    arr[j].classList.remove('active');
                }
                arr[i].classList.add('active');
            }
        })(i)
    }
}  
function clickArrow(arr) {
    leftArrow.onclick = function () {
        if(arrowFlag === 0) {
            bannerUl.style.left = -3855 + 'px';
            arrowFlag = 3;
        }
        arrowFlag--;
        var position = arrowFlag * -1285;
        bannerMove(bannerUl, position);
        for(var i = 0; i < arr.length; i++) {
            arr[i].classList.remove('active');
        }
        if(arrowFlag === 0) {
            arr[2].classList.add('active');
        }else{
            arr[arrowFlag - 1].classList.add('active');
        }
    }
    rightArrow.onclick = function () {
        if(arrowFlag === 4) {
            bannerUl.style.left = -1285 + 'px';
            arrowFlag = 1;
        }
        arrowFlag++;
        var position = arrowFlag * -1285;
        bannerMove(bannerUl, position);
        for(var j = 0; j < arr.length; j++) {
            arr[j].classList.remove('active');
        }
        if(arrowFlag === 4) {
            arr[0].classList.add('active');
        }else{
            arr[arrowFlag - 1].classList.add('active');
        }
    }
}
// 获取主页的文章、视频标题部分
function getTitle() { 
    // 发送ajax;
    $.ajax({
        url : 'http://39.97.243.38:6116/file/findAll',
        type : 'get',
        success : function (res) {
            console.log(res);
            titleArr = res;
            searchTitle(titleArr.data, titleArr.pojos);
            showArticleTitle();
            showVideoTitle();
        },
        error : function () {
            alert('数据可能正在维护，请稍后再访问网站');
        }
    })
}
// 搜索部分
function searchTitle(articleArr, videoArr) {
    var articleLength = articleArr.length;
    var videoLength = videoArr.length;
    searchInput.oninput = function () {
        var articleTempArr = [];
        var videoTempArr = [];
        var resultArr = [];
        var val = this.value;
        if(val === '') {
            searchUllist.style.display = 'none';
            return;
        }
        searchUllist.innerHTML = '';
        searchUllist.style.display = 'block';
        for(var i = 0; i < articleLength; i++) {
            if(articleArr[i].zztitle.indexOf(val) !== -1) {
                var articleObj = {
                    title : articleArr[i].zztitle,
                    jumpId : articleArr[i].aid
                }
                articleTempArr.push(articleObj);
            }
        }
        for(var j = 0; j < videoLength; j++) {
            if(videoArr[j].viftitle.indexOf(val) !== -1) {
                var videoObj = {
                    title : videoArr[j].viftitle,
                    jumpId : videoArr[j].vid
                }
                videoTempArr.push(videoObj);
            }
        }
        if(articleTempArr.length === 0 && videoTempArr.length === 0) {
            return;
        }
        for(var k = 0; k < 8; k++) {
            if(resultArr.length < 8 && (articleTempArr.length - 1) >= k) {
                resultArr.push(articleTempArr[k]);
            }
            if(resultArr.length < 8 && (videoTempArr.length - 1) >= k) {
                resultArr.push(videoTempArr[k]);
            }
        }
        for(var l = 0; l < resultArr.length; l++) {
            var li = document.createElement('li');
            li.innerText = resultArr[l].title;
            var id = resultArr[l].jumpId;
            (function (id) {
                li.onclick = function () {
                    sessionStorage.setItem('id', id);
                    window.location.href = './detail.html';
                    searchInput.value = '';
                    searchUllist.style.display = 'none';
                }
            }(id))
            searchUllist.appendChild(li);
        }
    }
}
// 文章区域展示部分
function clickArticleCircle(num) {
    if(num === 1) {
        showFlag = 0;
    }else if(num === 2) {
        showFlag = 5;
    }else if(num === 3) {
        showFlag = 10;
    }else{
        
    }
    showArticleTitle();
}
function showArticleTitle() {
    var showLessFlag = showFlag + 5;
    articleContent.innerHTML = '';
    showLessFlag = showLessFlag > titleArr.data.length ? titleArr.data.length : showLessFlag;
    if(titleArr.data.length <= showFlag) {
        var div = document.createElement('div');
        div.innerHTML = '暂时没有最新文章了';
        div.style.fontSize = '20px';
        div.style.color = '#333';
        div.style.position = 'absolute';
        div.style.left = '50%';
        div.style.top = '50%';
        div.style.marginBottom = '50px'
        div.style.transform = 'translate(-50%)';
        articleContent.appendChild(div);
        return; 
    }
    for(var i = showFlag; i < showLessFlag; i++) {
        var articleDiv = `
        <div class="article-area">
            <img class="article-image" src="${titleArr.data[i].cover}">
            <div class="article-synopsis">
                <div class="article-title">
                    <div>经验观点</div>
                    <span onclick="clickJump(${titleArr.data[i].aid}, 't')">${titleArr.data[i].zztitle}</span>
                </div>
                <p>${titleArr.data[i].ftitle}</p>
                <div class="article-author">
                    <span>${titleArr.data[i].uploadUser}</span>
                    <div class="article-emoji">
                        <div class="article-seen article-three">
                            <i></i>
                            <span class="font">${titleArr.data[i].visits}</span>
                        </div>
                        <div class="article-comment article-three">
                            <i></i>
                            <span class="font">${titleArr.data[i].thumbup}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="article-time">
                <i></i>
                <span>${titleArr.data[i].uploadTime}</span>
            </div>
        </div>
        `
        articleContent.innerHTML = articleContent.innerHTML + articleDiv;
    }
}
// 视频区域展示部分
function clickVideoCircle (num) {
    if(num === 1) {
        showFlag = 0;
    }else if(num === 2) {
        showFlag = 10;
    }else if(num === 3) {
        showFlag = 19;
    }else{
        
    }
    showVideoTitle();
}
function showVideoTitle() {
    var showLessFlag = showFlag + 10;
    videoContent.innerHTML = '';
    showLessFlag = showLessFlag > titleArr.pojos.length ? titleArr.pojos.length : showLessFlag;
    if(titleArr.pojos.length <= showFlag) {
        var div = document.createElement('div');
        div.innerHTML = '暂时没有最新视频了';
        div.style.fontSize = '20px';
        div.style.color = '#333';
        div.style.position = 'absolute';
        div.style.left = '50%';
        div.style.top = '40%';
        div.style.marginBottom = '50px'
        div.style.transform = 'translate(-50%)';
        videoContent.appendChild(div);
        return; 
    }
    for(var i = showFlag; i < showLessFlag; i++) {
        var videoDiv = `
            <div class="video-area">
                <a href="javascript:;" onclick="clickJump(${titleArr.pojos[i].vid}, 'v')">
                    <img src="${titleArr.pojos[i].vcover}" alt="" class="video-image">
                </a>
                <div class="video-synopsis">
                    <a href="javascript:;" class="video-click" onclick="clickJump(${titleArr.pojos[i].vid}, 'v')">${titleArr.pojos[i].viftitle}</a>
                    <div class="three clearfix">
                        <div class="three-original">原创</div>
                        <div class="three-seen">
                            <i></i>
                            <span class="font">${titleArr.pojos[i].vivisits}</span>
                        </div>
                        <div class="three-comment">
                            <i></i>
                            <span class="font">${titleArr.pojos[i].vithumbup}</span>
                        </div>
                    </div>
                    <div class="author">
                        <span class="font">${titleArr.pojos[i].viuploadUser}</span>
                    </div>
                </div>
            </div>
        `
        videoContent.innerHTML = videoContent.innerHTML + videoDiv;
    }
}
// 注销功能
function clickLogout() {
    logout.onclick = function () {
        sessionStorage.clear();
        location.reload();
    }
}
// 按钮状态切换功能
function btnChange() {
    var arr = [recommendVideo, newestVideo];
    var arr2 = [recommendArticle, newestArticle];
    function btnClass(arr) {
        for(var i = 0; i < arr.length; i++) {
            arr[i].onclick = function () {
                for(var j = 0; j < arr.length; j++) {
                    arr[j].classList.remove('btn-active');
                }
                this.classList.add('btn-active')
            }
        }
    }
    btnClass(arr);
    btnClass(arr2);
}
// 点击视频或文章跳转功能
function clickJump (num, difference) {
    sessionStorage.setItem('difference', difference)
    sessionStorage.setItem('id', num);
    window.location.href = './detail.html';
}
// 搜索栏里需要点击的按钮
function cilckSearchBtn () {
    for(var i = 0; i < 3; i++) {
        (function (i) {
            as[i].onclick = function () {
                var flag = this.dataset.flag;
                if(flag === 'a') {
                    sessionStorage.setItem('id', 7);
                    sessionStorage.setItem('difference', 't')
                    window.location.href = './detail.html';
                }else if(flag === 'b') {
                    sessionStorage.setItem('id', 1);
                    sessionStorage.setItem('difference', 't')
                    window.location.href = './detail.html';
                }else if(flag === 'c') {
                    sessionStorage.setItem('id', 8);
                    sessionStorage.setItem('difference', 't')
                    window.location.href = './detail.html';
                }else{
                    alert('可能出现了错误，请稍后再试！');
                    return;
                }
            }
        }(i));
    }
    for(var j = 0; j < 4; j++) {
        (function (j) {
            spanBtn[j].onclick = function (j) {
                var flag = this.dataset.flag;
                if(flag ==='e') {
                    sessionStorage.setItem('id', 5);
                    sessionStorage.setItem('difference', 'v')
                    window.location.href = './detail.html'
                }else if(flag === 'f') {
                    sessionStorage.setItem('id', 7);
                    sessionStorage.setItem('difference', 'v')
                    window.location.href = './detail.html';
                }else{
                    alert('可能出现了错误，请稍后再试！');
                    return;
                }
            }
        }(j));
    }
}
// 电梯导航
function elevatorNavigation () {
    popular.onclick = function () {
        search.style.display = 'none';
        var videoPosition = video.offsetTop;
        var htmlPosition = 0;
        var timer = setInterval(function () {
            if(html.scrollTop >= videoPosition) {
                html.scrollTop === 680;
                clearInterval(timer);
                return;
            }
            htmlPosition = htmlPosition + 13.6;
            html.scrollTop = htmlPosition;
        }, 5)
    }
}
// 跳转至海报，表情包页
function clickToShow (flag) {
    if(flag === 'poster') {
        window.location.href = './show.html';
    }else if(flag === 'file') {
        window.location.href = './file.html';
    }else if(flag === 'world') {
        window.location.href = './world.html';
    }
}
