import { Log } from '../log/es-log.js';
import * as Utility from '../utility.js';
import * as GlobalConstant from '../global-constant.js';

import { Storage } from './_storage.js';

let singleInstance = null;

export class FileStorage extends Storage {
    constructor(partition) {
        if (singleInstance == null) {
            super('_FILE_' + partition);
            singleInstance = this;
        } else {
            // Initialize necessary stuff
        }
        return singleInstance;
    }

    Get(filePath) {
        return new Promise((resolve, reject) => {
            super.Get(filePath).then(result => {
                if (result == null) {
                    resolve(result);
                } else {
                    resolve(this.#Resolver(result));
                }
            });
        });
    }

    Set(filePath, fileContent) {
        return new Promise((resolve, reject) => {
            super.Set(filePath, fileContent).then(result => {
                resolve(this.#Resolver(result));
            });
        })
    }

    Remove(filePath) {
        return new Promise((resolve, reject) => {
            super.Remove(filePath).then(result => {
                resolve(this.#Resolver(result));
            })
        });
    }

    #Resolver(result) {
        return {
            path: result.key,
            content: result.value
        }
    }
}