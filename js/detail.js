var self = document.getElementsByClassName('bar-self')[0];
var afterLogin = document.getElementsByClassName('bar-afterLogin')[0]; 
var logout = document.getElementsByClassName('bar-logout')[0];
var login = document.getElementsByClassName('bar-right')[0];
var barAvatar = document.getElementsByClassName('bar-avatar')[0];
var publishLogin = document.getElementsByClassName('publish-login')[0];
var textarea = document.getElementsByClassName('publish-textarea')[0];
var likesImg = document.getElementsByClassName('likesImg')[0]; 
var commentImgFlag = true;
// 渲染所需用到的dom
var authorTitle = document.getElementsByClassName('author-title')[0];
var authorInfor = document.getElementsByClassName('author-infor')[0];
var content = document.getElementsByClassName('content')[0];
// 发表评论所需用到的dom
var sendTextarea = document.getElementsByClassName('sendTextarea')[0];
var likesNum = document.getElementsByClassName('likesNum')[0];
var textareaVal = document.getElementsByClassName('textarea')[0];
// 函数防抖
var moveTimer = null;
// 点赞
var encourageImg;
var encourageNum;


function init() {
    // 检测是否登陆
    getSession();
    // 设置后个人状态栏鼠标移入事件
    slideInSelf();
    // 登出
    clickLogout();
    // 点击发表评论
    clickPublishComment();
    // 打开内容页后，在看+1
    seenIncrement();
}
init();

function getSession() {
    var contentId = sessionStorage.getItem('id');
    var contentDifference = sessionStorage.getItem('difference');
    var mobile = sessionStorage.getItem('mobile');
    renderContent(contentId, contentDifference, mobile);
    
    var nickname = sessionStorage.getItem('name');
    var avatar = sessionStorage.getItem('avatar');
    if(nickname === null) {
        return false;
    }else{
        login.style.display = 'none';
        barAvatar.style.display = 'block';
        self.style.display = 'block'; 
        self.innerText = '您好， ' + nickname;
        barAvatar.src = avatar                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           ;
        publishLogin.style.display = 'none';
        textarea.style.display = 'block';
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
        window.location.href = './index.html';
    }
}
function commentLikes() {
    likesImg.onclick = function () {
        if(commentImgFlag) {
            this.src = './img/active.png';
            commentImgFlag = false;
            likesNum.innerText = 1;
        }
    }
}
// 请求文章或视频内容部分
function renderContent(id, difference, mobile) {
    if(difference === 't') {
        var obj = {
            mobile : mobile,
            aid : id
        }
        obj = JSON.stringify(obj);
        $.ajax({
            url : 'http://39.97.243.38:6116/file/findByid/',
            type : 'post',
            data : obj,
            contentType: 'application/json',
            dataType : 'json',
            success : function (res) {
                if(res.flag) {
                    console.log(res);
                    // 渲染作者信息栏
                    renderArticleAuthor(res);
                    // 渲染内容栏
                    renderArticleArea(res);
                    // 渲染评论部分
                    renderComment(res);
                    // 是否可以点赞
                    canGivePraise(res);
                }else{
                    console.log(res);
                    alert('获取数据失败，请稍后再试');
                    // window.location.href = './index.html';
                }
            }
        })
    }else if(difference === 'v') {
        var obj = {
            mobile : mobile,
            vid : id
        }
        obj = JSON.stringify(obj);
        $.ajax({
            url : 'http://39.97.243.38:6116/video/vfindByid/',
            type : 'post',
            data : obj,
            contentType: 'application/json',
            dataType : 'json',
            success : function (res) {
                console.log(res);
                if(res.flag) {
                    console.log(res);
                    // 渲染作者信息栏
                    renderVideoAuthor(res);
                    // 渲染内容栏
                    renderVideoArea(res);
                    // 渲染评论部分
                    renderComment(res);
                    // 是否可以点赞
                    canGivePraise(res);
                }else{
                    console.log(res);
                    alert('获取数据失败，请稍后再试');
                }
            }
        })
    }
}
// 渲染部分
function renderArticleAuthor(res) {
    console.log(res);
    var authorContent1 = `
        <h2>${res.data.zztitle}</h2>
        <p>${res.data.uploadTime}发布</p>
        <div class="original">原创视频</div>
        <div class="seenIncrement">有<span>${res.data.visits}</span>人看过此文章</div>
        <div class="encourage clearfix">
            <img src="./img/black.png" class="encourage-img">
            <div class="encourage-num">${res.data.thumbup}</div>
        </div>
    ` 
    var authorContent2 = `
        <img src="${res.data.titleUrl}" alt="" class="infor-avatar left">
        <h4 class="left">${res.data.uploadUser}（作者）</h4>
    `
    authorTitle.innerHTML = authorContent1;
    authorInfor.innerHTML = authorContent2;
    // 点赞所需的dom
    encourageImg = document.getElementsByClassName('encourage-img')[0];
    encourageNum = document.getElementsByClassName('encourage-num')[0];
}
function renderArticleArea(res) {
    console.log(res);
    console.log(res.pojos.aUrl);
    var imgArr = res.pojos.aUrl.split(',');
    console.log(imgArr);
    var contentArea = `
        <div class="content-title">${res.pojos.ztitle}</div>
        <img  alt="" class="content-img" src="${imgArr[0]}">
        <div class="content-area">
            ${res.pojos.acontent}
        </div>
        <img alt="" class="content-img" src="${imgArr[1]}">
        <img src="./img/code.png" class="navCode">
    `
    content.innerHTML = contentArea;
    console.log(res.pojos.acontent);
}
function renderVideoAuthor(res) {
    var authorContent1 = `
        <h2>${res.data.viftitle}</h2>
        <p>${res.data.viuploadTime}发布</p>
        <div class="original">原创视频</div>
        <div class="seenIncrement">有<span>&nbsp;${res.data.vivisits}&nbsp;</span>人看过此视频</div>
        <div class="encourage clearfix">
            <img src="./img/black.png" class="encourage-img">
            <div class="encourage-num">${res.data.vithumbup}</div>
        </div>
    ` 
    var authorContent2 = `
        <img src="${res.data.vititleUrl}" alt="" class="infor-avatar left">
        <h4 class="left">${res.data.viuploadUser}（作者）</h4>
    `
    authorTitle.innerHTML = authorContent1;
    authorInfor.innerHTML = authorContent2;
    // 点赞所需的dom
    encourageImg = document.getElementsByClassName('encourage-img')[0];
    encourageNum = document.getElementsByClassName('encourage-num')[0];
}
function renderVideoArea (res) {
    var contentArea = `
        <div class="content-title">${res.pojos.viztitle}</div>
        <div class="content-area">
            ${res.pojos.viacontent}
        </div>
        <div class="content-video">
            <video class="videoHTML" muted autoplay src="${res.pojos.viaUrl}"></video>
            <div class="video-mask"></div>
            <div class="video-progress">
                <div class="progress"></div>
                <div class="progress-btn"></div>
            </div>
            <div class="video-control">
                <div class="video-toolbar">
                    <div class="control-play" data-play="pause">
                        <img src="./img/start.png" alt="" class="video-img">
                    </div>
                    <div class="control-time">
                        <span class="control-now">00:00:00\xa0</span>
                        <span>/\xa0</span>
                        <span class="control-total">00:00:00</span>
                    </div>
                    <div class="control-fullScreen">
                        <img src="./img/fullScreen.png" alt="" class="video-img">
                    </div>
                </div>
            </div>
        </div>
        <img src="./img/code.png" class="navCode">
    `
    content.innerHTML = contentArea;
    var obj = getVideoDom();
    // 视频播放所需要的dom
    obj.videoProgress.style.width = obj.video.offsetWidth + 'px';
    obj.control.style.width = obj.video.offsetWidth +'px';
    // video的真实宽，真实高
    // var trueHeight = video.videoHeight;
    // console.log(trueHeight);
    obj.videoProgress.style.top = obj.video.offsetHeight + 18 + 'px';
    obj.control.style.top = obj.video.offsetHeight + 22 + 'px';
    // 视频的播放暂停功能、进度条、全屏
    initVideoFunc(obj);
}
// 渲染评论区部分
function renderComment (res) {
    var commentsNum = document.getElementsByClassName('commentsNumber')[0];
    var ul = document.getElementsByClassName('commentsLi')[0];
    var difference = sessionStorage.getItem('difference');
    if(difference === 't') {
        var len = res.article.length
        commentsNum.innerText = len;
        for(var i = 0; i < len; i++) {
            var li = document.createElement('li');
            var content = `
            <div class="commentator clearfix">
                <img alt="" class="left" src="${res.article[i].avatar}">
                <div class="comment-self left">
                    <p>${res.article[i].nickname}</p>
                    <p>${res.article[i].yeardate}</p>
                </div>
            </div>
            <p class="comment-content">${res.article[i].commentC}</p>
            `
            li.innerHTML = content;
            ul.appendChild(li);
        }
    }else if(difference === 'v') {
        var len = res.article.length
        commentsNum.innerText = len;
        for(var i = 0; i < len; i++) {
            var li = document.createElement('li');
            var content = `
            <div class="commentator clearfix">
                <img alt="" class="left" src="${res.article[i].vavatar}">
                <div class="comment-self left">
                    <p>${res.article[i].viNickname}</p>
                    <p>${res.article[i].vyeardate}</p>
                </div>
            </div>
            <p class="comment-content">${res.article[i].vicommentC}</p>
            `
            li.innerHTML = content;
            ul.appendChild(li);
        }
    }
}
// 点击发表评论
function clickPublishComment () {
    sendTextarea.onclick = function () {
        var token = sessionStorage.getItem('token');
        var difference = sessionStorage.getItem('difference');
        var Nickname = sessionStorage.getItem('name');
        var Mobile = sessionStorage.getItem('mobile');
        var pid = sessionStorage.getItem('id');
        var commentC = textareaVal.value;
        if(token === null) {
            alert('未登录是无法发表评论的，请登录！')
            return;
        }
        if(difference === 't') {
            var url = 'http://39.97.243.38:6116/file/pl';
            var obj = {
                pid : pid,
                commentC :commentC,
                nickname : Nickname,
                mobile : Mobile
            }
        }else if(difference === 'v') {
            var url = 'http://39.97.243.38:6116/video/vpl';
            var obj = {
                vid : pid,
                vicommentC :commentC,
                viNickname : Nickname,
                viMobile : Mobile
            }
        }
        token = 'Bearer ' + token + "";
        obj = JSON.stringify(obj);
        console.log(obj);
        $.ajax({
            url : url,
            type : 'post',
            data : obj,
            dataType : 'json',
            contentType : 'application/json',
            headers : {
                "Content-type" : "application/json",
                "Authorization" : token
            },
            success : function (res) {
                console.log(res);
                if(res.flag) {
                    alert('发表评论成功！');
                    location.reload();
                }else{
                    alert('似乎哪里出了错误呢，请稍后再试！');
                    return;
                }
            },
            error : function (res) {
                alert('操作超时，请重新登陆一下吧！');
                clickLogout();
                return;
            }
        })
    } 
}
// 获取视频播放所需的dom
function getVideoDom() {
    var videoArea = document.getElementsByClassName('content-video')[0];
    var video = document.getElementsByClassName('videoHTML')[0];
    var controlPlay = document.getElementsByClassName('control-play')[0];
    var controlFull = document.getElementsByClassName('control-fullScreen')[0];
    var nowTime = document.getElementsByClassName('control-now')[0];
    var totalTime = document.getElementsByClassName('control-total')[0];
    var videoProgress = document.getElementsByClassName('video-progress')[0];
    var progress = document.getElementsByClassName('progress')[0];
    var progressBtn = document.getElementsByClassName('progress-btn')[0];
    var control = document.getElementsByClassName('video-control')[0];
    var obj = {
        videoArea : videoArea,
        video: video,
        controlPlay : controlPlay,
        controlFull : controlFull,
        nowTime : nowTime,
        totalTime : totalTime,
        videoProgress : videoProgress,
        progress : progress,
        progressBtn : progressBtn,
        control : control
    }
    return obj;
}
// 视频的播放暂停功能、进度条、全屏
function initVideoFunc (obj) {
    obj.video.oncanplay = function () {
        this.pause();
        this.muted = false;
        // 获取视频总时间，和当前播放了多长时间
        getVideoTime(obj);
        // 点击控制视频播放或暂停
        playOrNot(obj);
        // 点击全屏播放
        fullScreen(obj)
        // 点击进度条，播放点击位置的部分
        clickLine(obj);
        // 拖动进度条，播放拖动位置的部分
        // dragLine(obj);
        // 当视频结束后，触发的事件
        videoEnd(obj);
    }
}
// 获取视频总时间，和当前播放了多长时间
function getVideoTime (obj) {
    var total = format(obj.video.duration);
    obj.totalTime.innerText = total;
    obj.video.ontimeupdate = function () {
        var current = format(this.currentTime);
        obj.nowTime.innerText = current + '\xa0';
        var percent = (this.currentTime / this.duration) * 100;
        percent = percent + '%';
        obj.progress.style.width = percent;
        var offLeft = obj.progressBtn.offsetLeft;
        var offWid = obj.videoProgress.offsetWidth;
        if(offLeft >= offWid - 12) {
            obj.progressBtn.style.left = offWid - 12 + 'px';
        }else{
            obj.progressBtn.style.left = percent;
        }
        
    }
}
// 点击控制视频播放或暂停
function playOrNot (obj) {
    obj.controlPlay.onclick = function () {
        var playState = obj.controlPlay.dataset.play;
        if(playState === 'pause') {
            var videoMask = document.getElementsByClassName('video-mask')[0];
            videoMask.style.display = 'none';
            obj.video.play();
            this.firstElementChild.src = './img/suspend.png';
            obj.controlPlay.dataset.play = 'play'
        }else if(playState === 'play') {
            obj.video.pause();
            this.firstElementChild.src = './img/start.png';
            obj.controlPlay.dataset.play = 'pause'
        }
    }
}
// 点击全屏播放
function fullScreen (obj) {
    obj.controlFull.onclick = function () {
        var userAgent = navigator.userAgent;
        console.log(userAgent)
        console.log(userAgent.indexOf('Firefox'));
        if(userAgent.indexOf('Firefox') > -1) {
            obj.video.mozRequestFullScreen();
        }else if(userAgent.indexOf('Chrome') > -1) {
            obj.video.webkitRequestFullScreen();
        }
    }
}
// 点击进度条，播放点击位置的部分
function clickLine (obj) {
    obj.videoProgress.onclick = function (e) {
        var offX = e.offsetX;
        offX = (offX / obj.videoProgress.offsetWidth);
        var percent = offX * 100 + '%';
        obj.progress.style.width = percent;
        obj.progressBtn.style.left = percent;
        obj.video.currentTime = obj.video.duration * offX;
        obj.video.oncanplay = function () {
            var playState = obj.controlPlay.dataset.play;
            if(playState === 'play') {
                this.play();
                obj.controlPlay.firstElementChild.src = './img/suspend.png';
            }else if(playState === 'pause') {
                this.pause();
                obj.controlPlay.firstElementChild.src = './img/start.png';
            }
        }
    } 
}
// 拖动进度条，播放拖动位置的部分
function dragLine (obj) {
    obj.progressBtn.onmousedown = function () {

    }
}
// 返回总秒数，处理为时分秒的函数
function format (time) {
    var hour = Math.floor(time / 3600);
    var minute = Math.floor(time % 3600 / 60);
    var second = Math.ceil(time % 60);
    if(second == 60) {
        second = '0'
        minute++;
        if(minute == 60) {
            hour++;
        }
    }
    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;
    second = second >= 10 ? second : '0' + second;
    return hour + ':' + minute + ':' + second;
}
// 当视频结束后，触发的事件
function videoEnd (obj) {
    obj.video.onended = function () {
        console.log(1);
        this.currentTime = 0;
        obj.progressBtn.style.left = 0 + 'px';
        obj.progress.style.width = 0 + 'px';  
        this.oncanplay = function () {
            this.pause();
            obj.controlPlay.firstElementChild.src = './img/start.png'
        }
    }
}
// 点赞函数
function clickLove(encourageImg, encourageNum) {
    encourageImg.onclick = function () {
        console.log(1);
        var difference = sessionStorage.getItem('difference');
        var id = sessionStorage.getItem('id');
        var mobile = sessionStorage.getItem('mobile');
        var token = sessionStorage.getItem('token');
        if(token === null) {
            alert('未登录或登录超时，请登录后再来点赞吧！');
            window.location.href = './login.html';
            return; 
        }
        token = 'Bearer ' + token; 
        var url;
        if(difference === 't') {
            var obj = {
                aid : id,
                mobile : mobile
            }
            url = 'http://39.97.243.38:6116/file/tp';
        }else if(difference === 'v') {
            var obj = {
                vid : id,
                mobile : mobile
            }
            url = 'http://39.97.243.38:6116/video/vtp';
        }
        var user = JSON.stringify(obj);
        console.log(user, url);
        $.ajax({
            url : url,
            type : 'post',
            data : user,
            dataType : 'json',
            contentType: 'application/json',
            headers : {
                "Content-type" : "application/json",
                "Authorization" : token
            },
            success : function (res) {
                console.log(res)
                if(res.flag) {
                    var num = Number(encourageNum.innerText);
                    num++;
                    encourageNum.innerText = num;
                    encourageNum.style.color = '#ffe300';
                    encourageImg.src = './img/yellow.png';
                }else{
                    return;
                }
            },
            error : function (res) {
                alert('服务器貌似出问题了，请稍后再试！');
                return;
            }
        })
    }
}
// 是否可以点赞
function canGivePraise(res) {
    if(res.code === 20000) {
        // 评论点赞 
        clickLove(encourageImg, encourageNum);
        return;
    }else if(res.code === 20005) {
        encourageNum.style.color = '#ffe300';
        encourageImg.src = './img/yellow.png';
    }else if(res.code === 20003) {
        function clickError () {
            encourageNum.onclick = function () {
                alert('登录过期或者是服务器出错了，请重新登录');
                sessionStorage.clear();
                window.location.href = './login.html';
            }
        }
        clickError();
        return;
    }
}
// 点开后，在看+1
function seenIncrement () {
    $.ajax({

    })
}
