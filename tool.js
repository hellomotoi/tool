define(function (require) {
  // 使用zepto/jquery,加载方式选择seaJS,其实AMD,CMD加载方式看业务需求,也没啥你好我不好的
    var jQuery=require("../mlib/zepto");
    var $goback = jQuery("[data-target='back']");
    var _history = sessionStorage.getItem("urlHistory");
    if(!_history){
        _history = [(window.location.origin+"/")];
        sessionStorage.setItem("urlHistory",_history.toString());
    }else {
        _history = _history.split(",");
    }
    var App = {
        //设置cookie
        cookie: function (name, value, options) {
            if (typeof value != 'undefined') {
                options = options || {};
                if (value === null) {
                    value = '';
                    options = jQuery.extend({}, options);
                    options.expires = -1;
                }
                var expires = '';
                if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                    var date;
                    if (typeof options.expires == 'number') {
                        date = new Date();
                        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                    } else {
                        date = options.expires;
                    }
                    expires = '; expires=' + date.toUTCString();
                }
                var path = options.path ? '; path=' + (options.path) : '; path=/';
                var domain = options.domain ? '; domain=' + (options.domain) : '';
                var secure = options.secure ? '; secure' : '';
                document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
            } else {
                var cookieValue = null;
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = jQuery.trim(cookies[i]);
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
        },
        //获取url参数
        getUrlParam: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(decodeURIComponent(r[2]));
            return null;
        },
        browser:function(){
            var u = navigator.userAgent, app = navigator.appVersion,sUserAgent = u.toLowerCase();
            return {//移动终端浏览器版本信息
                isWin : (navigator.platform == "Win32") || (navigator.platform == "Windows"),
                isMac:(navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel"),
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
                mobile: sUserAgent.match(/iphone os/i)||sUserAgent.match(/android/i)||sUserAgent.match(/windows mobile/i)||sUserAgent.match(/windows phone/i), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                isWX : sUserAgent.match(/MicroMessenger/i) == 'micromessenger',//是否是微信
                webApp: u.indexOf('Safari') == -1 ,//是否web应该程序，没有头部与底部
                isIE6 : navigator.appName=="Microsoft Internet Explorer" && app.split(";")[1].replace(/[ ]/g,"")=="MSIE6.0",//ie6
                isIE7 : navigator.appName == "Microsoft Internet Explorer" && app.split(";")[1].replace(/[ ]/g,"")=="MSIE7.0",//IE7
            };
        }(),
        addMyFavorite: function (url,title) {
            var _url = url||window.location;
            var _title = title||document.title;
            var ua = navigator.userAgent.toLowerCase();
            var _Btn=this.browser.isMac?"Command":"Ctrl";
            if (ua.indexOf("360se") > -1) {
                alert("由于360浏览器功能限制，请按 "+_Btn+"+D 手动收藏！");
            }
            else if (ua.indexOf("msie 8") > -1) {
                window.external.AddToFavoritesBar(_url, _title); //IE8
            }
            else if (document.all) {
                try {
                    window.external.addFavorite(_url, _title);
                } catch (e) {
                    alert('您的浏览器不支持,请按 '+_Btn+'+D 手动收藏!');
                }
            }
            else if (window.sidebar) {
                window.sidebar.addPanel(_title, _url, "");
            }
            else {
                alert('您的浏览器不支持,请按 '+_Btn+'+D 手动收藏!');
            }
        },
        getLocalUrl : function (src) {
            var _href = window.location.host;
            if(_href.indexOf("easywed")>0){
                return "http://sa.easywed.cn"+((!src||src.indexOf("src")>0)?"/dist":src);
            }else if(_href.indexOf("trunk")>0){
                return "http://static.trunk.amazingday.cn"+((!src||src.indexOf("src")>0)?"/src":src)
            }else {
                return "http://static.dev.amazingday.cn"+((!src||src.indexOf("src")>0)?"/src":src);
            }
        },
        history :{
            blackList:[
                "/login.html",
                "/register.html",
                "/find-pass.html",
                "/reset-pass.html"
            ],
            goBack : function () {
                if(window.history.length==0){
                    window.location.href = "/";
                }else{
                    window.history.go(-1);
                }
                /*var _url = window.location.pathname;
                if(App.history.blackList.indexOf(_url)>-1){
                    window.history.go(-1);
                }else{
                    window.location.href = App.history.getLast();
                }*/
            },
            getLast:function () {
                var _href = _history[1];
                sessionStorage.setItem("urlHistory", _history.slice(1).toString());
                return _href;
            },
            setHistory: function (url) {
                if(url != _history[0]){
                    /*if(document.referrer == _history[0]){
                        _history = _history.slice(1);
                    }*/
                    _history.splice(0,0,url);
                    sessionStorage.setItem("urlHistory",_history.toString());
                }
            },
            init:function () {
                /*var _url = window.location.pathname;
                 if(App.history.blackList.indexOf(_url)<0){
                 App.history.setHistory(window.location.href)
                 }*/
                var _url = window.location.pathname;
                if(App.history.blackList.indexOf(_url)<0&&_url!="/im/index"){
                    sessionStorage.removeItem("IMurl");
                }
                $goback.on("tap",function () {
                    window.history.go(-1);
                    // App.history.goBack();
                })

            }
        },
        language:(navigator.browserLanguage || navigator.language).toLowerCase()

    };
    
    return App;
});
