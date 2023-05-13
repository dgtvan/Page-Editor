import { CustomScriptStorage } from "../../../4-shared-components/storage/custom-script-storage";   

describe('okay la', () => {
    beforeAll(() => {
    });

    afterAll(() => {
    });

    it('get a non-existing key', async () => {
        const storage = new CustomScriptStorage();

        const actualValue = await storage.get(['non-existing-key']);

        expect(actualValue).toEqual(null);
    });
});