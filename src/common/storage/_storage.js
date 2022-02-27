import { Log } from '../log/es-log.js';

const _log = new Log('Storage');

export class Storage {
    #_setEventHandlers = [];
    #_removeEventHandler = [];
    #_partition = '';

    constructor(parition = '') {
        this.#_partition = parition;
    }

    Get(key) {
        let partitionedKey = this.#_partition + key;
        let partition = this.#_partition; // Funny fix huh?

        if (key == null) {
            partitionedKey = null;
        }

        return new Promise((resolve, reject) => {
            chrome.storage.local.get(partitionedKey, function(data) {

                let pairs = [];

                for (const [keyResult, valueResult] of Object.entries(data)) {
                    if (keyResult.startsWith(partition)) {
                        let keyWithoutPartition = keyResult.substring(partition.length);
                        pairs.push({
                            key: keyWithoutPartition,
                            value: valueResult
                        });
                    }
                }

                if (pairs.length > 0){
                    resolve(pairs);
                } else {
                    resolve(null);
                }

            });
        });
    }

    Set(key, value) {
        let partitionedKey = this.#_partition + key;

        let storageItem = {};
        storageItem[partitionedKey] = value;

        let refSetEventHandlers = this.#_setEventHandlers;

        return new Promise((resolve, reject) => {
            chrome.storage.local.set(storageItem, function() {

                refSetEventHandlers.forEach(async (handler) => {
                    handler?.(key, value);
                })

                resolve({
                    key: key,
                    value: value
                });

            });
        });
    }

    Remove(key) {
        let partitionedKey = this.#_partition + key;
        let partition = this.#_partition; // Funny fix huh?

        if (key == null) {
            partitionedKey = null;
        }

        let refRemoveEventHandler = this.#_removeEventHandler;

        return new Promise((resolve, reject) => {
            chrome.storage.local.get(partitionedKey, (data) => {
                for (const [keyResult, valueResult] of Object.entries(data)) {
                    if (keyResult.startsWith(partition)) {
                        let keyWithoutPartition = keyResult.substring(partition.length);

                        chrome.storage.local.remove(keyResult, () => {
                            refRemoveEventHandler.forEach(async (handler) => {
                                handler?.(keyWithoutPartition, valueResult);
                            })

                            resolve({
                                key: keyWithoutPartition,
                                value: valueResult
                            });
                        });

                    }
                }
            });
        })
    }

    AddSetListener(handler) {
        this.#_setEventHandlers.push(handler);
    }

    AddRemoveListener(handler) {
        this.#_removeEventHandler.push(handler);
    }
}