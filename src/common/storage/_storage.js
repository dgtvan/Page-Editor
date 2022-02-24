import { Log } from '../log/es-log.js';

const _log = new Log('Storage');

export class Storage {
    #_setEventHandlers = [];
    #_removeEventHandler = [];
    #_partition = '';

    constructor(parition = '') {
        this.#_partition = parition;
    }

    Get(key, callback) {
        let partitionedKey = this.#_partition + key;
        let thisPartition = this.#_partition; // Funny fix huh?

        // Key is null meaning that it should retrive all data,
        // then filter based on the partition.
        if (key == null) {
            partitionedKey = null;
        }

        chrome.storage.local.get(partitionedKey, function(data) {
            for (const [key, value] of Object.entries(data)) {
                if (key.startsWith(thisPartition)) {
                    let originalKey = key.substring(thisPartition.length);
                    callback?.(originalKey, value);
                }
            }
        });
    }

    Set(key, value, callback) {
        let partitionedKey = this.#_partition + key;

        let storageItem = {};
        storageItem[partitionedKey] = value;

        let refSetEventHandlers = this.#_setEventHandlers;

        chrome.storage.local.set(storageItem, function() {
            callback?.();

            refSetEventHandlers.forEach(handler => {
                handler?.(partitionedKey, value);
            })
        });
    }

    Remove(key, callback) {
        let partitionedKey = this.#_partition + key;
        let thisPartition = this.#_partition;

        if (key == null) {
            partitionedKey = null;
        }

        let refRemoveEventHandler = this.#_removeEventHandler;

        this.Get(key, (keyResult, valueResult) => {
            let removalKey = thisPartition + keyResult;
            chrome.storage.local.remove(removalKey, function() {
                callback?.(keyResult, valueResult);
                refRemoveEventHandler.forEach(handler => {
                    handler?.(keyResult, valueResult);
                })
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