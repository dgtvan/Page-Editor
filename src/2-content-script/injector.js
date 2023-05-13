const _injectorLog = new Log('ContentScript-Injector');


function InitializeInjector() {
    // Does not work due to Content security policy.
    //Injection_V2();

    Injection_V1();
}

function Injection_V1()
{
    const loadScript = function(url) {
        return new Promise((resolve, reject) => {
            let scriptTag = document.createElement('script');
            scriptTag.onload = function() {
                resolve();
            }
            scriptTag.src = chrome.runtime.getURL(url);
            (document.head || document.documentElement).appendChild(scriptTag);
        });
    }

    //
    // Initialize handler handling events from Web Page
    //
    document.addEventListener("get_pge_scripts", function(e) {
        _injectorLog.Info('Receive query scripts from Web Page');

        GetScriptFiles().then(files => {
            if (files == null) {
                _injectorLog.Info('No script available');
            } else {
                _injectorLog.Info('Matched ' + files.length + ' scripts');
                _injectorLog.Info('Send scripts to Web Page');
                var endScriptEvent = new CustomEvent("send_pge_scripts", {
                    detail: {
                        scripts: files
                    }
                });
                document.dispatchEvent(endScriptEvent);
            }
        });
    });

    //
    // Inject scripts to Web Page
    //
    
    // The order is important!
    // let scripts = [
    //     ,
    //     ,
    //     ,
    //     ,
    // ]

    // let pgeNamespace = document.createElement('script');
    // pgeNamespace.onload = function() {

    //     scripts.forEach(script => {
    //         let scriptTag = document.createElement('script');
    //         scriptTag.src = chrome.runtime.getURL(script);
    //         (document.head || document.documentElement).appendChild(scriptTag);
    //     });

    // };
    // pgeNamespace.src = chrome.runtime.getURL('src/_content/web-resources/_pge-namespace.js');
    // (document.head || document.documentElement).appendChild(pgeNamespace);

    loadScript('src/_content/web-resources/_pge-namespace.js')
    .then(() => {
        return Promise.allSettled([
            loadScript('src/_content/web-resources/dom-element.js'),

            loadScript('src/_content/web-resources/http-request.js')
            .then(() => {
                return loadScript('src/_content/web-resources/rotatable-video-control.js');
            })
        ]);
    }).then(() => {
        loadScript('src/_content/web-resources/pge-scripts-loader.js');
    });
}

function Injection_V2()
{
    document.addEventListener('DOMContentLoaded', (event) => {
        _log.Info('DOMContentLoaded');

        GetScriptFiles().then(files => {
            if (files == null) {
                _log.Info('No script available');
            } else {

                files.forEach(file => {
                    _log.Info('Match script \'' + file.path + '\'');

                    let scriptTag = document.createElement('script');
                    scriptTag.type = 'text/javascript';
                    scriptTag.async = true;
                    // scriptTag.innerHTML = file.content;
                    scriptTag.src = 'http://localhost:8000/script'

                    document.head.appendChild(scriptTag);
                });
            }
        });
    })
}

function GetScriptFiles() {
    return new Promise((resolve, reject) => {
        _log.Info("Send query scripts to Service worker");

        chrome.runtime.sendMessage({
            message: 'content_script_fetches_all_scripts',
            content: {
                url: window.location.href
            }
        }, function (response) {
            _log.Info("Receive scripts from Service worker");
            resolve(response);
        });
    });
}