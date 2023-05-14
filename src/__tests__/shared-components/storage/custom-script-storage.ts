import chrome from 'sinon-chrome';
import { CustomScriptStorage } from "../../../4-shared-components/storage/custom-script-storage"; 

describe('okay la', () => {
    beforeAll(async () => {
        // TODO: Wait for sinon-chorome to support the latest chrome extension API.
        // https://github.com/acvetkov/sinon-chrome/issues/112
        
        //global.chrome = chrome
    });

    afterAll(async () => {
        chrome.flush();
    })

    it('get a non-existing key', async () => {
        const storage = new CustomScriptStorage();

        const actualValue = await storage.get(['non-existing-key']);

        expect(actualValue).toEqual(null);
    });
});