import { Given, When, Then } from "@cucumber/cucumber";
import { pageFixture } from "./hooks/browserContextFixture";
import {expect} from "@playwright/test";

let alertText: string;

When('I type a username {word}', async (username: string) => {
    await pageFixture.page.getByPlaceholder("Username").fill(username);
});

When('I type a password {word}', async (password: string) => {
    await pageFixture.page.getByPlaceholder("Password").fill(password);
});

When('I click on the login button', async () => {
    await pageFixture.page.on("dialog", async (alert) => {
        alertText = alert.message();
        //console.log(alertText);
        await alert.accept();
    })

    const loginButton = await pageFixture.page.locator("#login-button");
    await loginButton.hover();
    await loginButton.click({ force: true });
    //await pageFixture.page.waitForTimeout(2000);
});


Then('I should be presented with an alert box which contains text {string}', async (expectedAlertText: string) => {
    expect(alertText).toBe(expectedAlertText);
});