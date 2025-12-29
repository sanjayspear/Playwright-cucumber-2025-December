import { After, AfterAll, Before, BeforeAll, Status } from "@cucumber/cucumber";
import { Browser, chromium, BrowserType, firefox, webkit } from "@playwright/test";
import { pageFixture } from "./browserContextFixture";
import { setGlobalSettings } from "../../utils/playwright-timeouts";
import { PageManager } from "../../page-objects/base/PageManager";

//Load env variables from .env file
import { config as loadEnv } from "dotenv"
const env = loadEnv({ path: './env/.env' });

//Create a configuration object for easy access to env variables
const config = {
    headless: env.parsed?.HEADLESS === 'true',
    browser: env.parsed?.UI_AUTOMATION_BROWSER || 'chromium',
    width: parseInt(env.parsed?.BROWSER_WIDTH || '1920'),
    height: parseInt(env.parsed?.BROWSER_HEIGHT || '1080'),
}

//Create dictionary mapping browser names to their launch functions
const browsers: { [key: string]: BrowserType } = {
    'chromium': chromium,
    'firefox': firefox,
    'webkit': webkit
};

let browserInstance: Browser | null = null;

async function initializeBrowserContext(selectedBrowser: string): Promise<Browser> {
    const launchBrowser = browsers[selectedBrowser];
    if(!launchBrowser) {
        throw new Error(`Invalid browser selected: ${selectedBrowser}`);
    }

    return await launchBrowser.launch({ headless: config.headless});
}

async function initializePage(): Promise<void> {
    if(!browserInstance) {
        throw new Error('Browser instance is null');
    }
    pageFixture.context = await browserInstance.newContext({
        ignoreHTTPSErrors: true
    });
    pageFixture.page = await pageFixture.context.newPage();
    setGlobalSettings(pageFixture.page);
    await pageFixture.page.setViewportSize({width: config.width, height: config.height});
}

//BeforeAll hook: Runs once before all scenarios
BeforeAll(async function () {
    console.log("\nExecuting test suite...");
})

//AfterAll hook: Runs once after all scenarios
AfterAll(async function () {
    console.log("\nFinished execution of test suite!");
})

// Before hook: Runs before each scenario
Before(async function () {
    try {
        browserInstance = await initializeBrowserContext(config.browser);
        console.log(`Browser context initialized for: ${config.browser}`);
        await initializePage();

        this.pageManager = new PageManager();
        this.basePage = this.pageManager.createBasePage();
        this.homePage = this.PageManager.createHomePage();
        this.contactUsPage = this.PageManager.createContactUsPage();
        this.loginPage = this.PageManager.createLoginPage();
    } catch (error) {
        console.error('Browser context initialization failed:', error);
    }
})

// After hook: Runs after each scenario
After(async function ({ pickle, result }) {
    if (result?.status === Status.FAILED) {
        if (pageFixture.page) {
            const screenshotPath = `./reports/screenshots/${pickle.name}-${Date.now()}.png`;
            const image = await pageFixture.page.screenshot({
                path: screenshotPath,
                type: 'png',
                //timeout: 60000
            });
            await this.attach(image, 'image/png');
        } else {
            console.error('pageFixture.page is undefined');
        }
    }

    if(browserInstance) {
        await pageFixture.page?.close();
        await browserInstance.close();
    }
})