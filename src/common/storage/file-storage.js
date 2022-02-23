import { Log } from '../log/es-log.js';
import * as Utility from '../utility.js';
import * as GlobalConstant from '../global-constant.js';

const _log = new Log('FileStorage');

const _setEventHandlers = [];
const _removeEventHandlers = [];

/********************************************************************************
 * 
 *  PUBLIC METHOD
 * 
 ********************************************************************************/

export function DumpAllFileName(dataCallback, beginCallback, endCallback) {
    chrome.storage.local.get(null, function(data) {
        beginCallback?.();

        for (const [key, value] of Object.entries(data)) {
            dataCallback?.(key, value);
        }

        endCallback?.();
    });
}

export function Get(filePath, callback) {
    chrome.storage.local.get(filePath, function(data) {
        for (const [key, value] of Object.entries(data)) {
            callback?.(key, value);
        }
    });
}

export function GetEx(filePath, callback) {
    Get(filePath, (filePath, fileContent) => {
        callback?.(ParseFileDetail(filePath, fileContent));
    })
}

export function Set(filePath, fileContent, callback) {
    let storageItem = {};
    storageItem[filePath] = fileContent;

    chrome.storage.local.set(storageItem, function() {
        callback?.();

        _setEventHandlers.forEach(handler => {
            handler?.(filePath, fileContent);
        })
    });
}

export function Remove(filePath, callback) {
    Get(filePath, (key, value) => {
        chrome.storage.local.remove(key, function() {
            callback?.(key, value);

            _removeEventHandlers.forEach(handler => {
                handler?.(key, value);
            })
        });
    })
}

export function RemoveAll(callback) {
    Remove(null, callback);
}

export function AddSetListener(handler) {
    _setEventHandlers.push(handler);
}

export function AddRemoveListener(handler) {
    _removeEventHandlers.push(handler);
}

/********************************************************************************
 * 
 *  PRIVATE METHOD
 * 
 ********************************************************************************/

function ParseFileDetail(filePath, fileContentRaw) {
    let fileContent = Utility.Base64Decode(fileContentRaw);

    /*
    Never redefine the file content detail structure anywhere else!
    It's easy to forget when an update happens.
    */
    let fileDetail = {
        path: '',
        name: '',
        extension: '',
        content: '',
        config: {
            urls: [],
            enable: "false",
            refreshOnChange: "false",
        }
    }

    //
    // Path
    //
    fileDetail.path = filePath;

    //
    // Name
    //
    let fwSlashIdx = filePath.lastIndexOf('/');
    let dotIdx = filePath.lastIndexOf('.');
    fileDetail.name = filePath.substring(fwSlashIdx + 1, dotIdx);

    //
    // Extension
    //
    fileDetail.extension = filePath.substring(dotIdx);

    //
    // Content
    //
    // The file's content is always base 64 encoded before storing in the storage.
    // However, here the file content is decoded.
    fileDetail.content = fileContent;

    //
    // Config
    //
    fileDetail.config = ExtractConfig(fileContent);

    return fileDetail;
}

function ExtractConfig(fileContent) {
    let config = {}
    let enteredConfigSection = false;

    let _configBeg = GlobalConstant.ConfigSectionBeginText;
    let _configEnd = GlobalConstant.ConfigSectionBeginText;
    let _configDelimiter = GlobalConstant.ConfigDelimiter;

    let ParseConfig = function(config, line, configName) {
        let configName_ = configName + _configDelimiter;
        if (line.startsWith(configName_) && (line.length > configName_.length))
        {
            config[configName] = line.substring(configName_.length).trim();
        }
    }
    
    let lines = fileContent.split(/\r?\n/);
    lines.every(line => {
        line = line.trim();
        
        if (line === _configBeg){
            enteredConfigSection = true;
            return true;
        }

        if (line === _configEnd) {
            enteredConfigSection = false;
            return false;
        }

        if  (enteredConfigSection) {
            let configValue;

            let urls_ = "urls" + _configDelimiter;
            if (line.startsWith(urls_) && line.length > urls_.length)
            {   
                configValue = line.substring(urls_.length);

                let configUrls = [];
                let urls = configValue.split(';');
                urls.every(url => {
                    url = url.trim();

                    if (url === 'all')
                    {
                        configUrls = [ 'all' ];
                        return false;
                    }
                    else
                    {
                        configUrls.push(url);
                    }

                    return true;
                });

                config.urls = configUrls;
            }

            ParseConfig(config, line, "enable");
            ParseConfig(config, line, "refreshOnChange");
        }

        return true;
    });

    return config;
}

// function RemoveConfigData(fileContent) {
//     let lines = fileContent.split(/\r?\n/);

//     let newfileContent = [];

//     lines.forEach(line => {

//         let trimedLine = line.trim();

//         if (trimedLine.trim === _configBeg){
//             enteredConfigSection = true;
//             continue;
//         }

//         if (trimedLine === _configEnd) {
//             enteredConfigSection = false;
//             continue;
//         }

//         if (enteredConfigSection == false)
//         {
//             newfileContent.push(line);
//         }
//     });

//     return newfileContent.join(System.lineSeparator());
// }