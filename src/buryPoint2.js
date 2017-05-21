/**
 * @file: PoliceDog web performance script for client side
 * @author by zhangxiang
 * @update 2017.05
 */

(function(){
    
    /**
     * Browser compatibility:
     * Some brower cannot handle the interface(window.performance), so we must add some code to compatibile some bowser
     * 
     */


    if(window.addEventListener){

        window.addEventListener('load', function(){


        });

    } else if(window.attachEvent) {

        window.attachEvent('onload', function(){

        });
        
    } else {

        if(window.onload) {

            let loadFunc = window.onload;

            window.onload = function(){


                /**do some thing */

                loadFunc();
            }

        } else {
            window.onload = function(){
                /**do something */
            }
        }

    }

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
        let javascriptNum = 0, cssNum = 0, imgNum = 0, javascriptTime = 0, cssTime = 0, imgTime = 0;

        entries.forEach(function(data, i){

            //to count time of the different type of resource
            switch (data.initiatorType) {
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
        });

        const staticSourceInfo = {
            'num': entries.length,
            'javascriptNum': javascriptNum,
            'cssNum': cssNum,
            'imgNum': imgNum,
            'javascriptUseTime': javascriptTime,
            'cssUseTime': cssTime,
            'imgUsetime': imgTime
        }

        return staticSourceInfo;
    }

    policeReport['staticResource loadSituation'] = toAnalysisStaticResource(perf);

    /**
     * to count the DNS Query time
     */
    let DNSquery = resource.domainLookupEnd - resource.domainLookupStart;
    policeReport['DNS Query'] = DNSquery;



    /**
     *to count the TCP connect time
     */
    let TCPconnect = resource.connectEnd - resource.connectStart;
    policeReport['TCP Connect'] = TCPconnect;


    /**
     * to count the request time 
     */
    let requestTime = resource.requestEnd - resource.requestStart;


    /**
     * to count the response time
     */
    let responseTime = resource.responseEnd - resource.responseStart;
    policeReport['Request Time'] = responseTime;


    /**
     * 白屏时间
     */
    let whiteTime = resource.responseStart - resource.navigationStart;
    policeReport['WhiteScreen Time'] = whiteTime;


    /**
     * 解析 DOM 树耗费时间
     */
    let DOMAnalysis = resource.domContentLoadedEventEnd - resource.navigationStart;
    policeReport['DOM Analysis'] = DOMAnalysis;


    /**
     * load time
     */
    let loadTime = resource.loadEventEnd - resource.navigationStart;
    policeReport['Load Time'] = loadTime;

    console.log(policeReport);
    //分开 IE 与高级浏览器
})();