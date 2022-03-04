var PGE=PGE || {};

PGE.HttpRequest = class {
    static #window = null;
    static #ajaxDict = {};

    static #GetAvailableTag = function(handler) {
        let self = PGE.HttpRequest;

        var tag = Math.floor(Math.random() * 100);
        if (!self.#ajaxDict.hasOwnProperty(tag)) {
            self.#ajaxDict[tag] = handler;
            return tag;
        } else {
            return self.#GetAvailableTag(handler);
        }
    }

    static Intialize = function(window) {
        let self = PGE.HttpRequest;

        self.#window = window;

        self.#window.addEventListener("http_request_bridge_response", function(e) {
            if (self.#ajaxDict.hasOwnProperty(e.detail.tag)) {
                var handler = self.#ajaxDict[e.detail.tag];
                handler?.(e.detail.response);
            }
        });
    }

    static Send = function(request) {
        let self = PGE.HttpRequest;

        return new Promise((resolve, reject) =>{
            let tag = self.#GetAvailableTag(resolve);

            console.log('Send request \'' + request.url + '\'. Tag \'' + tag + '\'');

            var event = new CustomEvent("http_request_bridge_request", {
                detail: {
                    request: request,
                    tag: tag
                }
            });
            self.#window.dispatchEvent(event);
        });
    }
}