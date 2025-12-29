import { Given, When } from "@cucumber/cucumber";
import logger from '../logger/logger';
import { CucumberWorld } from "./world/CucumberWorld";

const url = "https://www.webdriveruniversity.com/";

Given('I navigate to the webdriveruniversity homepage', async function (this: CucumberWorld) {
    try {
        //Access URL
        await this.homePage.navigate(url);
        logger.info('Accessing URL: ' + url);
        this.setUrl(url);
    } catch (error: any) {
        logger.error('An error has occurred: ' + error.message);
    }
});

When('I click on the contact us button', async function (this: CucumberWorld) {
    this.homePage.clickOnContactUsButton();
});

When('I click on the login portal button', async function (this: CucumberWorld) {
    this.homePage.clickOnLoginPortalButton();
});