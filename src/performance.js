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
            var perf = null;
        
            perf = win.performance ? win.performance : (win.wekitPerformance ? win.webkitPerformance : win.msPerformance);

            return perf;
        })(),
        sourceInfo: (function() {
            if(!this.perf) {
                return null;
            }

            var entries = this.perf.getEntries();
            var javascriptNum = 0, cssNum = 0, imgNum = 0, javascriptTime = 0, cssTime = 0, imgTime = 0, QueryArr = [];

            entries.forEach(function(data, i){
                var name            = data.name;
                var initiatorType   = data.initiatorType;

                var DNSQuery        = data.domainLookupEnd - data.domainLookupStart;
                var connectTime     = data.connectEnd - data.connectStart;
                var loadTime        = data.duration;

                //to count time of the different type of resource
                switch (initiatorType) {
                    case 'script': 
                        javascriptNum ++;
                        javascriptTime += data.responseEnd - data.startTime
                        break;
                    case 'css':
                        cssNum ++;
                        cssTime += data.responseEnd - data.startTime;
                        break;
                    case 'img':
                        imgNum ++;
                        imgTime += data.responseEnd - data.startTime;
                        break;
                }

                QueryArr.push({
                    name: name,
                    type: initiatorType,
                    DNSQuery: DNSquery,
                    connectTime: connectTime,
                    loadTime: loadTime
                });
            });

            var staticSourceInfo = {
                'sourceAmount': entries.length,
                'scriptAmount': javascriptNum,
                'stylesheetAmount': cssNum,
                'imageAmount': imgNum,
                'scriptLoad': javascriptTime,
                'stylesheetLoad': cssTime,
                'imageLoad': imgTime,
                'sourceQueue': QueryArr
            }

            return staticSourceInfo;
        })(),
        loadInfo: (function(){
            if(!this.perf) {
                return null;
            }

            var report = {}, resource = this.perf;
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
             * to count the request time 
             */
            var requestTime = resource.requestEnd - resource.requestStart;


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
        })(),
        bowser: (function(){
            /**
             * to get the version/name of bowser
             */
             var browerName = navigator.userAgent.toLowerCase();

             if(/msie/i.test(browerName) && !/opera/.test(browerName)) {

                 return 'IE';
             } else if(/firefox/i.test(browerName)){

                 return 'firefox';
             } else if (/chrome/i.test(browerName) && /webkit/i.test(browerName) && /mozilla/i.test(browerName)) {

                 return 'chrome'
             } else if(/opera/i.test(browerName)) {

                 return 'opera';
             } else if(/webkit/i.test(browerName) && !(/chrome/i.test(browerName) && /webkit/i.test(browerName) && /mozilla/i.test(browerName))){

                return 'safari';
             } else {

                 return 'unknow';
             }
        })(),
        isMobile: (function(){
            
            var ua      = navigator.userAgent;

            var mobile  = !!userAgent.match(/AppleWebkit.*Mobile.*/);
            var ios     = !!userAgent.match(/\(i[^;]+;( U;) ? CPU.+Mac OS X/);
            var android = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1;
            var iPhone  = userAgent.indexOf('iPhone') > -1;
            var iPad    = userAgent.indexOf('iPad') > -1;

            if(mobile || ios || android || iPhone || ipad) {
                return true;
            }

            return false;
        })(),
        isIOSorAndroid: (function(){
            /**
             * is ios or android
             */
            var ua = navigator.userAgent;

            if(!!ua.match(/\(i[^;]+;( U;) ? CPU.+Mac OS X/)) {

                return 'IOS';
            } else if(ua.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1) {

                return 'Android';
            }

        })(),
        minimize: function(){

            var sourceInfo = this.sourceInfo, loadInfo = this.loadInfo, data = null;

            sourceInfo.each(function(key, val){

                if(val === 0) {
                    delete this[key];
                }
                if(key === 'sourceQueue') {
                    (val.length === 0) && (delete this[key]);
                }
            });

            loadInfo.each(function(key, val){

                if(val === 0) {
                    delete this[key];
                }
            }); 

            sourceInfo  = JSON.stringify(sourceInfo);
            loadInfo    = JSON.stringify(loadInfo);
            
            data = {
                bowser: this.bowser,
                isMobile: this.isMobile,
                isIOSorAndroid: this.isIOSorAndroid,
                sourceInfo: sourceInfo,
                loadInfo: loadInfo
            }

            return JSON.stringify(data);
        }
    };


    /**
     * send data
     */
     addHandler('loaded', function(){

        var url = '', query = '?' + webPerf.minimize();

        (new Image()).src = url + query;
     });
})();