function InitializeServiceWaker() {
    const _log = new Log('ContentScript-SWStayAwake');

    setInterval(() => {
        chrome.runtime.sendMessage({
            message: 'wakeup_service_worker'
        });
        _log.Info('Message wakeup_service_worker sent', true);        
    }, 250);

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