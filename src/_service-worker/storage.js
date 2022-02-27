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
    _scriptStorage.AddSetListener((filePath, fileContent) => {
        //_log.Info('Add. Path \'' + filePath + '\'. Content \'' + fileContent + '\'');
    });

    _scriptStorage.AddRemoveListener((filePath, fileContent) => {
        //_log.Info('Remove. Path \'' + filePath + '\'. Content \'' + fileContent + '\'');
        //_log.Info('Remove. Path \'' + filePath + '\'');
    });
}