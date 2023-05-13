import * as TestUtility from '../test/utility.js';
import * as TestScriptStorage from '../test/script-storage.js';

export function Begin() {
    TestScriptStorage.Begin();
    TestUtility.Begin();
}