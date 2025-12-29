import { When, Given } from "@cucumber/cucumber";
import { pageFixture } from "./hooks/browserContextFixture";
import { CucumberWorld } from "./world/CucumberWorld";

When('I switch to the new browser tab', async function (this: CucumberWorld) {
    await this.basePage.switchToNewTab();
})

Given('I wait for {int} seconds', async (seconds: number) => {
    await pageFixture.page.waitForTimeout(seconds * 1000);
})