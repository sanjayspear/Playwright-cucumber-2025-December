import { BasePage } from "../page-objects/base/BasePage"

export class LoginPage extends BasePage {
    public async navigateToLoginPage(): Promise<void> {
        await this.navigate("https://www.webdriveruniversity.com/Login-Portal/index.html");
    }

    public async fillUsername(username: string): Promise<void> {
        await this.page.getByPlaceholder("Username").fill(username);
    }

    public async fillPassword(password: string): Promise<void> {
        await this.page.getByPlaceholder("Password").fill(password);
    }

    public async clickOnLoginButton(): Promise<void> {
        await this.page.getByRole("button", { name: "Login" }).click();
    }
}