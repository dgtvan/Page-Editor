import { CustomScriptStorage } from "../../../4-shared-components/storage/custom-script-storage";   
import * as browser from "sinon-chrome";
// import * as chrome from "sinon-chrome";
import chrome from "sinon-chrome";

describe('okay la', () => {
    beforeAll(() => {
        global.chrome = chrome
    });

    afterAll(() => {
        chrome.flush();
    });

    it('get a non-existing key', async () => {
        const storage = new CustomScriptStorage();

        const actualValue = await storage.get(['non-existing-key']);

        expect(actualValue).toEqual(null);
    });
});