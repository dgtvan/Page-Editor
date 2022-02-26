import * as NativeMessage from '../common/native-message.js';
import { ScriptStorage } from '../common/storage/script-storage.js';
import { Log } from '../common/log/es-log.js';
import * as Utility from '../common/utility.js';

const _log = new Log('SW-NativeMsg');
const _scriptStorage = new ScriptStorage();

export function Intialize() {

    NativeMessage.Initialize();

    NativeMessage.AddMessageListener("Ping", messageContent => {
        return 'Pong ' + messageContent;
    });

    NativeMessage.AddMessageListener("ExternalFileChange", msg => {

        // _log.Info('Handler Recv ExternalFileChange. ');
        // if (msg.action == 'modify') {
        //     _log.Info('Modify content \'' + Utility.Base64Decode(msg.oldFile.content) + '\'');
        // }

        switch (msg.action)
        {
            case 'add':
                _scriptStorage.Set(msg.newFile.path, Utility.Base64Decode(msg.newFile.content));
                break;

            case 'modify':
                _scriptStorage.Set(msg.oldFile.path, Utility.Base64Decode(msg.oldFile.content));
                break;

            case 'rename':
                _scriptStorage.Remove(msg.oldFile.path);
                _scriptStorage.Set(msg.newFile.path, Utility.Base64Decode(msg.newFile.content));
                break;

            case 'delete':
                _scriptStorage.Remove(msg.oldFile.path);
                break;

            default:
                _log.Error('Recv \'ExternalFileChange\' with actioin \'' + action + '\' which has not defined');
                break;
        }

        return true;
    });

    _log.Info('Initialization completed.');
}