import { Log } from '../common/log/es-log.js';

const _log = new Log('SW-HttpRequest');

export function Initialize() {
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.message === "http_request_bridge_request")
            {
                var httpRequest = request.content;

                _log.Info('Recv request \'' + httpRequest.request.url + '\'. Tag \'' + httpRequest.tag + '\'');
                
                HttpRequest(httpRequest.request).then(response => {

                    _log.Info('Send response \'' + httpRequest.request.url + '\'. Tag \'' + httpRequest.tag + '\'');

                    chrome.tabs.sendMessage(sender.tab.id, {
                        message: 'http_request_bridge_response',
                        content: {
                            response: response,
                            tag: httpRequest.tag
                        }
                    });
                });
            }
        }
    );
}

function HttpRequest(config) {

    if (!config.hasOwnProperty('credentials')) {
        config['credentials'] = 'omit';
    }

    let responseObj = {
        originUrl: '',
        url: '',
        responseText: '',
        statusCode: null
    }

    responseObj['originUrl'] = config.url;

    return new Promise((resolve, reject) => {
        fetch(config.url, config)
        .then(response => {
            responseObj['url'] = response.url;
            responseObj['statusCode'] = response.status;
            return response.text();
        })
        .then(data => {
            responseObj['responseText'] = data;
            resolve(responseObj);
        });
    });
}