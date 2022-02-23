import * as NativeMessage from '../common/native-message.js';
import * as Storage from '../common/file-storage.js';
import { Log } from '../common/log/es-log.js';

const _log = new Log('SW-NativeMsg');

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
                Storage.Set(newFile.filePath, newFile.fileContent);
                break;

            case 'rename':
                Storage.Remove(oldFile.filePath);
                Storage.Set(newFile.filePath, newFile.fileContent);
                break;

            case 'delete':
                Storage.Remove(oldFile.filePath);
                break;

            default:
                _log.Error('Recv \'ExternalFileChange\' with actioin \'' + action + '\' which has not defined');
                break;
        }
    });

    _log.Info('Initialization completed.');
}