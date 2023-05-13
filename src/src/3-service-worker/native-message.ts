import * as NativeMessage from '../common/native-message.js';
import { ScriptStorage } from '../common/storage/script-storage.js';
import { Log } from '../common/log/es-log.js';
import * as Utility from '../common/utility.js';

const _log = new Log('SW-NativeMsg');
const _scriptStorage = new ScriptStorage();

export function Intialize() {

    NativeMessage.Initialize();

    NativeMessage.AddMessageListener("ExternalFileChange", (msg, responseCallback) => {

        // _log.Info('Handler Recv ExternalFileChange. ');
        // if (msg.action == 'modify') {
        //     _log.Info('Modify content \'' + Utility.Base64Decode(msg.oldFile.content) + '\'');
        // }

        switch (msg.action)
        {
            case 'add':
                _scriptStorage.Add(msg.newFile.path, Utility.Base64Decode(msg.newFile.content));
                break;

            case 'modify':
                _scriptStorage.Contain(msg.oldFile.path).then(exist => {
                    if (exist) {
                        _scriptStorage.Modify(msg.oldFile.path, Utility.Base64Decode(msg.oldFile.content));
                    } else {
                        _scriptStorage.Add(msg.oldFile.path, Utility.Base64Decode(msg.oldFile.content));
                    }
                });
                break;

            case 'rename':
                _scriptStorage.Rename(msg.oldFile.path, msg.newFile.path);
                break;

            case 'delete':
                _scriptStorage.Delete(msg.oldFile.path);
                break;

            default:
                _log.Error('Recv \'ExternalFileChange\' with actioin \'' + action + '\' which has not defined');
                break;
        }

        responseCallback(true);
    });

    NativeMessage.AddMessageListener('SynchronizeFile', (files, responseCallback) => {
        _log.Info('Recv SynchronizeFile from PageEditor-VSCode')

        _scriptStorage.Delete(null).then(() => {
            return Promise.resolve();
        }).then(() =>{
            if (files.length == 0) {
                return Promise.resolve();
            } else {
                return Promise.allSettled(files.map(file => {
                    return _scriptStorage.Add(file.path, Utility.Base64Decode(file.content));
                }));
            }
        }).then(() => {
            responseCallback(true);
            return Promise.resolve();
        }).then(() => {
            _log.Info('Synchronization completed');
        });
    });
    _log.Info('Initialization completed.');
}