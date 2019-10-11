var timer;
function backToPrevious() {
    var back = document.getElementsByClassName('back')[0];
    if(back === null) {
        return;
    }
    clickToPrevious(back);
}
function clickToPrevious(back) {
    back.onclick = function () {
        window.history.go(-1);
    }
}

// 去字符串中的空格
function replaceSpace(obj) {
    for(var i in obj) {
        obj[i] = obj[i].replace(/\s*/g,"");
    }
    return obj;
}
// 判断是否是数字
function ifNum(num) {
    num = isNaN(Number(num));
    return !num;
}
// 判断是否是大小写字母和数字
function ifReg(str) {
    var reg = /^[0-9a-zA-Z]+$/;
    return reg.test(str);
}
// 轮播图移动插件
function bannerMove(element, targetPosition) {
    clearInterval(timer);
    timer = setInterval(function () {
        var nowPosition = element.offsetLeft;
        if(nowPosition === targetPosition) {
            clearInterval(timer);
            return;
        }
        var steps = (targetPosition - nowPosition) / 10;
        if(targetPosition > nowPosition){
            steps = Math.ceil(steps);
        }else{
            steps = Math.floor(steps);
        }
        element.style.left = nowPosition + steps + 'px';
    }, 15)
}
// 返回总秒数，处理为时分秒的函数
// function format (time) {
//     var hour = Math.floor(time / 3600);
//     var minute = Math.floor(time % 3600 / 60);
//     var second = Math.ceil(time % 60);
//     console.log(minute, second)
//     if(second == 60) {
//         second = '0'
//         minute++;
//         if(minute == 60) {
//             hour++;
//         }
//     }
//     hour = hour >= 10 ? hour : '0' + hour;
//     minute = minute >= 10 ? minute : '0' + minute;
//     second = second >= 10 ? second : '0' + second;
//     return hour + ':' + minute + ':' + second;
// }

// 得到现在的时间
// function getNowTime() {
//     var date = new Date();
//     var month = date.getMonth();
//     month = month + 1;
//     month = month > 10 ? month : '0' + month;
//     var day = date.getDate();
//     day = day > 10 ? day : '0' + day;
//     var hour = date.getHours();
//     var minute = date.getMinutes();
//     var result = month + '-' + day + ' ' + hour + ':' + minute;
//     return result;
// }