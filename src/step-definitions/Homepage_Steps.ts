import { Given, When } from "@cucumber/cucumber";
import { pageFixture } from "./hooks/browserContextFixture";
import logger from '../logger/logger';

const url = "https://www.webdriveruniversity.com/";

Given('I navigate to the webdriveruniversity homepage', async () => {
    try {
        //Access URL
        await pageFixture.page.goto(url);
        logger.info('Accessing URL: ' + url);
        //throw new Error('Simulating an error during navigation');
    } catch (error: any) {
        logger.error('An error has occurred: ' + error.message);
    }
});

When('I click on the contact us button', async () => {
    //await page.pause();
    const contactUs_Button = await pageFixture.page.getByRole('link', { name: 'CONTACT US Contact Us Form' });
    await contactUs_Button.click();
});

When('I click on the login portal button', async () => {
    const login_Button = await pageFixture.page.getByRole('link', { name: 'LOGIN PORTAL Login Portal' });
    await login_Button.click();
});