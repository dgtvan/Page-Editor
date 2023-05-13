export abstract class StorageBase {
    private _namespace: string = '';

    public constructor(namespace: string) {
        if (namespace == null || namespace == '') 
            throw new Error('namespace is empty or null');

        this._namespace = namespace;
    }

    public async get(keys: string[]): Promise<{ [key: string] : any } | null> {
        const prefixedKeys = keys.map(key => this.prefixKey(key));
        const rawValues = await chrome.storage.local.get(prefixedKeys);
        const unprefixedValues = this.unprefixKeys(rawValues);
        return unprefixedValues;
    }

    //public abstract set(key: string, value: string): Promise<void>;
    
    //public abstract remove(key: string): Promise<void>;

    private prefixKey(key: string): string {
        return this._namespace + key;
    }

    // Remove prefix from all keys in a given object
    private unprefixKeys(object: { [key: string] : any }): { [key: string] : any } {
        const unprefixedObject: { [key: string] : any } = {};
        Object.keys(object).forEach(key => {
            const unprefixedKey = key.replace(this._namespace, '');
            unprefixedObject[unprefixedKey] = object[key];
        });
        return unprefixedObject;
    }
}