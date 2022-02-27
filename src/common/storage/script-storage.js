import { Log } from '../log/es-log.js';
import * as Utility from '../utility.js';
import * as GlobalConstant from '../global-constant.js';

import { FileStorage } from './file-storage.js';

let singleInstance = null;

export class ScriptStorage extends FileStorage {
    constructor() {
        if (singleInstance == null) {
            super('_SCRIPT_');
            singleInstance = this;
        } else {
            // Initialize necessary stuff
        }
        return singleInstance;
    }

    Get(path) {
        return new Promise((resolve, reject) => {
            super.Get(path).then(result => {
                if (result == null) {
                    resolve(result);
                } else {
                    let details = [];

                    result.forEach(file => {
                        details.push(this.#ParseFileDetail(file.path, file.content))
                    });

                    resolve(details);
                }
            });
        })
    }

    AddEventListener(event, handler) {
        let self = this;

        let generalEventHandler = function(e) {

            if (event == 'rename') {
                handler(e);
            } else {
                let detail = self.#ParseFileDetail(e.path, e.content);
                handler({
                    path: e.path,
                    detail: detail
                });
            }
        }

        super.AddEventListener(event, generalEventHandler);
    }

    #ParseFileDetail(filePath, fileContentRaw) {
        //let fileContent = Utility.Base64Decode(fileContentRaw);
        let fileContent = fileContentRaw;

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
        let config = this.#ExtractConfig(fileContent);
        fileDetail.config = Utility.Extend(true, fileDetail.config, config); 

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