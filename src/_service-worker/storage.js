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
        if (result == null || result == 'undefined' || result.key == null || result.key == 'undefined') {
            // Nothing
        } else {
            _log.Info('Storage dump key: ' + result.key);
        }
    });
}

function scriptStorage() {
    _scriptStorage.AddSetListener((filePath, fileContent) => {
        _log.Info('Add. Path \'' + filePath + '\'. Content \'' + Utility.Base64Decode(fileContent) + '\'');
        //_log.Info('Add. Path \'' + filePath + '\'. Content \'' + JSON.stringify(fileContent) + '\'');
    });

    _scriptStorage.AddRemoveListener((filePath, fileContent) => {
        //_log.Info('Remove. Path \'' + filePath + '\'. Content \'' + Utility.Base64Decode(fileContent) + '\'');
    });
}