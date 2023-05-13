import puppeteer, { Browser } from 'puppeteer';
import path from 'path';
import { CustomScriptStorage } from "../../../4-shared-components/storage/custom-script-storage"; 

const pathToExtension =path.join(__dirname, '..', '..', '..', 'dist');

const puppeteerArgs = [
    `--disable-extensions-except=${pathToExtension}`,
    `--load-extension=${pathToExtension}`,
    '--show-component-extension-options',
];
  
describe('okay la', () => {
    let page, browser: Browser;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false,
            slowMo: 250,
            devtools: false,
            args: puppeteerArgs
        });

        // Creates a new tab
        page = await browser.newPage();

        // navigates to some specific page
        //await page.goto('https://google.com');
    });

    afterAll(async () => {
        // Tear down the browser
        await browser.close();
    })

    it('get a non-existing key', async () => {
        const storage = new CustomScriptStorage();

        const actualValue = await storage.get(['non-existing-key']);

        expect(actualValue).toEqual(null);
    });
});