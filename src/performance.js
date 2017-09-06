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

    function generateUUID() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        var uuid = s.join("");
        return uuid;
    }

    function setCookie(name, value, days){
        var expires = '';
        if(days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/"
    }

    function getCookie(name){
        var nameEQ = name + '=';
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            //去除头部空白符
            while(c.charAt(0) == ' ') {
                c = c.substring(1, c.length); 
            }
            if(c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    }

    function getLocation(local){
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                local = position;
            });
        } else {
            return void 0;
        }
    }

    function getNetworkType() {
        if(navigator.connection) {
            return navigator.connection.type;
        } else {
            return void 0;
        }
    }

    var perf = (function(){
        var perf = null;
        
        perf = win.performance ? win.performance : (win.wekitPerformance ? win.webkitPerformance : win.msPerformance);

        return perf;
    })();

    var sourceInfo = (function() {
        if(!perf) {
            return null;
        }

        var entries = perf.getEntries();
        var javascriptNum = 0, cssNum = 0, imgNum = 0, javascriptTime = 0, cssTime = 0, imgTime = 0, QueryArr = [];

        entries.forEach(function(data, i){
            var name            = data.name;
            var initiatorType   = data.initiatorType;
            let DNSQuery        = data.domainLookupEnd - data.domainLookupStart;
            let connectTime     = data.connectEnd - data.connectStart;
            let duration        = data.duration;

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
        report['DNS Query'] = DNSquery;

        /**
         *to count the TCP connect time
         */
        var TCPconnect = resource.connectEnd - resource.connectStart;
        report['TCP Connect'] = TCPconnect;


        /**
         * to count the TTFB time 
         */
        var TTFB = resource.responseStart - resource.navigationStart;
        report['TTFB'] = TTFB;

        /**
         * to count the response time
         */
        var responseTime = resource.responseEnd - resource.responseStart;
        report['Request Time'] = responseTime;


        /**
         * to count white screen time
         */
        var whiteTime = resource.responseStart - resource.navigationStart;
        report['WhiteScreen Time'] = whiteTime;


        /**
         * to count analysis DOM time
         */
        var DOMAnalysis = resource.domContentLoadedEventEnd - resource.navigationStart;
        report['DOM Analysis'] = DOMAnalysis;

        /**
         * to count load time
         */
        var loadTime = resource.loadEventEnd - resource.navigationStart;
        report['Load Time'] = loadTime;

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

    //设置客户端 ID
   getCookie('webPerfUID') || setCookie('webPerfUID', generateUUID(), 1);


    /**
     * send data
     */
    addHandler('loaded', function(){
        if(getCookie('lastReport')) {
            return;
        }
        var scripts         = document.getElementsByTagName('script');
        var thisScriptSrc   = scripts[scripts.length - 1].src; 
        var pid             = thisScriptSrc.slice(thisScriptSrc.indexOf('?') + 1).split('=')[1];
        var network         = getNetworkType();
        var currentURL      = window.location.href;
        var address;
        getLocation(address);

        var perfData        = webPerf.minimize();
        perfData.address    = address.coords ? address.coords.altitude + ',' + address.coords.longitude : void 0;
        perfData.network    = network;
        perfData.pid        = pid;
        perfData.currentURL = currentURL;
        perfData.timestamp  = new Date().getTime();
        
        var url = '', query = '?' + JSON.stringify(perfData);

        (new Image()).src = url + query;
        
        //设置最后一次上报数据时间, 一天上报一次
        setCookie('lastReport', new Date().getTime(), 1);
    });
})();