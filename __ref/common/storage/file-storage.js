import { Log } from '../log/es-log.js';
import * as Utility from '../utility.js';
import * as GlobalConstant from '../global-constant.js';

import { Storage } from './_storage.js';

let singleInstance = null;

export class FileStorage extends Storage {
    #_addEventListeners = [];
    #_modifyEventListeners = [];
    #_deleteEventListeners = [];
    #_renameEventListeners = [];

    constructor(partition) {
        if (singleInstance == null) {
            super('_FILE_' + partition);
            singleInstance = this;
        } else {
            // Initialize necessary stuff
        }
        return singleInstance;
    }

    Contain(path) {
        return new Promise((resolve, reject) => {
            super.Get(path).then(result => {
                if (result == null) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    Add(path, content) {
        let self = this;
        return new Promise((resolve, reject) => {
            super.Set(path, content).then(result => {
                let ret = self.#Resolver(result);

                self.#_addEventListeners.forEach(async (handler) => {
                    handler?.(ret);
                });

                resolve(ret);
            });
        });
    }

    Modify(path, content) {
        let self = this;
        return new Promise((resolve, reject) => {
            super.Remove(path).then(() => {
                super.Set(path, content).then(result => {
                    let ret = self.#Resolver(result);

                    self.#_modifyEventListeners.forEach(async (handler) => {
                        handler?.(ret);
                    });

                    resolve(ret);
                });
            });
        });
    }

    Delete(path) {
        let self = this;
        return new Promise((resolve, reject) => {
            super.Remove(path).then(result =>{

                if (result == null) {
                    resolve(result);
                } else if (Array.isArray(result)) {
                    let files = [];

                    result.forEach(pair => {
                        let file = self.#Resolver(pair);
                        files.push(file);

                        self.#_deleteEventListeners.forEach(async (handler) => {
                            handler?.(file);
                        });
                    });

                    resolve(files);
                } else {
                    let ret = self.#Resolver(result);

                    self.#_deleteEventListeners.forEach(async (handler) => {
                        handler?.(ret);
                    });
    
                    resolve(ret);
                }

            });
        })
    }

    Rename(oldPath, newPath) {
        let self = this;
        return new Promise((resolve, reject) => {
            super.Remove(oldPath).then(result =>{
                super.Set(newPath, result.value).then(result => {
                    let ret = {
                        oldPath: oldPath,
                        newPath: newPath
                    }

                    self.#_renameEventListeners.forEach(async (handler) => {
                        handler?.(ret);
                    });

                    resolve(ret);
                });
            });
        });
    }

    Get(path) {
        return new Promise((resolve, reject) => {
            super.Get(path).then(result => {
                if (result == null) {
                    resolve(result);
                } else {
                    let files = [];

                    result.forEach(pair => {
                        files.push(this.#Resolver(pair))
                    });

                    resolve(files);
                }
            });
        });
    }

    AddEventListener(event, handler) {
        switch(event) {
            case 'add':
                this.#_addEventListeners.push(handler);
                break;

            case 'modify':
                this.#_modifyEventListeners.push(handler);
                break;

            case 'delete':
                this.#_deleteEventListeners.push(handler);
                break;

            case 'rename':
                this.#_renameEventListeners.push(handler);
                break;
        }
    }

    #Resolver(result) {
        return {
            path: result.key,
            content: result.value
        }
    }

    /**
     * @deprecated No support
     */
    Set(path, content) {
        throw 'No support';
    }

    /**
     * @deprecated No support
     */
    Remove(path) {
        throw 'No support';
    }

    /**
     * @deprecated No support
     */
    AddSetListener(handler) {
        throw 'No support';
    }

    /**
     * @deprecated No support
     */
    AddRemoveListener(handler) {
        throw 'No support';
    }
}