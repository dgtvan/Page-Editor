import { StorageBase } from "./storage";

export class CustomScriptStorage extends StorageBase {
    constructor() {
        super('_CustomScript_');
    }
}