/**
 * error.js to catch the error in browser
 * @athor: zhangxiang
 * @updated: 2017/07/07
 */

/**当脚本与网页违背同源策略的时候，浏览器会隐藏错误信息，只能获取到一个简单的 script error
 * 所以需要在非同源的脚本标签加上 crossorigin 属性，或者在 js 所在的 CDN 服务器加上 Access-Control-Allow-Origin：*
 * 或者使用 throw new Error('error msg')
 */
(function(){
    var errors = [];
    var maxErrorCount = 10, nowErrorCount = 0;

    function ReportError(requestURL, reportMsg){
        
        var img = new Image();
        img.src = requestURL.indexOf('?') > -1 ? (requestURL + reportMsg) : (requestURL + '?' + reportMsg);
    }

    window.onerror = function(msg, url, line, col, errObject){

        if(msg == '' || line == 0 || col == 0) {
            return;
        }

        if(typeof msg !== "undefined" && nowErrorCount < maxErrorCount) {
            
            nowErrorCount ++;
            var string = msg.toLowerCase();
            var substring = 'script error.';

            if(!url) {
                url = location.href;
            }

            if(string.indexOf(substring) > -1){
                console.log('Script Error: See Browser Console for Detail.');
                msg = 'Script Error: See Browser Console for Detail.';
            }

            if (!!errObject && !!errObject.stack){ 
                //如果浏览器有堆栈信息 
                //直接使用 
                data.detail = error.stack.toString(); 
            }else if (!!arguments.callee){
                //尝试通过callee拿堆栈信息
                var ext = []; 
                var f = arguments.callee.caller, c = 3; 
                //这里只拿三层堆栈信息 
                while (f && (--c>0)) { 
                    ext.push(f.toString()); 
                    if (f === f.caller) { 
                        break;//如果有环 
                    } 
                    f = f.caller; 
                } 
                ext = ext.join(","); 
                data.detail = ext;
            } 

            var report = {
                msg: msg,
                url: url,
                line: line,
                col: col,
                detail: detail,
                ua: navigator.userAgent,
                time: (new Date()).getTime()
            };

            errors.push(report);
            if(nowErrorCount == 10) {
                ReportError('', JSON.stringify(errors));
            }
        }

        return false;
    }

})();
