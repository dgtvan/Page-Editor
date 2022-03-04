import { Storage } from '../common/storage/_storage.js';
import { ScriptStorage } from '../common/storage/script-storage.js';
import { Log } from '../common/log/es-log.js';
import * as Utility from '../common/utility.js';

const _log = new Log('SW-ScriptStorage');

const _storage = new Storage();
const _scriptStorage = new ScriptStorage();

export function Initialize() {
    storage();
    scriptStorageChangeListener();
    scriptStorageBridger();
    _log.Info('Initialization completed.');
}

function storage() {
    _storage.Get(null).then((result) => {
        if (result == null || result == 'undefined') {
            // Nothing
        } else {
            result.forEach(pair => {
                _log.Info('Storage dump key: ' + pair.key);
            });
        }
    });
}

function scriptStorageChangeListener() {
    let onScriptChange = function(e) {
        chrome.tabs.query({ active: true}, tabs => {
            let activeUrls = [];
            let matchedTabs = [];

            tabs.forEach(tab => {
                activeUrls.push(tab.url);

                if (MatchUrl(e.config.urls, tab.url)) {
                    matchedTabs.push(tab);
                }
            });

            if (matchedTabs.length > 0) {
                matchedTabs.forEach(async (tab) => {
                    chrome.tabs.reload(tab.id);
                });
            } else {
                _log.Info('Script change \'' + e.path + '\'. The active tab\' url does not match the script\'s url. Active tab urls \'' +  activeUrls.join() + '\'. Script urls \'' + e.config.urls.join() + '\'');
            }
        });
    };

    _scriptStorage.AddEventListener('add', (e) => {
        //_log.Info('Add. Path \'' + e.path + '\'. Content \'' + JSON.stringify(e.detail) + '\'');
        DumpEvent('add', e);
        onScriptChange(e);
    });

    _scriptStorage.AddEventListener('modify', (e) => {
        //_log.Info('Modify. Path \'' + e.path + '\'. Content \'' + JSON.stringify(e.detail) + '\'');
        DumpEvent('modify', e);
        onScriptChange(e);
    });

    _scriptStorage.AddEventListener('delete', (e) => {
        //_log.Info('Delete. Path \'' + e.path + '\'. Content \'' + JSON.stringify(e.detail) + '\'');
        DumpEvent('delete', e);
        // It seems to be redundant to take any action on deletion events.
        //onScriptChange(e); 
    });

    _scriptStorage.AddEventListener('rename', (e) => {
        //_log.Info('Rename. Old path \'' + e.oldPath + '\'. New path \'' + e.newPath + '\'');
        DumpEvent('rename', e);
        onScriptChange(e);
    });
}

function scriptStorageBridger() {
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.message === "content_script_fetches_all_scripts") {
                _log.Info('Recv content_script_fetches_all_scripts');

                let matchFiles = [];
                let targetUrl = request.content.url;

                _scriptStorage.Get(null).then(files => {
                    if (files == null) {
                        _log.Info('No script available');
                    } else {
                        files.forEach(file => {
                            if (MatchUrl(file.config.urls, targetUrl)) {
                                _log.Info('Match script \'' + file.path + '\'');
                                matchFiles.push(file);
                            }
                        });
                    }

                    sendResponse(matchFiles);
                });
            }
        }
    );
}

function MatchUrl(scriptUrls, targetUrl) {
    return scriptUrls.includes('all') || Utility.URLMatch(scriptUrls, targetUrl)
}

function DumpEvent(action, e) {
    if (action == 'rename') {
        _log.Info('Action: ' + action + '. Old path \'' + e.oldPath + '\'. New path \'' + e.newPath + '\'');
    } else {
        _log.Info('Action: ' + action + '. Path \'' + e.path + '\'');
    }
}