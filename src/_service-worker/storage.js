import { Storage } from '../common/storage/_storage.js';
import { ScriptStorage } from '../common/storage/script-storage.js';
import { Log } from '../common/log/es-log.js';

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
        _log.Info('Storage dump key: ' + result.key);
    });
}

function scriptStorage() {
    _scriptStorage.AddRemoveListener((filePath, fileContent) => {
        //_log.Info('');
    });

    _scriptStorage.AddSetListener((filePath, fileContent) => {
        
    });
}