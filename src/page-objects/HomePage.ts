import { BasePage } from "./base/BasePage";

export class HomePage extends BasePage {
    //Specific methods for the Homepage
    public async clickOnContactUsButton(): Promise<void> {
        await this.waitAndClickByRole("link", "Contact Us Form");
    }

    public async clickOnLoginPortalButton(): Promise<void> {
        await this.waitAndClickByRole("link", "Login Portal");
    }
}