import { Log } from "../common/log/es-log.js";
import * as FileStorage from '../common/file-storage.js';
import * as Utility from '../common/utility.js';
import * as GlobalConstant from '../common/global-constant.js';

import { Base } from './_test-base.js';

const _log = new Log('Test-FileStorage');
const _base = new Base(_log, PreTest, PostTest);

//#region Test Data
const _seedFileContent =
    `
// Lorem ipsum dolor sit amet, consectetuer adipiscing elit.

/* 
Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
*/

[[ConfigData]]

/* Here we go */

alert('Page editor injected!');
`;

const _configData =
    GlobalConstant.ConfigSectionBeginText +
    `

urls=google.com;all;kenh14.net
enable=true
refreshOnChange=true

` +
    GlobalConstant.ConfigSectionEndText;

const _plainFileContentNoConfig = _seedFileContent.replace('[[ConfigData]]', '');
const _plainFileContent = _seedFileContent.replace('[[ConfigData]]', _configData);
const _base64FileContent = Utility.Base64Encode(_plainFileContent);
//#endregion Test Data

export function Begin() {
    let testProcs = [
        Case_0,
        Case_1
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
    let filePath = '/a/b/c/d.js';
    let fileContent = _base64FileContent;

    let executePromise = new Promise((resolve, reject) => {
        FileStorage.Set(filePath, fileContent, () => {
            FileStorage.Get(filePath, (getFilePath, getFileContent) => {
                FileStorage.Remove(filePath);
                if (getFilePath === filePath && getFileContent === fileContent) {
                    resolve(_base.OK(Case_0));
                } else {
                    resolve(_base.NG(Case_0));
                }
            })
        });
    });

    return executePromise;
}

function Case_1() {
    let fileName = 'test-file-storage-case-1';
    let ext = '.js';
    let filePath = fileName + ext;
    let fileContent = _base64FileContent;

    let expectedFileBasic = {
        path: filePath,
        name: fileName,
        extension: ext,
        content: Utility.Base64Decode(fileContent)
    }

    let expectedConfig = {
        urls: "all",
        enable: "true",
        refreshOnChange: "true"
    }

    let executePromise = new Promise((resolve, reject) => {
        FileStorage.Set(filePath, fileContent, () => {
            FileStorage.GetEx(filePath, (fileDetail) => {
                FileStorage.Remove(filePath);
                if (_base.AssertObjectEqual(Case_1, fileDetail, expectedFileBasic) &&
                    _base.AssertObjectEqual(Case_1, fileDetail.config, expectedConfig)) {
                    resolve(_base.OK(Case_1));
                } else {
                    resolve(_base.NG(Case_1));
                }
            })
        });
    });

    return executePromise;
}