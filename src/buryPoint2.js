/**
 * @file: PoliceDog web performance script for client side
 * @author: zhangxiang
 * @updated: 2017.05
 */

(function(){
    let win = window;
    
    win.webPerf = {
        bowser: '',
        appVersion: '',
        system: '',
        perf: null
    };

    /**
     * Browser compatibility:
     * Some brower cannot handle the interface(window.performance), so we must add some code to compatibile some bowser
     * 
     */
    function fallback(){

        if(win.addEventListener){

            win.addEventListener('load', function(){


            });

        } else if(win.attachEvent) {

            win.attachEvent('onload', function(){

            });
            
        } else {

            if(win.onload) {

                let loadFunc = window.onload;

                win.onload = function(){


                    /**do some thing */
                    
                    loadFunc();
                }

            } else {
                win.onload = function(){
                    /**do something */

                }
            }

        }
    }
    
    /**
     * use the window.performance interface
     */
    function getPerformance(){
        let perf = null;
        
        perf = window.performance ? window.performance : (window.wekitPerformance ? window.webkitPerformance : window.msPerformance);

        return perf;
    }
    
    /**
     * to count the static source situation
     */
    function toAnalysisStaticResource(perf){

        let entries = perf.getEntries();
        let javascriptNum = 0, cssNum = 0, imgNum = 0, javascriptTime = 0, cssTime = 0, imgTime = 0, QueryArr = [];

        entries.forEach(function(data, i){
            let name            = data.name;
            let initiatorType   = data.initiatorType;

            let DNSQuery        = data.domainLookupEnd - data.domainLookupStart;
            let connectTime     = data.connectEnd - data.connectStart;
            let loadTime        = data.duration;

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

        const staticSourceInfo = {
            'num': entries.length,
            'javascriptNum': javascriptNum,
            'cssNum': cssNum,
            'imgNum': imgNum,
            'javascriptUseTime': javascriptTime,
            'cssUseTime': cssTime,
            'imgUsetime': imgTime,
            'SourceQuery': QueryArr
        }

        return staticSourceInfo;
    }

    /**
     * to count the time of whole page
     */
    function countTime(resource) {

        let report = {};
        report['staticResource loadSituation'] = toAnalysisStaticResource(perf);

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
         * to count the request time 
         */
        let requestTime = resource.requestEnd - resource.requestStart;


        /**
         * to count the response time
         */
        let responseTime = resource.responseEnd - resource.responseStart;
        report['Request Time'] = responseTime;


        /**
         * 白屏时间
         */
        let whiteTime = resource.responseStart - resource.navigationStart;
        report['WhiteScreen Time'] = whiteTime;


        /**
         * 解析 DOM 树耗费时间
         */
        let DOMAnalysis = resource.domContentLoadedEventEnd - resource.navigationStart;
        report['DOM Analysis'] = DOMAnalysis;


        /**
         * load time
         */
        let loadTime = resource.loadEventEnd - resource.navigationStart;
        report['Load Time'] = loadTime;
    }

    /**
     * is ios or android
     */
    
    /**
     * to get the version of bowser
     */

    /**
     * to get the name of bowser
     */
     
    
})();