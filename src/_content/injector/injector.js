const _injectorLog = new Log('ContentScript-Injector');


function ExecuteInjector() {
    // Does not work due to Content security policy.
    //Injection_V2();

    Injection_V1();
}

function Injection_V1()
{
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
    // Begin injection
    //
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL('src/_content/injector/web-page-context.js');
    // s.onload = function() {
    //     this.remove();
    // };
    (document.head || document.documentElement).appendChild(s);
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