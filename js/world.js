var self = document.getElementsByClassName('bar-self')[0];
var afterLogin = document.getElementsByClassName('bar-afterLogin')[0]; 
var logout = document.getElementsByClassName('bar-logout')[0];
var login = document.getElementsByClassName('bar-right')[0];
var barAvatar = document.getElementsByClassName('bar-avatar')[0];
// 上传层需要的dom
var uploadBtn = document.getElementsByClassName('content-uploadBtn')[0];
var mask = document.getElementsByClassName('mask')[0];
var closeBtn = document.getElementsByClassName('mask-close')[0];
var file = document.getElementsByClassName('mask-chooseFile')[0];
var maskShow = document.getElementsByClassName('mask-show')[0];
var maskUpload = document.getElementsByClassName('mask-upload')[0];
var blank = document.getElementsByClassName('blank')[0];
var maskImg = document.getElementsByClassName('mask-img')[0];
var maskProgress = document.getElementsByClassName('mask-progress')[0];
// 展示图片页面需要的dom
var content = document.getElementsByClassName('content')[0];
var contentShow = document.getElementsByClassName('content-show')[0];

function init() {
    // 处理页面存放图片盒子的高度
    handleHeight();
    // 检测是否登陆
    getSession();
    // 设置后个人状态栏鼠标移入事件
    slideInSelf();
    // 登出
    clickLogout();
    // 点击产生或关闭遮罩层
    clickProduceMask();
    // 当input="file"产生变化时
    flieChange();
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
function clickProduceMask () {
    uploadBtn.onclick = function () {
        var userToken = sessionStorage.getItem('token');
        if(userToken === null) {
            alert('请登录后再上传图片');
            return;
        }
        var oHeight = document.documentElement.scrollHeight;
        mask.style.height = oHeight + 'px';
        mask.style.display = 'block';
        var files = file.files;
        files.length = 0;
        blank.innerText = '';
        maskImg.innerHTML = '';
    }
    closeBtn.onclick = function () {
        mask.style.display = 'none';
    }
}
function flieChange () {
    file.onchange = function () {
        var files = this.files;
        maskImg.innerHTML = '';
        maskProgress.style.display = 'none';
        for(var i = 0; i < files.length; i++) {
            if(files.length > 1) {
                alert('最多上传一个文件！');
                return;
            }
            var fileFormat = files[i].name.slice(files[i].name.indexOf('.') + 1)
            if(fileFormat === 'png' || fileFormat === 'jpg' || fileFormat === 'jpeg') {
                var img = document.createElement('img');
                var src = getObjectURL(files[i]);
                img.src = src;
                img.classList.add('mask-show')
                maskImg.appendChild(img);
            }else{
                alert('上传图片视频有误，请重新上传');
                return;
            }
        }
        
        var maskClick = document.createElement('div');
        maskClick.innerText = '点击上传';
        maskClick.classList.add('mask-click');
        maskImg.appendChild(maskClick);
        if(files.length === 0) {
            maskClick.style.display = 'none';
        }
        blank.innerText = '已选择' + files.length + '个文件';
        maskClick.onclick = clickUpload;
    }
} 
function clickUpload () {
    var files = file.files;
    if(files.length === 0) {        
        alert('未监测到上传文件，请稍后上传');
        return;
    }
    var filesu = new FormData();
    filesu.append('multipartFile', files[0]);
    var fileUpuser = sessionStorage.getItem('name');
    $.ajax({
        url : 'http://39.97.243.38:6116/usfile/uploadfile/' + fileUpuser,
        type : 'post',
        data : filesu,
        contentType : false,
        processData : false,
        dataType : 'json',
        xhr : function (e) {
            myXhr = $.ajaxSettings.xhr();
            if(myXhr.upload) {
                maskProgress.style.display = 'block';
                myXhr.upload.addEventListener('progress', function (e) {
                    var loaded = e.loaded;
                    var total = e.total;
                    var percent = Math.floor((loaded / total) * 100) + '%';
                    maskProgress.innerText = '已上传：' + percent;
                    if(percent === '100%') {
                        maskProgress.innerText = '已上传' + percent + '，请稍等'
                    }
                }, false);
                return myXhr;
            }
        },
        success : function (res) {
            if(res.code === 20000) {
                alert('上传成功');
                window.location.reload();
            }else if(res.code === 20001) {
                maskProgress.innerText = '上传失败';
                alert('上传失败，请重新上传！');
                return;
            }else if(res.code === 20008) {
                maskProgress.innerText = '上传失败';
                alert('上传图片体积过大或格式不正确，请重新上传jpg png jpeg格式切不大于1Mb的图片！');
                return;
            }
        }
    })
}
function handleHeight () {
    window.onload = function () {
        getImg();  
    }
}
function getImg () {
    var arr = [];
    $.ajax({
        url : 'http://39.97.243.38:6116/usfile/fileAll',
        type : 'get',
        dataType : 'json',
        success : function (res) {
            if(res.code === 20000) {
                for(var i = 0; i < res.data.length; i++) {
                    arr[i] = res.data[i].filesAddress; 
                }
            }else{
                alert('服务器好像出错了，请稍后再试');
                window.location.href = './index.html';
                return false;
            }
            setImgDom(arr);
        },
        error : function () {
            alert('服务器好像出错了，请稍后再试');
            window.location.href = './index.html';
            return false;
        }
    })
}
function setImgDom (arr) {
    var len = arr.length;
    console.log(arr)
    for(var i = 0; i < arr.length; i++) {
        var img = document.createElement('img');
        img.src = arr[i]; 
        img.style.display = 'none';
        contentShow.appendChild(img);
        img.onload = function () {
            console.log(1)
            len--;
            if(len === 0) {
                handleWaterfall();
                // 为什么document.body.scrollHeight和document.documentElement.scrollHeight不一样
                var sHeight = document.documentElement.scrollHeight;
                var iHeight = window.innerHeight;
                if(sHeight <= iHeight) {
                    content.style.height = iHeight - 90 + 'px';
                }else{
                    content.style.height = sHeight + 'px';
                }
            }
        }
    }
}
function handleWaterfall () {
    var imgs = document.querySelectorAll('.content-show img');
    var len = imgs.length;
    var column = contentShow.offsetWidth / (390 + 10);
    var imgHeightArr = [];
    console.log(imgs)
    for(var i = 0; i < len; i++) {
        imgs[i].style.width = 390 + 'px';
        imgs[i].style.position = 'absolute';

        if(i < column) {
            
            imgs[i].style.left = i * (390 + 10) + 'px';
            imgs[i].style.display = 'block';

            imgHeightArr.push((imgs[i].offsetHeight + 10));
        }else if(i >= column) {
            
            var temp = bubblingSort(imgHeightArr)[0];
            var imgHeightIndex = imgHeightArr.indexOf(temp);
            imgs[i].style.left = imgHeightIndex * 400 + 'px';
            imgs[i].style.top = imgHeightArr[imgHeightIndex] + 'px';
            imgs[i].style.display = 'block';

            imgHeightArr[imgHeightIndex] = imgHeightArr[imgHeightIndex] + imgs[i].offsetHeight + 10;
        }
    }
}
// 工具类
// 创建一个指向上传对象（File对象）的URL
// 记得在上传过后，用revokeObjectURL来释放内存，因为会产生内存占用
function getObjectURL(file) {  
    var url = null;
    if(window.createObjectURL != undefined) {
        url = window.createObjectURL(file);
    }else if(window.URL != undefined) {
        url = window.URL.createObjectURL(file);
    }else if(window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}

// 工具类
// 冒泡排序
function bubblingSort (element) {
    element = deepClone1(element);
    for(var i = 0;i<element.length-1;i++) {
        for(var j = 0;j<element.length-i-1;j++){
            if(element[j]>element[j+1]){
                //把大的数字放到后面
                var swap = element[j];
                element[j] = element[j+1];
                element[j+1] = swap;
            }
        }
    }
    return element;
}

// 工具类
// 深拷贝
function deepClone1(obj) {
    var objClone = Array.isArray(obj) ? [] : {};
    if (obj && typeof obj === "object") {
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key] && typeof obj[key] === "object") {
            objClone[key] = deepClone1(obj[key]);
          } else {
            objClone[key] = obj[key];
          }
        }
      }
    }
    return objClone;
}

// 工具类
// 快速排序
// function quickSort(arr) {
//     var trueArr = arr;
//     var left = [];
//     var right = [];
//     if(arr.length <= 1) {
//         return arr;
//     }
//     var pivotIndex = Math.floor(arr.length / 2);
//     var pivot = arr.splice(pivotIndex, 1)[0];
//     for(var i = 0; i < arr.length; i++) {
//         if(arr[i] <= pivot) {
//             left.push(arr[i])
//         }else if(arr[i] > pivot) {
//            right.push(arr[i])
//         }
//     }
//     arr = quickSort(left).concat([pivot], quickSort(right))
//     return arr;
// }
// var arr = [5, 8, 1, 3, 7, 2, 4, 6, 9];
// console.log(bubblingSort(arr));







