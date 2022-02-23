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
                    callback?.(partitionedKey, value);
                }
            }
        });
    }

    Set(key, value, callback) {
        let partitionedKey = this.#_partition + key;

        let storageItem = {};
        storageItem[partitionedKey] = value;

        chrome.storage.local.set(storageItem, function() {
            callback?.();

            this.#_setEventHandlers.forEach(handler => {
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

        this.Get(partitionedKey, (key, value) => {
            if (key.startsWith(thisPartition)) {
                chrome.storage.local.remove(key, function() {
                    callback?.(thisPartition, value);

                    this.#_removeEventHandler.forEach(handler => {
                        handler?.(thisPartition, value);
                    })
                });
            }
        })
    }

    AddSetListener(handler) {
        this.#_setEventHandlers.push(handler);
    }

    AddRemoveListener(handler) {
        this.#_removeEventHandler.push(handler);
    }
}