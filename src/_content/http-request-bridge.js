const _HttpLog = new Log('ContentScript-HttpLog');

function InitializeHttpRequestBridge() {
    //
    // Forward HTTP Request from Web Page to Service Worker
    //
    document.addEventListener("http_request_bridge_request", function(e) {
        _HttpLog.Info('Forward Request \'' + e.detail.request.url + '\'. Tag \'' + e.detail.tag + '\'');

        chrome.runtime.sendMessage({
            message: 'http_request_bridge_request',
            content: e.detail
        },
        
    //
    // Forward HTTP Response from Service Worker to Web page
    //    
        response => {
            _HttpLog.Info('Forward Response \'' + e.detail.request.url + '\'. Tag \'' + e.detail.tag + '\'');

            var endScriptEvent = new CustomEvent("http_request_bridge_response", {
                detail: {
                    response: response.response,
                    tag: response.tag
                }
            });
            document.dispatchEvent(endScriptEvent);
        });
    });
}