define(function (require, exports) {
    'use strict';
    // 同样使用seaJS,需要依赖微信提供的分享方法,文件名wxShareDefault.js,在另一个文件里
    var wx = require("http://res.wx.qq.com/open/js/jweixin-1.0.0.js"),
        //$ =require("../lib/jquery"),
        code = require("./wxShareDefault");

    var shareData = {//分享内容
        title: '分享内容的标题',
        desc: '分享内容的描述',
        link: '分享内容的实际链接(地址)',
        imgUrl: '分享内容的logo图片链接'
    };
    var weiboShareData = {},
        shareFriendsData = weiboShareData;
    var imgArr = {
        current: '',//默认展示图片
        urls: []//图片数组
    };//图片列表

    var wxinit= function (jsapi) {

        var jsapi_ticket = jsapi||localStorage.getItem("jsapi"),
            noncestr = code.randomString(16),
            timestamp = Math.ceil(new Date().getTime() / 1000),
            url = location.href.split('#')[0],
            signature = code.hex_sha1("jsapi_ticket=" + jsapi_ticket + "&noncestr=" + noncestr + "&timestamp=" + timestamp + "&url=" + url);
        wx.config({
            debug: false,
            // 申请微信开发者平台所提供的appID
            appId: '**************',  
            timestamp: timestamp,
            nonceStr: noncestr,
            signature: signature,
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'openProductSpecificView',
                'hideOptionMenu',
                'showOptionMenu',
                'previewImage',
                'getLocation',
                'openLocation'
            ]
        });

        wx.error(function (res) {
            alert(JSON.stringify(res))
        });
        wx.ready(function () {
            wx.onMenuShareAppMessage(shareData); // 分享朋友
            wx.onMenuShareTimeline(shareFriendsData); // 分享朋友圈
            wx.onMenuShareQQ(shareData); // 分享扣扣
            wx.onMenuShareWeibo(weiboShareData); // 分享微博
        });
    };

    exports.config = function (conf) {
        shareData = !conf.data ? shareData : conf.data;
        //$.get("/api/wechat-key")
        //    .success(function (db) {
        //
        //        db = typeof(db) == "object" ? db : JSON.parse(db);
        //        var key = db.error == 0 ? db.data.api_key : sessionStorage.getItem("jsapi");
        //
        //        wxinit(key);
        //    })
        if (shareData.weibo) { // 微博分享内容
            weiboShareData.title = shareData.weibo.title;
            weiboShareData.imgUrl = shareData.weibo.imgUrl;
            weiboShareData.desc = shareData.desc;
            weiboShareData.link = shareData.link;
        }else {
            weiboShareData = shareData;
        }

        shareFriendsData = shareData; // 分享朋友圈
        shareFriendsData.title = !shareData.titleFriendsCircle ? shareData.title : shareData.titleFriendsCircle;

        wxinit(conf.jsapi);
    };
    exports.imgShow = function (arr) {
        imgArr = arr;
        //alert(JSON.stringify(arr));
        wx.previewImage(imgArr);
    };
    exports.hideOptionMenu = function () {
        wx.hideOptionMenu();
    };
    //exports.getLocation = function () {
    //
    //};
    exports.showOptionMenu = function () {
        wx.showOptionMenu();
    };
    exports.all = function(){return wx};
});
