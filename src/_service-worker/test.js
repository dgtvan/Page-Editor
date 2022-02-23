import * as TestUtility from '../test/utility.js';
import * as TestFileStorage from '../test/file-storage.js';

export function Begin() {
    TestFileStorage.Begin();
    TestUtility.Begin();
}