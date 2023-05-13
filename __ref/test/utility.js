import { Log } from "../common/log/es-log.js";
import * as Utility from '../common/utility.js';

import { Base } from './_test-base.js';

const _log = new Log('Test-Utility');
const _base = new Base(_log, PreTest, PostTest);

export function Begin() {
    let testProcs = [
        Case_0
    ];

    _base.Run(testProcs);
}

function PreTest() {
    return new Promise((resolve, reject) => {
        //_log.Info('PRE-TEST');
        resolve(true);
    });
}

function PostTest() {
    return new Promise((resolve, reject) => {
        //_log.Info('POS-TEST');
        resolve(true);
    });
}

function Case_0() {
    let originalValue = '~~<>?:"{}|~!@#$%^&*()_+khskjvhfdsjhv~!@#$%^&*()_+';

    let executePromise = new Promise((resolve, reject) => {
        let encoded = Utility.Base64Encode(originalValue);
        let decoded = Utility.Base64Decode(encoded);

        if (_base.AssertExact(Case_0, originalValue, decoded))
        {
            resolve(_base.OK(Case_0));
        } else {
            resolve(_base.NG(Case_0));
        }
    });

    return executePromise;
}
