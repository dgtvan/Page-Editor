try
{
    InterceptXHRResponse('?pge=', 'Alright. Page editor intercepted!');

    function InterceptXHRResponse(urlPattern, response){
        //https://stackoverflow.com/questions/16959359/intercept-xmlhttprequest-and-modify-responsetext
        var rawOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            if (!this._hooked) {
                this._hooked = true;
                setupHook(this);
            }

            let url = arguments[1];
            console.log('XHR-URL ' + url);

            if (url.includes(urlPattern)) {
                console.log('Try to intercep');
                this.responseText = response;
                console.log('new reponse \'' + this.responseText + '\'');
            }

            rawOpen.apply(this, arguments);
        }

        function setupHook(xhr) {
            function getter() {
                //console.log('get responseText');

                
                //var ret = xhr.responseText;
                //setup();
                //return ret;
            }

            function setter(str) {
                console.log('set responseText: %s', str);
            }

            function setup() {
                //console.log('Setup begin');
                delete xhr.responseText;

                Object.defineProperty(xhr, 'responseText', {
                    //get: getter,
                    //set: setter,
                    //configurable: true
                    writable: true
                });
                //console.log('Setup end');
            }
            setup();
        }
    }

}
catch (e)
{
    console.error('XHR-PATCHING: ' + e);
}

try
{
    if (typeof(jQuery) !== 'undefined')
    {
        jQuery.ajaxSuccess(function(event, xhr, ajaxOptions) {
            /* Method        */ ajaxOptions.type
            /* URL           */ ajaxOptions.url
            /* Response body */ xhr.responseText
            /* Request body  */ ajaxOptions.data
            //console.log('JQUERY-PATCHING: ' + this._url + '. Response: ' + this.responseText);
        });
    }
}
catch(e)
{
    console.error('JQUERY-PATCHING: ' + e);
}

