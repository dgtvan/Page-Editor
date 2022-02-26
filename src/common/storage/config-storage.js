import { Log } from '../log/es-log.js';
import * as Utility from '../utility.js';
import * as GlobalConstant from '../global-constant.js';

import { FileStorage } from './file-storage.js';

let singleInstance = null;

export class ConfigStorage extends FileStorage {
    constructor() {
        if (singleInstance == null) {
            super('_CONFIG_');
            singleInstance = this;
        } else {
            // Initialize necessary stuff
        }
        return singleInstance;
    }
}