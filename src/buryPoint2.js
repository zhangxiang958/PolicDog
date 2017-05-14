(function(){
    
    console.log(performance.timing);

    let perf = window.performance;
    let resource = perf.timing;

    console.log(resource);
    /**
     * static source count
     */
    let entries = perf.getEntries();
    let javascriptNum = 0, cssNum = 0, imgNum = 0;

    entries.foeEach(function(data, i){

        switch (data.initiatorType) {
            case 'script': 
                javascriptNum ++;
                break;
            case 'css':
                cssNum ++;
                break;
            case 'img':
                imgNum ++;
                break;
        }   
        

    });

    const staticSourceInfo = {
        'num': entries.length,
        'javascriptNum': 1,
        'cssNum': 2,
        'imgNum': 3
    }

    policeReport.staticSourceInfo = staticSourceInfo;
    /**
     * DNS count -- domainlookup time
     */
    let DNSquery = resource.domainLookupEnd - resource.domainLookupStart;
    /**
     * TCP time count -- connect time
     */
    let TCPconnect = resource.connectEnd - resource.connectStart;
    /**
     * request time 
     */
    // let requestTime = resource.requestStart - resource.responseStart;
    /**
     * response time
     */
    let responseTime = resource.responseEnd - resource.responseStart;
    /**
     * load time
     */

})();