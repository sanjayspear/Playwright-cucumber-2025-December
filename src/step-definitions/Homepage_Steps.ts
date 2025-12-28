import { Given, When } from "@cucumber/cucumber";
import { pageFixture } from "./hooks/browserContextFixture";

const url = "https://www.webdriveruniversity.com/";

Given('I navigate to the webdriveruniversity homepage', async () => {
    //Access URL
    await pageFixture.page.goto(url);
});

When('I click on the contact us button', async () => {
    //await page.pause();
    const contactUs_Button = pageFixture.page.getByRole('link', { name: 'CONTACT US Contact Us Form' });
    await contactUs_Button.click();
});

When('I click on the login portal button', async () => {
    const loginPortal_Button = pageFixture.page.getByRole('link', { name: 'LOGIN PORTAL Login Portal Are' });
    await loginPortal_Button.click();
});

When('I switch to the new browser tab', async () => {
    await pageFixture.context.waitForEvent("page"); //reintialise the page > new tab > page

    //Retrieve all current open pages (tabs)
    const allPages = pageFixture.context.pages();

    //Assign the most recent tab to pageFixture.page
    pageFixture.page = allPages[allPages.length - 1];

    //Bring the newly assigned tab to the front (Make it active)
    await pageFixture.page.bringToFront();

    //Ensure the newly assigned tab is also fully maximised 
    await pageFixture.page.setViewportSize({ width: 1258, height: 660 });
})