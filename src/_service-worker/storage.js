import { Storage } from '../common/storage/_storage.js';
import { ScriptStorage } from '../common/storage/script-storage.js';
import { Log } from '../common/log/es-log.js';
import * as Utility from '../common/utility.js';

const _log = new Log('SW-ScriptStorage');

const _storage = new Storage();
const _scriptStorage = new ScriptStorage();

export function Initialize() {
    storage();
    scriptStorage();
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

function scriptStorage() {
    let onScriptChange = function(e) {
        chrome.tabs.query({ active: true}, tabs => {
            let isMatch = false;
            let activeUrls = [];

            tabs.forEach(tab => {
                activeUrls.push(tab.url);

                if (e.detail.config.urls.includes('all')) {
                    _log.Info('Script change. Reload tab \'' + tab.id + '\'');
                    chrome.tabs.reload(tab.id);
                    isMatch = true;
                } else {
                    if (Utility.URLMatch(e.detail.config.urls, tab.url)) {
                        _log.Info('Script change. Reload tab \'' + tab.id + '\'');
                        chrome.tabs.reload(tab.id);
                        isMatch = true;
                    }
                }
            });

            if (!isMatch) {
                _log.Info('Script change. The active tab\' url does not match the script\'s url. Active tab urls \'' +  activeUrls.join() + '\'. Script urls \'' + e.detail.config.urls.join() + '\'');
            }
        });
    };

    _scriptStorage.AddEventListener('add', (e) => {
        //_log.Info('Add. Path \'' + e.path + '\'. Content \'' + JSON.stringify(e.detail) + '\'');
        onScriptChange(e);
    });

    _scriptStorage.AddEventListener('modify', (e) => {
        //_log.Info('Modify. Path \'' + e.path + '\'. Content \'' + JSON.stringify(e.detail) + '\'');
        onScriptChange(e);
    });

    _scriptStorage.AddEventListener('delete', (e) => {
        //_log.Info('Delete. Path \'' + e.path + '\'. Content \'' + JSON.stringify(e.detail) + '\'');
        onScriptChange(e);
    });

    _scriptStorage.AddEventListener('rename', (e) => {
        //_log.Info('Rename. Old path \'' + e.oldPath + '\'. New path \'' + e.newPath + '\'');
        onScriptChange(e);
    });
}