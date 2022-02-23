import * as FileStorage from '../common/storage/file-storage.js';
import { Log } from '../common/log/es-log.js';

const _log = new Log('SW-FileStorage');

export function Initialize() {

    FileStorage.DumpAllFileName((filePath, fileContent) => {
        _log.Info('Storage dump file name: ' + filePath);
    }, () => {
        //_log.Info('Storage dump begin');
    }, () => {
        //_log.Info('Storage dump end');
    });

    FileStorage.AddRemoveListener((filePath, fileContent) => {
        //_log.Info('');
    });

    FileStorage.AddSetListener((filePath, fileContent) => {
        
    });

    _log.Info('Initialization completed.');
}