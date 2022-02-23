import * as Utility from '../common/utility.js';

export class Base {
    constructor(log, preTestProc, postTestProc) {
        this._log = log;
        this._preTestProc = preTestProc;
        this._postTestProc = postTestProc;
    }

    Run(testProcs) {
        this._preTestProc().then(() => {
            this.#InvokeTestProc(testProcs).then(() => {
                    this._postTestProc().then(() => {
                });
            });
        });
    }

    AssertExact(testProc, actualValue, expectedValue) {
        if (actualValue === expectedValue) {
            return true;
        } else {
            this._log.Info('Case \'' + Utility.FunctionName(testProc) + '\': Actual \'' + actualValue + '\', Expected \'' + expectedValue + '\'');
            return false;
        }
    }

    AssertEqual(testProc, actualValue, expectedValue) {
        if (actualValue == expectedValue) {
            return true;
        } else {
            this._log.Info('Case \'' + Utility.FunctionName(testProc) + '\': Actual \'' + actualValue + '\', Expected \'' + expectedValue + '\'');
            return false;
        }
    }

    AssertObjectEqual(testProc, actualObj, expectedObj) {

        let allOK = true;
        for (const [key, value] of Object.entries(expectedObj)) {
            if (!this.AssertEqual(testProc, actualObj[key], expectedObj[key])) {
                allOK = false;
                break;
            }
        }

        return allOK;
    }

    NG(testProc)
    {
        return this.#Result(testProc, false);
    }

    OK(testProc)
    {
        return this.#Result(testProc, true);
    }

    #Result(testProc, result)
    {
        // var nameCaller = new Error().stack.split('\n')[3].trim().split(' ')[1];
        // _log.Info('Caller ' + nameCaller);

        let nameCaller = Utility.FunctionName(testProc);

        return {
            testName: nameCaller,
            result: result
        }
    }

    #InvokeTestProc(tests) {
        return new Promise((resolve, reject) => {
            let promises = [];
            
            tests.forEach((test) => {
                let promise = new Promise((resolve, reject) => {
                    test().then((result) => {
                        resolve(result);
                    })
                });
                promises.push(promise);
            });
            
            Promise.allSettled(promises).then(results => {
                results.forEach((result) => {
                    let testResult = '';
                    let style = '';

                    if (result.value.result === true) {
                        testResult = 'OK';
                    } else {
                        testResult = 'NG';
                        style = 'background: #f542dd;';
                    }

                    this._log.InfoEx(result.value.testName + ': ' + testResult, style);
                });
                resolve(true);
            });
        });
    }
}