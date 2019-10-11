var file = document.querySelector('.file');
var img = document.getElementsByTagName('img')[0];
var imgData = '';
function imgChange() {
    file.onchange = function () {
        if(typeof FileReader === 'undefined') {
            alert('您的浏览器不支持上传头像，请更新');
            return false;
        }
        var formatName = file.files[0].name;
        formatName = formatName.substr(formatName.lastIndexOf('.'));
        if(formatName !== '.png' && formatName !== '.jpg' && formatName !== '.jpeg'){
            alert('请上传图片');
            return false;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file.files[0])
        reader.onload = function () {
            img.src = reader.result;
            imgData = reader.result;
        }
    }
}

function clickFinish() {
    var btn = document.getElementsByClassName('setup-btn')[0];
    btn.onclick = function () {
        var nickName = document.getElementsByClassName('nickName')[0];
        var radio = document.getElementsByClassName('radio');
        var obj = {
            nickname : '',
            sex : ''
        }
        obj.nickname = nickName.value;
        var len = radio.length;
        for(var i = 0; i < len; i++) {
            if(radio[i].checked){
                obj.sex = radio[i].value;
            }
        }
        obj = replaceSpace(obj);
        if(obj.nickname === '' || obj.sex === '') {
            alert('请填写您的昵称并且选择您的性别');
            return false;
        }
        if(obj.nickname.length > 8) {
            alert('昵称长度不能超过八位');
            return false;
        }
        obj.avatar = imgData;
        sendSetupAjax(obj);
    }
}

function sendSetupAjax(obj) {
    var user = obj;
    console.log(user);
    var token = sessionStorage.getItem("token");
    token = 'Bearer ' + token + "";
    console.log(token);
    user = JSON.stringify(user);
    console.log(user);
    $.ajax({
        url : 'http://39.97.243.38:6116/user/updateuser',
        type : 'post',
        data : user,
        dataType : 'json',
        contentType: 'application/json',
        headers : {
            "Content-type" : "application/json",
            "Authorization" : token
        },
        success : function (res) {
            console.log(res);
            if(res.code === 20000) {
                alert('您已设置成功');
                sessionStorage.setItem('name', res.data.nickname);
                sessionStorage.setItem('avatar', res.data.avatar);
                window.location.href = './index.html';
            }else if(res.code === 20001 ){
                alert('您设置失败，请重新设置')
                return false;
            }
        }
    })
}

function init() {
    imgChange();
    clickFinish();
}
init();


