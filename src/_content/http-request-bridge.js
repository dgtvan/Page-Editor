const _HttpLog = new Log('ContentScript-HttpLog');

// TODO: Create a config file
const _whiteRoutes = [
    {
        'http://gamevn.com/' : [
            "https://raw.githubusercontent.com/VanDng/",
            "https://www.facebook.com/",
            "https://facebook.com/",
            "https://fb.watch/",
            "https://www.fb.watch/",
            "https://m.facebook.com/",
            "https://www.tiktok.com/",
            "https://vt.tiktok.com/",
            "https://vm.tiktok.com/"
        ]
    }
]

function InitializeHttpRequestBridge() {
    //
    // Forward HTTP Request from Web Page to Service Worker
    //
    document.addEventListener("http_request_bridge_request", function(e) {
        let request = e.detail;

        if (IsRouteAllowed(request.request.url)) {
            ForwardRequest(request);
        } else {
            _HttpLog.Error('Request to \'' + request.request.url + '\'. Tag \'' + request.tag + '\' is blocked');
            RespondEmpty(request);
        }
    });

    //
    // Forward HTTP Response from Service Worker to Web page
    //
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.message === "http_request_bridge_response")
            {
                let response = request.content;

                if (IsRouteAllowed(response.response.url)) {
                    ForwardResponse(request.content);
                } else {
                    _HttpLog.Error('Response from \'' + response.response.url + '\'. Tag \'' + response.tag + '\' is blocked');
                    RespondEmpty(response);
                }
            }
        }
    );
}

function ForwardRequest(request) {
    _HttpLog.Info('Forward Request \'' + request.request.url + '\'. Tag \'' + request.tag + '\'');

    chrome.runtime.sendMessage({
        message: 'http_request_bridge_request',
        content: request
    });
}

function ForwardResponse(response) {
    _HttpLog.Info('Forward Response \'' + response.response.url + '\'. Tag \'' + response.tag + '\'');

    var endScriptEvent = new CustomEvent("http_request_bridge_response", {
        detail: {
            response: response.response,
            tag: response.tag
        }
    });
    document.dispatchEvent(endScriptEvent);
}

function RespondEmpty(e) {
    let emptyResponse = {};

    if (e.hasOwnProperty('request')) {
        emptyResponse = {
            originUrl: e.request.url,
            url: e.request.url,
            responseText: '',
            blocked: true
        }
    } else {
        emptyResponse = e.response;
        emptyResponse.responseText = '';
        emptyResponse.blocked = true;
    }

    var endScriptEvent = new CustomEvent("http_request_bridge_response", {
        detail: {
            response: emptyResponse,
            tag: e.tag
        }
    });
    document.dispatchEvent(endScriptEvent);
}

function IsRouteAllowed(destination) {
    let _from = window.location.href;
    let _to = destination;

    let isAllow = false;

    _whiteRoutes.forEach(rule => {
        Object.keys(rule).forEach(from => {

            if (_from.startsWith(from)) {
    
                rule[from].forEach(to => {
    
                    if (_to.startsWith(to)) {
                        isAllow = true;
                    }
    
                });
    
            } 
    
        });
    });

    return isAllow;
}