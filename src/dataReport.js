/**
 * @file: PoliceDog web performance script for client side
 * @author: zhangxiang
 * @updated: 2017.05.29 14:29
 */

(function(){
    var win = window;

    function addHandler(type, callback) {

        if(win.addEventListener) {

            win.addEventListener(type, callback);

        } else if(win.attachEvent) {

            win.addEventListener('on' + type, callback);
        } else {

            win['on' + type] = callback;
        }
    }

    var perf = (function(){
        var perf = null;
        
        perf = win.performance ? win.performance : (win.wekitPerformance ? win.webkitPerformance : win.msPerformance);

        return perf;
    })();

    var sourceInfo = (function() {
        // Unfortunately Safari does not support ResourceTiming yet, so we'll just need to wait for them to support it.
        if(!perf || !perf.getEntries) {
            return null;
        }

        var entries = perf.getEntries();
        var javascriptNum = 0, cssNum = 0, imgNum = 0, javascriptTime = 0, cssTime = 0, imgTime = 0, QueryArr = [];

        entries.forEach(function(data, i){
            var name            = data.name;
            var initiatorType   = data.initiatorType;
            var DNSQuery        = data.domainLookupEnd - data.domainLookupStart;
            var connectTime     = data.connectEnd - data.connectStart;
            var duration        = data.duration;

            QueryArr.push({
                name: name,
                type: initiatorType,
                DNSQuery: DNSQuery,
                duration: duration,
                connectTime: connectTime
            });
        });

        return QueryArr;
    })();

    var loadInfo = (function(){
        if(!perf) {
            return null;
        }

        var report = {}, resource = perf.timing;
        /**
         * to count the DNS Query time
         */
        var DNSquery = resource.domainLookupEnd - resource.domainLookupStart;
        report['DNSQuery'] = DNSquery;

        /**
         *to count the TCP connect time
         */
        var TCPconnect = resource.connectEnd - resource.connectStart;
        report['TCPConnect'] = TCPconnect;


        /**
         * to count the TTFB time 
         */
        var TTFB = resource.responseStart - resource.navigationStart;
        report['TTFB'] = TTFB;

        /**
         * to count the response time
         */
        var responseTime = resource.responseEnd - resource.responseStart;
        report['RequestTime'] = responseTime;


        /**
         * to count white screen time
         */
        var whiteTime = resource.responseStart - resource.navigationStart;
        report['WhiteScreenTime'] = whiteTime;


        /**
         * to count analysis DOM time
         */
        var DOMAnalysis = resource.domContentLoadedEventEnd - resource.navigationStart;
        report['DOMAnalysis'] = DOMAnalysis;

        /**
         * to count load time
         */
        var loadTime = resource.loadEventEnd - resource.navigationStart;
        report['LoadTime'] = loadTime;

        return report;
    })();

    win.webPerf = {
        perf: perf,
        sourceInfo: sourceInfo,
        loadInfo: loadInfo,
        minimize: function(){

            var sourceInfo = this.sourceInfo, loadInfo = this.loadInfo, data = null;

            Object.keys(loadInfo).map(function(key, val){

                if(val === 0) {
                    delete this[key];
                }
            }); 

            data = {
                userAgent: navigator.userAgent,
                sourceInfo: sourceInfo,
                loadInfo: loadInfo
            }

            return data;
        }
    };

    //兼容 forEach
    if(typeof Array.prototype.forEach !== 'function') {
        Array.prototype.forEach = function(fn, context){
            for(var k = 0, length = this.length; k < length; k++) {
                if(typeof fn === 'function' && Object.prototype.hasOwnProperty.call(this.k)) {
                    fn.call(context, this[k], k, this);
                }
            }
        }
    }
    /**
     * send data
     */
     var jsLoad = 0, 
        jsDNSQuery = 0, 
        jsAmount = 0;
        stylesheetLoad = 0, 
        stylesheetDNSQuery = 0, 
        stylesheetAmount = 0,
        imgLoad = 0,
        imgDNSQuery = 0,
        imgAmount = 0.
        xhrDNSQuery = 0,
        xhrload = 0,
        xhrAmount = 0;
    
    sourceInfo && sourceInfo.forEach(function(data, i){
        switch (data.type){
            case 'script':
                jsLoad += data.duration;
                jsDNSQuery += data.DNSQuery;
                jsAmount ++;
                break;
            case 'link':
                stylesheetLoad += data.duration;
                stylesheetDNSQuery += data.DNSQuery;
                stylesheetAmount ++;
                break;
            case 'img':
                imgLoad += data.duration;
                imgDNSQuery += data.DNSQuery;
                imgAmount++;
                break;
            case 'xmlhttprequest':
                xhrDNSQuery += data.DNSQuery;
                xhrload += data.duration;
                xhrAmount++;
                break;
        }
    });
    var sourceTime = {
        jsLoad: jsLoad,
        jsDNSQuery: jsDNSQuery,
        jsAmount: jsAmount,
        stylesheetLoad: stylesheetLoad,
        stylesheetDNSQuery: stylesheetDNSQuery,
        stylesheetAmount: stylesheetAmount,
        imgLoad: imgLoad,
        imgDNSQuery: imgDNSQuery,
        imgAmount: imgAmount,
        xhrload: xhrload,
        xhrDNSQuery: xhrDNSQuery,
        xhrAmount: xhrAmount
    }
        
    //页面加载信息，分为三个字段上报：页面整体加载时间，DNS 查询时间，TTFB
    ga('send', 'timing', 'pageload', 'load', loadInfo.LoadTime);
    ga('send', 'timing', 'pageload', 'DNSQuery', loadInfo.DNSQuery);
    ga('send', 'timing', 'pageload', 'TTFB', loadInfo.TTFB);
    //静态资源上报: Js 加载时间，DNS 查询时间，TTFB 时间以及 js 文件个数
    // 样式表 加载时间， DNS 查询时间， TTFB， stylesheel 文件个数
    // 图片 加载时间， DNS 查询时间， 图片个数
    if(sourceInfo) {
        ga('send', 'timing', 'entries', 'js loadtime', sourceTime.jsLoad);
        ga('send', 'timing', 'entries', 'js DNSQuery', sourceTime.jsDNSQuery);
        ga('send', 'timing', 'entries', 'js Amount', sourceTime.jsAmount);
        ga('send', 'timing', 'entries', 'css loadtime', sourceTime.stylesheetLoad);
        ga('send', 'timing', 'entries', 'css DNSQuery', sourceTime.stylesheetDNSQuery);
        ga('send', 'timing', 'entries', 'css Amount', sourceTime.stylesheetAmount);
        ga('send', 'timing', 'entries', 'img loadtime', sourceTime.imgLoad);
        ga('send', 'timing', 'entries', 'img DNSQuery', sourceTime.imgDNSQuery);
        ga('send', 'timing', 'entries', 'img Amount', sourceTime.imgAmount);
        ga('send', 'timing', 'entries', 'xhr load', sourceTime.xhrload);
        ga('send', 'timing', 'entries', 'xhr DNSQuery', sourceTime.xhrDNSQuery);
        ga('send', 'timing', 'entries', 'xhr Amount', sourceTime.xhrAmount);
    }
})();
