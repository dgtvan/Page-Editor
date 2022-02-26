import { Log } from "../common/log/es-log.js";
import { ScriptStorage } from '../common/storage/script-storage.js';
import * as Utility from '../common/utility.js';
import * as GlobalConstant from '../common/global-constant.js';

import { Base } from './_test-base.js';

const _log = new Log('Test-ScriptStorage');
const _scriptStorage = new ScriptStorage();
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
//#endregion Test Data

export function Begin() {
    let testProcs = [
        Case_0,
        Case_1,
        Case_2
    ];

    _base.Run(testProcs);
}

const FileNameHelper = {
    FileNames: [],
    Create: function(fileName) {
        this.FileNames.push(fileName);
        return fileName;
    }
}

function PreTest() {
    return new Promise((resolve, reject) => {
        //_log.Info('PRE-TEST');
        resolve(true);
    });
}

function PostTest() {
    return new Promise((resolve, reject) => {
        let promises = [];

        FileNameHelper.FileNames.forEach((fileName, idx, arr) => {
            let promise = new Promise((resolve, reject) => {
                _scriptStorage.Remove(fileName).then(() => {
                    resolve();
                });
            });
            promises.push(promise);
        });

        Promise.allSettled(promises, () => {
            resolve();
        });
    });
}

function Case_0() {
    let filePath = FileNameHelper.Create('/a/b/c/d.js');
    let fileContent = _plainFileContent;

    let executePromise = new Promise((resolve, reject) => {

        _scriptStorage.Set(filePath, fileContent).then(() => {

            _scriptStorage.Get(filePath).then((result) => {

                if (_base.AssertExact(Case_0, result.path, filePath) &&
                    _base.AssertExact(Case_0, result.content, fileContent)) {
                    resolve(_base.OK(Case_0));
                } else {
                    resolve(_base.NG(Case_0));
                }

            });
        });
    });

    return executePromise;
}

function Case_1() {
    let expectedFileBasic = {
        path: FileNameHelper.Create('test-file-storage-case-1.js'),
        name: 'test-file-storage-case-1',
        extension: '.js',
        content: _plainFileContent
    }

    let expectedConfig = {
        urls: "all",
        enable: "true",
        refreshOnChange: "true"
    }

    let executePromise = new Promise((resolve, reject) => {

        _scriptStorage.Set(expectedFileBasic.path, _plainFileContent).then(() =>{

            _scriptStorage.GetEx(expectedFileBasic.path).then(fileDetail => {
                
                if (_base.AssertObjectEqual(Case_1, fileDetail, expectedFileBasic) &&
                    _base.AssertObjectEqual(Case_1, fileDetail.config, expectedConfig)) {
                    resolve(_base.OK(Case_1));
                } else {
                    resolve(_base.NG(Case_1));
                }

            });

        });
    });

    return executePromise;
}

function Case_2() {
    let filePath = FileNameHelper.Create('test-file-2.js');
    let fileContent = _plainFileContent;

    let executePromise = new Promise((resolve, reject) => {

        _scriptStorage.Set(filePath, fileContent).then(() => {

            _scriptStorage.Remove(filePath).then(() => {

                _scriptStorage.Get(filePath).then(result => {
                    if (result == null)
                    {
                        resolve(_base.OK(Case_2));
                    }
                });

            });

        });

    });

    return executePromise;
}