import * as NativeMessage from '../common/native-message.js';
import { ScriptStorage } from '../common/storage/script-storage.js';
import { Log } from '../common/log/es-log.js';

const _log = new Log('SW-NativeMsg');
const _scriptStorage = new ScriptStorage();

export function Intialize() {

    NativeMessage.Initialize();

    NativeMessage.AddMessageListener("Ping", messageContent => {
        return 'Pong ' + messageContent;
    });

    NativeMessage.AddMessageListener("ExternalFileChange", messageContent => {
        let action = messageContent.action;
        let oldFile = messageContent.oldFile;
        let newFile = messageContent.newFile;

        switch (action)
        {
            case 'add':
            case 'modify':
                _scriptStorage.Set(newFile.filePath, newFile.fileContent);
                break;

            case 'rename':
                _scriptStorage.Remove(oldFile.filePath);
                _scriptStorage.Set(newFile.filePath, newFile.fileContent);
                break;

            case 'delete':
                _scriptStorage.Remove(oldFile.filePath);
                break;

            default:
                _log.Error('Recv \'ExternalFileChange\' with actioin \'' + action + '\' which has not defined');
                break;
        }
    });

    _log.Info('Initialization completed.');
}