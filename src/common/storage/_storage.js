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
                
                let pairs = [];

                for (const [keyResult, valueResult] of Object.entries(data)) {
                    if (keyResult.startsWith(partition)) {
                        let keyWithoutPartition = keyResult.substring(partition.length);

                        chrome.storage.local.remove(keyResult, () => {
                            
                            pairs.push({
                                key: keyWithoutPartition,
                                value: valueResult
                            });

                        });

                    }
                }

                pairs.forEach(pair => {
                    refRemoveEventHandler.forEach(async (handler) => {
                        handler?.(pair.key, pair.value);
                    })
                });

                if (pairs.length == 1) {
                    resolve({
                        key: pairs[0].key,
                        value: pairs[0].value
                    });
                } else if (pairs.length > 1) {
                    resolve(pairs);
                } else {
                    resolve(null);
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