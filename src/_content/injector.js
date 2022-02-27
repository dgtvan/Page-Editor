function ExecuteInjector() {
    const _log = new Log('ContentScript-Injector');

    _log.Info('Start injector');

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
        _log.Info("Send content_script_fetches_all_scripts");

        chrome.runtime.sendMessage({
            message: 'content_script_fetches_all_scripts',
            content: {
                url: window.location.href
            }
        }, function (response) {
            _log.Info("Recv content_script_fetches_all_scripts");

            resolve(response);
        });
    });
}