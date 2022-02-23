const _log = new Log('ContentScript');

ServiceWaker();
TabInjectableCheck();

function ServiceWaker() {
    setInterval(() => {
        chrome.runtime.sendMessage({
            message: 'wakeup_service_worker'
        });
        _log.Info('Message wakeup_service_worker sent', true);        
    }, 1000);
}

function TabInjectableCheck() {
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.message === "content_script_injectable")
            {
                _log.Info('Message content_script_injectable recived');
                sendResponse(true);
            }
        }
    );
}

// document.body.addEventListener("bridgeRequest", function(e) {
//     var req = e.detail.req;
//     var tag = e.detail.tag;

//     chrome.extension.sendRequest(req, function(response) {
//         var event = new CustomEvent("bridgeResponse", {
//             detail: {
//                 res: response,
//                 // req: req,
//                 tag: tag
//             }
//         });

//         document.body.dispatchEvent(event);
//     });
// }, false);

function is_cross_origin_http_request_required(request) {
    if (request.todo === 'changeJS' && request.active === true) {
        if (request.code.includes("CrossOriginHttpRequest")) {
            return true;
        } else {
            return false;
        }
    }
}

function create_cross_origin_http_request_injection_request() {
    let request = {
        todo: "changeJS",
        code: cross_origin_http_request_implementation,
        filename: '_cross_origin_http_request_',
        active: true
    };

    return request;
}

function create_built_in_functions_injection_request() {
    let request = {
        todo: "changeJS",
        code: buit_in_functions_implementation,
        filename: '_buit_in_functions_',
        active: true
    };

    return request;
}

const cross_origin_http_request_implementation = `
(function( PM, $, undefined ) {
    PM.CrossOriginHttpRequest = (function() {
        var mediator = document.body;
        var ajaxDict = {};
        var getAvailableTag = function() {
            var tag = Math.floor(Math.random() * 100);
            if (!ajaxDict[tag]) {
                return tag;
            } else {
                return getAvailableTag();
            }
        }
        mediator.addEventListener("bridgeResponse", function(e) {
            var req = ajaxDict[e.detail.tag];
            ajaxDict[e.detail.tag] = false;
            var res = e.detail.res;
            if (res.isSucc) {
                if (res.redirectedURL)
                {
                    req.success && req.success(res.data, res.redirectedURL);
                }
                else
                {
                    req.success && req.success(res.data);
                }
            } else {
                req.error && req.error(res.xhr, res.type);
            }
        }, false);
        var AJAX = function(req) {
            req._tag = getAvailableTag();
            ajaxDict[req._tag] = req;
            var _req = {
                type: req.type ? req.type : 'GET',
                url: req.url,
                data: req.data ? req.data : {},
                timeout: req.timeout ? req.timeout : 5000,
                dataType: req.dataType ? req.dataType : 'json',
                testRedirection: req.testRedirection ? req.testRedirection : null
            };
            var event = new CustomEvent("bridgeRequest", {
                detail: {
                    req: _req,
                    tag: req._tag
                }
            });
            mediator.dispatchEvent(event);
        };
        return AJAX;
    })();
}( window.PM = window.PM || {}, jQuery ));`;

const buit_in_functions_implementation = `
// Reference https://stackoverflow.com/questions/881515/how-do-i-declare-a-namespace-in-javascript

(function( PM, $, undefined ) {
    PM.ActionElements = async function (selector, proc)
	{
		const elements = Array.from(document.querySelectorAll(selector));
			
        await Promise.all(elements.map(async (element) => {
            proc(element);
        }));
	}
	
	PM.RemoveElementsBySelector = async function (selector)
	{
        await PM.ActionElements(selector, function(e) {
            e.remove();
        });
	}

    PM.RemoveElementsBySelectors = async function (selectors)
	{
        await Promise.all(selectors.map(async (selector) => {
            PM.RemoveElementsBySelector(selector);
        }));
	}
	
	PM.StyleElementsBySelector = async function (selector, styles)
	{
		const styleApplier = async function(element) {
            await Promise.all(styles.map(async (style) => {
                if (style.modifier)
                {
                    element.style.setProperty(style.property, style.value, style.modifier);
                }
                else
                {
                    element.style.setProperty(style.property, style.value);
                }
            }));
		}
		
		if (isDOM(selector))
		{
			await styleApplier(selector);
		}
		else
		{
			await PM.ActionElements(selector, function(element) {
			    styleApplier(element);
			});
		}
	}

    function isDOM(selector)
	{
		return selector instanceof Element;
	}
}( window.PM = window.PM || {}, PM ));
`;