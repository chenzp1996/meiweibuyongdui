import Cookies from 'js-cookie';
import qs from 'qs';


//设置页面title
export function setPageTitle(title) {
    const ua = navigator.userAgent.toLowerCase();
    document.title = title
    if (/iphone|ipad|ipod/.test(ua)) {
        var iframe = document.createElement('iframe')
        iframe.setAttribute('src', '/favicon.ico');
        iframe.style.display = 'none';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        var iframeCallback = function () {
          setTimeout(function () {
            iframe.removeEventListener('load', iframeCallback)
            document.body.removeChild(iframe)
          }, 0)
        }
        iframe.addEventListener('load', iframeCallback)
        document.body.appendChild(iframe)
    }
}

export function getQueryFromUrl(key) {
    let queryString = qs.parse(location.search, { ignoreQueryPrefix: true });
    if(key instanceof Array){
        let obj = {};
        for(let i of key){
            obj[i] = queryString[i]
        }
        return obj;
    }
    return queryString[key];
}

export function getChannel(){
    let channel = getQueryFromUrl('channel') || Cookies.get('_channel') || 'other';
    return channel;
}

export function isIOS() {
    let ua = navigator.userAgent;
    return /iphone|ipad|ipod/i.test(ua);
}

export function isAndriod() {
    let ua = navigator.userAgent;
    return /android/i.test(ua);
}

export function isWeChat(){
    var ua = window.navigator.userAgent.toLowerCase();
    return /micromessenger/i.test(ua);
}

export function isMobile(){
    return isIOS() && isAndriod();
}

export function getViewPortSize(_w) {//获取页面的窗口大小
    _w = _w || window;
    //for all and IE9+
    if (_w.innerWidth != null) return {
        x: _w.innerWidth,
        y: _w.innerHeight
    };
    //for IE678
    var _d = _w.document;
    if (document.compatMode == "CSS1Compat") return { //for IE678
        x: _d.documentElement.clientWidth,
        y: _d.documentElement.clientHeight
    };
    //for other mode
    return {
        x: _d.body.clientWidth,
        y: _d.body.clientHeight
    };
}

/**
 * @param to        要定位到的位置
 * @param duration  动画时长
 * 
 */
export function scrollToElement(to, duration) {
    const element = document.body.scrollTop ? document.body : document.documentElement,
        start = element.scrollTop,
        change = to - start,
        startDate = +new Date(),
        // t = current time
        // b = start value
        // c = change in value
        // d = duration
        easeInOutQuad = function (t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        },
        animateScroll = function () {
            const currentDate = +new Date();
            const currentTime = currentDate - startDate;
            element.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration));
            if (currentTime < duration) {
                requestAnimationFrame(animateScroll);
            }
            else {
                element.scrollTop = to;
            }
        };
    animateScroll();
};

/**
 *
 * @param url    要添加查询参数的链接
 * @param key   查询参数key
 * @param value    查询参数value
 * @returns {*}    new url
 */
export function addQueryString( url, key, value ) {
    let join = /\?/.test( url) ? '&' : '?';
    return `${url}${join}${key}=${value}`;
}


//订单信息storage
export function saveOrderToStorage(key, value) {
    if(supportLocalStorage()){
        let storageData = localStorage.getItem(key),
            newData = value,
            reg = new RegExp(value, 'ig');
        if( reg.test(storageData) ){
            return ;
        }
        if(storageData && storageData !== 'null' && storageData !== 'undefined'){
            newData = `${storageData},${value}`
        }
        localStorage.setItem(key, newData)
    }
}
//判断两个时间是否在一周内
export function isInAWeek(nowTime,targetTime,forecast_name) {
    let last_show_click = Cookies.get(forecast_name+"_last_click"),//上次点击查看的时间
        last_show_close = Cookies.get(forecast_name+"_last_close");//上次点击关闭的时间
    last_show_click = last_show_click ? parseInt(last_show_click): null;//上次显示的时间
    last_show_close = last_show_close ? parseInt(last_show_close): null;//上次关闭的时间
    if(nowTime - last_show_close < 60*60*24*1000){//一天内点击关闭，不再显示
        return false;
    }
    if(last_show_click){  
        if(nowTime > targetTime && targetTime > last_show_click && targetTime > nowTime - 7*60*60*1000*24){//七天内，显示过的已支付的订单，不再显示，所以只显示上次显示过之后至当前的时间内的订单
            Cookies.set(forecast_name+"_last_show", nowTime, {
                expires: 365
            });
            return true;
        } 
        return false;
    }else{
        if(targetTime > nowTime - 7*60*60*1000*24){//用户没有查看过的订单，显示七天内的
            Cookies.set(forecast_name+"_last_show", nowTime, {
                expires: 365
            });
            return true;
        }
        return false;
    }  
}

export function callWeChatByIFrame(url) {
    var last = Date.now(),
        ifr = document.createElement('IFRAME');
    ifr.src = url;
    ifr.style.position = 'absolute';
    ifr.style.left = '-1000px';
    ifr.style.top = '-1000px';
    ifr.style.width = '1px';
    ifr.style.height = '1px';
    //设置一个10秒的动画，用于检查客户端是否被调起。
    ifr.style.webkitTransition = 'all 4s';
    document.body.appendChild(ifr);
    setTimeout(function() {
        ifr.addEventListener('webkitTransitionEnd', function() {    //如果动画4s内完成说明并没有安装
            document.body.removeChild(ifr);
            if( Date.now() - last < 3000 ) {    //alert('并没有安装客户端！')
                location.href = url;
            }
        }, false);
        ifr.style.left = '-10px';    //动画使用
    }, 0);
};

//判断是否支持localStorage
export function supportLocalStorage(){
	if(!localStorage){
		return false;
	}
	let supportFlag = false;
	try {
		localStorage.setItem('support', 1);
		localStorage.removeItem('support');
		supportFlag = true;
	} catch (error) {
		supportFlag = false;
	} finally {
		return supportFlag;
	}
}

/***
   * 是否正在监听popstate事件
   * 
   */
  export function isListenPopstateNow(){
    return new Promise(function(resolve,reject){
        let isListenPopstateNow = false;
        window.addEventListener('pageshow', function (event) {
            // 解决某些手机的不能重新监听popstate事件的问题,
            isListenPopstateNow = false;
            setTimeout(function () { 
                isListenPopstateNow = true;
                resolve(isListenPopstateNow)
            }, 300); //延迟1秒 防止某些情况从上一个页面返回会立即执行popstate事件 
        })
    })
}


