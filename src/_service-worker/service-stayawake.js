import { Log } from '../common/log/es-log.js';

const _log = new Log('SW-Awake');

export function Intialize() {

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.message === "wakeup_service_worker")
            {
                let tab = sender.tab;
                
                // _log.Info('Message wakeup_service_worker received from tab id \'' + tab.id + '\', ' +
                //              'url \'' + tab.url + '\', ' +
                //              'pending url \'' + tab.pendingUrl + '\'');
                _log.Info('Message wakeup_service_worker received from tab id \'' + tab.id + '\'', true);

                // chrome.storage.local.get(StorageKeyLastWakeupTime, function (data) {
                //      if (data.key == null || data.key == 'undefined') {
                //         let currentTime = new Date();
                //         chrome.storage.local.set({ LastWakeupTime: currentTime }).then(() => {
                //             _log.Info('Set last wakeup time \'' + currentTime.toLocaleTimeString() + '\'');
                //         })
                //     } else {
                //         let lastWakeupTime = new Date(data.key);
                //          _log.Info('Rtr last wakeup time \'' + lastWakeupTime.toLocaleTimeString() + '\'');
                //     }
                // })
            }
            return true;
        }
    );

    chrome.tabs.onRemoved.addListener(function(tabId, info) {
        _log.Info('Tab closed. Tab id \'' + tabId + '\', Window Id \'' + info.windowId + '\'');

        CheckInjectableTabs();
    });

    chrome.tabs.onCreated.addListener(tab => {
        // Do not need to do anything here!
        // The event helps to wake up the service worker at the browser start up.
    });

    CheckInjectableTabs();

    _log.Info('Initialization completed.');
}

function CheckInjectableTabs() {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
        let promises = [];

        _log.Info('Remaining tab count ' + tabs.length);

        tabs.forEach(tab => {
            let promise = new Promise((resolve, reject) => {
                _log.Info('Send content_script_injectable to tab \'' + tab.id + '\'');

                chrome.tabs.sendMessage(tab.id, {
                    message: 'content_script_injectable'
                }, function (response) {
                    let isInjecteable = false;
                    if (String(response) === "undefined") {
                    } else {

                        isInjecteable = response
                    }
                    _log.Info('Resp content_script_injectable from tab ' + tab.id + '. Response: ' + isInjecteable);
                    resolve(isInjecteable);
                });
            });
            promises.push(promise);
        });

        Promise.allSettled(promises).then((results) => {
            let isInjectable = false;

            results.every(result => {
                if (result.status === 'fulfilled') {
                    if (result.value != null && result.value != 'undefined' && result.value === true) {
                        isInjectable = true;
                        return false; // stop the loop
                    }
                }
                return true; // continue the loop
            });

            if (isInjectable == false && tabs.length >= 1) {
                _log.Info('No injectable tabs');

                chrome.tabs.create({
                    active: false,
                    url: 'https://www.google.com/'
                }, function(tab) {
                    _log.Info('New injectable tab created. Tab id \'' + tab.id + '\'');
                });
            }
        });
    });
}