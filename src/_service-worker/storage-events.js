import { ScriptStorage } from '../common/storage/script-storage.js';
import { Log } from '../common/log/es-log.js';

const _log = new Log('SW-ScriptStorage');
const _scriptStorage = new ScriptStorage();

export function Initialize() {

    _scriptStorage.DumpAllFileName((filePath, fileContent) => {
        _log.Info('Storage dump file name: ' + filePath);
    }, () => {
        //_log.Info('Storage dump begin');
    }, () => {
        //_log.Info('Storage dump end');
    });

    _scriptStorage.AddRemoveListener((filePath, fileContent) => {
        //_log.Info('');
    });

    _scriptStorage.AddSetListener((filePath, fileContent) => {
        
    });

    _log.Info('Initialization completed.');
}