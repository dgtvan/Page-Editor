import { Log } from '../log/es-log.js';
import * as Utility from '../utility.js';
import * as GlobalConstant from '../global-constant.js';

import { Storage } from './_storage.js';

let singleInstance = null;

export class ScriptStorage extends Storage {
    constructor() {
        if (singleInstance == null) {
            super('__PGE_Script__');
            singleInstance = this;
        } else {
            // Initialize necessary stuff
        }
        return singleInstance;
    }

    Get(filePath, callback) {
        super.Get(filePath, callback);
    }

    GetEx(filePath, callback) {
        super.Get(filePath, (filePath, fileContent) => {
            callback?.(this.#ParseFileDetail(filePath, fileContent));
        })
    }

    Set(filePath, fileContent, callback) {
        super.Set(filePath, fileContent, callback);
    }

    Remove(filePath, callback) {
        super.Remove(filePath, callback);
    }

    AddSetListener(handler) {
        super.AddSetListener(handler);
    }

    AddSRemoveListener(handler) {
        super.AddRemoveListener(handler);
    }

    #ParseFileDetail(filePath, fileContentRaw) {
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
        fileDetail.config = this.#ExtractConfig(fileContent);

        return fileDetail;
    }

    #ExtractConfig(fileContent) {
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
}