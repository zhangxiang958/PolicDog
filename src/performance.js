/**
 * @file: PoliceDog web performance script for client side
 * @author: zhangxiang
 * @updated: 2017.05.29 14:29
 */

(function(){
    let win = window;
    
    Object.prototype.each = function(callback){

        for(var key in this) {
            if(this.hasOwnProperty(key)) {

                if(callback.call(this, key, this[key]) === false) {

                    break;
                }
            }
        }
    }

    function addHandler(type, callback) {

        if(win.addEventListener) {

            win.addEventListener(type, callback);

        } else if(win.attachEvent) {

            win.addEventListener('on' + type, callback);
        } else {

            win['on' + type] = callback;
        }
    }

    win.webPerf = {
        perf: (function(){
            let perf = null;
        
            perf = win.performance ? win.performance : (win.wekitPerformance ? win.webkitPerformance : win.msPerformance);

            return perf;
        })(),
        sourceInfo: (function() {
            if(!this.perf) {
                return null;
            }

            let entries = this.perf.getEntries();
            let QueryArr = [];

            entries.forEach(function(data, i){
                let name            = data.name;
                let initiatorType   = data.initiatorType;

                let DNSQuery        = data.domainLookupEnd - data.domainLookupStart;
                let connectTime     = data.connectEnd - data.connectStart;
                let duration        = data.duration;

                QueryArr.push({
                    name: name,
                    type: initiatorType,
                    DNSQuery: DNSquery,
                    duration: duration,
                    connectTime: connectTime
                });
            });

            return QueryArr;
        })(),
        loadInfo: (function(){
            if(!this.perf) {
                return null;
            }

            let report = {}, resource = this.perf;
            /**
             * to count the DNS Query time
             */
            let DNSquery = resource.domainLookupEnd - resource.domainLookupStart;
            report['DNS Query'] = DNSquery;

            /**
             *to count the TCP connect time
             */
            let TCPconnect = resource.connectEnd - resource.connectStart;
            report['TCP Connect'] = TCPconnect;


            /**
             * to count the TTFB time 
             */
            let TTFB = resource.responseStart - resource.navigationStart;
            report['TTFB'] = TTFB;

            /**
             * to count the response time
             */
            let responseTime = resource.responseEnd - resource.responseStart;
            report['Request Time'] = responseTime;


            /**
             * to count white screen time
             */
            let whiteTime = resource.responseStart - resource.navigationStart;
            report['WhiteScreen Time'] = whiteTime;


            /**
             * to count analysis DOM time
             */
            let DOMAnalysis = resource.domContentLoadedEventEnd - resource.navigationStart;
            report['DOM Analysis'] = DOMAnalysis;

            /**
             * to count load time
             */
            let loadTime = resource.loadEventEnd - resource.navigationStart;
            report['Load Time'] = loadTime;

            return report;
        })(),
        minimize: function(){

            let sourceInfo = this.sourceInfo, loadInfo = this.loadInfo, data = null;

            loadInfo.each(function(key, val){

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
        perfData.timestamp  = new Date();
        
        var url = '', query = '?' + JSON.stringify(perfData);

        (new Image()).src = url + query;
     });
})();