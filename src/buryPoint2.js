(function(){
    
    console.log(performance.timing);

    let perf = window.performance;
    let resource = perf.timing;

    console.log(resource);

    
    /**
     * static source count
     */
    let entries = perf.getEntries();
    let javascriptNum = 0, cssNum = 0, imgNum = 0, javascriptTime = 0, cssTime = 0, imgTime = 0;

    entries.forEach(function(data, i){

        //分类计算静态资源数量
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

    policeReport['静态资源加载情况'] = staticSourceInfo;


    /**
     * DNS count -- domainlookup time
     */
    let DNSquery = resource.domainLookupEnd - resource.domainLookupStart;
    policeReport['DNS 查询时间'] = DNSquery;



    /**
     * TCP time count -- connect time
     */
    let TCPconnect = resource.connectEnd - resource.connectStart;
    policeReport['TCP 连接时间'] = TCPconnect;


    /**
     * request time 
     */
    // let requestTime = resource.requestStart - resource.responseStart;



    /**
     * response time
     */
    let responseTime = resource.responseEnd - resource.responseStart;
    policeReport['请求时间'] = responseTime;


    /**
     * 白屏时间
     */
    let whiteTime = resource.responseStart - resource.navigationStart;
    policeReport['白屏时间'] = whiteTime;


    /**
     * 解析 DOM 树耗费时间
     */
    let DOMTime = resource.domContentLoadedEventEnd - resource.navigationStart;
    policeReport['解析 DOM 耗费时间'] = DOMTime;


    /**
     * load time
     */
    let loadTime = resource.loadEventEnd - resource.navigationStart;
    policeReport['onload 加载时间'] = loadTime;

    console.log(policeReport);
    //分开 IE 与高级浏览器
})();