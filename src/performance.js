/**
 * @file: PoliceDog web performance script for client side
 * @author: zhangxiang
 * @updated: 2017.05.29 14:29
 */

(function(){
    let win = window;

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
                sourceInfo: sourceInfo.sourceQueue,
                loadInfo: loadInfo
            }

            return data;
        }
    };


    /**
     * send data
     */
     addHandler('loaded', function(){
        
        var scripts         = document.getElementsByTagName('script');
        var thisScriptSrc   = scripts[scripts.length - 1].src; 
        var pid             = thisScriptSrc.slice(thisScriptSrc.indexOf('?') + 1).split('=')[1];
        
        var currentURL      = window.location.href;

        var perfData        = webPerf.minimize();
        perfData.pid        = pid;
        perfData.currentURL = currentURL;
        perfData.timestamp  = new Date().getTime();
        
        var url = '', query = '?' + JSON.stringify(perfData);

        (new Image()).src = url + query;
     });
})();