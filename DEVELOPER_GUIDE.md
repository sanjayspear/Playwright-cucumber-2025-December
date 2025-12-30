# Developer Guide - PW-Cucumber Framework

## Table of Contents
1. [Writing Feature Files](#writing-feature-files)
2. [Implementing Step Definitions](#implementing-step-definitions)
3. [Creating Page Objects](#creating-page-objects)
4. [Using Assertions](#using-assertions)
5. [Working with Forms](#working-with-forms)
6. [Handling Browser Events](#handling-browser-events)
7. [Advanced Scenarios](#advanced-scenarios)
8. [Code Examples](#code-examples)

---

## Writing Feature Files

### Feature File Structure

```gherkin
# feature_name.feature

@tag1 @tag2
Feature: Clear, descriptive feature title
    Feature description or context for stakeholders

    Background:
        Given some precondition that applies to all scenarios

    @scenario-tag
    Scenario: Clear, action-oriented scenario title
        Given an initial context
        When I perform an action
        And I perform another action
        Then I should see the expected result
        And another expected result

    @smoke @critical
    Scenario Outline: Testing multiple data sets
        Given I have a user account
        When I login with "<username>" and "<password>"
        Then I should see the message "<message>"

        Examples:
            | username | password | message         |
            | user1    | pass123  | Login successful |
            | user2    | wrong    | Login failed    |
```

### Best Practices for Features

✅ **Do's**
- One feature per file
- Clear, business-readable language
- Use Scenario Outline for data-driven tests
- Use Background for shared setup
- Keep scenarios independent

❌ **Don'ts**
- Multiple features in one file
- Technical implementation details
- Hard-coded values in scenarios (use examples instead)
- Test dependencies (scenario order)

---

## Implementing Step Definitions

### Basic Step Definition

```typescript
// src/step-definitions/Login_Steps.ts

import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CucumberWorld } from "./world/CucumberWorld";

// Regular step
Given('I navigate to the login page', async function (this: CucumberWorld) {
    await this.loginPage.navigateToLoginPage();
});

// Step with parameter
When('I enter username {string}', async function (this: CucumberWorld, username: string) {
    await this.loginPage.fillUsername(username);
});

// Step with word parameter (single word, no spaces)
When('I select {word} from dropdown', async function (this: CucumberWorld, option: string) {
    await this.loginPage.selectDropdown(option);
});

// Step with number parameter
When('I wait {int} seconds', async function (this: CucumberWorld, seconds: number) {
    await this.basePage.page.waitForTimeout(seconds * 1000);
});

// Step with regex parameter
Then('I should see {string} message', async function (this: CucumberWorld, message: string) {
    const visible = await this.basePage.page.locator(`text=${message}`).isVisible();
    expect(visible).toBe(true);
});

// Assertion step
Then('I should be logged in', async function (this: CucumberWorld) {
    const isDashboardVisible = await this.homePage.isDashboardVisible();
    expect(isDashboardVisible).toBe(true);
});

// Using hooks within steps
Before(async function () {
    // Executes before each scenario
    console.log('Test starting');
});

After(async function (scenario) {
    // Executes after each scenario
    if (scenario.result?.status === 'FAILED') {
        await this.basePage.page.screenshot({ path: 'screenshot.png' });
    }
});
```

### Parameter Types

```typescript
// String parameter (with spaces)
When('I enter email {string}', async function (email: string) {
    // email = "john@example.com"
});

// Word parameter (no spaces)
When('I click {word} button', async function (button: string) {
    // button = "Submit"
});

// Integer parameter
When('I wait {int} milliseconds', async function (ms: number) {
    await page.waitForTimeout(ms);
});

// Float parameter
When('I scroll by {float} pixels', async function (pixels: number) {
    // pixels = 100.5
});

// Custom regex
When(/^I verify the page title is "([^"]*)"$/, async function (title: string) {
    const pageTitle = await this.basePage.page.title();
    expect(pageTitle).toBe(title);
});
```

---

## Creating Page Objects

### Page Object Template

```typescript
// src/page-objects/UserProfilePage.ts

import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base/BasePage";
import logger from "../logger/logger";

export class UserProfilePage extends BasePage {
    // Locators (Private)
    private userNameField: Locator = this.page.locator('#username');
    private emailField: Locator = this.page.locator('#email');
    private phoneField: Locator = this.page.locator('#phone');
    private saveButton: Locator = this.page.getByRole('button', { name: 'Save' });
    private successMessage: Locator = this.page.locator('[role="alert"]:has-text("Success")');
    private updateProfileLink: Locator = this.page.getByRole('link', { name: 'Update Profile' });

    // Navigation
    public async navigateToUserProfile(): Promise<void> {
        await this.navigate(`${process.env.BASE_URL}/user-profile`);
        logger.info('Navigated to user profile page');
    }

    public async clickUpdateProfile(): Promise<void> {
        await this.waitAndClick(this.updateProfileLink);
    }

    // User Actions
    public async fillUserName(username: string): Promise<void> {
        await this.userNameField.clear();
        await this.userNameField.fill(username);
        logger.info(`Filled username: ${username}`);
    }

    public async fillEmail(email: string): Promise<void> {
        await this.emailField.clear();
        await this.emailField.fill(email);
    }

    public async fillPhone(phone: string): Promise<void> {
        await this.phoneField.clear();
        await this.phoneField.fill(phone);
    }

    public async saveProfile(): Promise<void> {
        await this.waitAndClick(this.saveButton);
        await this.successMessage.waitFor({ state: 'visible' });
        logger.info('Profile saved successfully');
    }

    // Verification/Assertion methods
    public async getUserName(): Promise<string> {
        return await this.userNameField.inputValue();
    }

    public async getEmail(): Promise<string> {
        return await this.emailField.inputValue();
    }

    public async isSuccessMessageVisible(): Promise<boolean> {
        return await this.successMessage.isVisible();
    }

    public async getSuccessMessage(): Promise<string> {
        return await this.successMessage.textContent() || '';
    }

    // Complex operations
    public async updateProfile(name: string, email: string, phone: string): Promise<void> {
        await this.fillUserName(name);
        await this.fillEmail(email);
        await this.fillPhone(phone);
        await this.saveProfile();
    }

    public async verifyProfileUpdated(name: string, email: string): Promise<void> {
        const savedName = await this.getUserName();
        const savedEmail = await this.getEmail();
        
        if (savedName !== name || savedEmail !== email) {
            logger.error(`Profile update verification failed. Expected ${name}/${email}, got ${savedName}/${savedEmail}`);
            throw new Error('Profile update verification failed');
        }
        logger.info('Profile update verified successfully');
    }
}
```

### Using Page Objects in Steps

```typescript
// src/step-definitions/UserProfile_Steps.ts

import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CucumberWorld } from "./world/CucumberWorld";

Given('I navigate to user profile page', async function (this: CucumberWorld) {
    await this.userProfilePage.navigateToUserProfile();
});

When('I update profile with name {string} and email {string}', 
    async function (this: CucumberWorld, name: string, email: string) {
        await this.userProfilePage.fillUserName(name);
        await this.userProfilePage.fillEmail(email);
        await this.userProfilePage.saveProfile();
    });

Then('profile should be updated with {string}', 
    async function (this: CucumberWorld, name: string) {
        const savedName = await this.userProfilePage.getUserName();
        expect(savedName).toBe(name);
    });
```

---

## Using Assertions

### Playwright Assertions

```typescript
import { expect } from "@playwright/test";

// Visibility
expect(locator).toBeVisible();
expect(locator).toBeHidden();
expect(locator).toBeInViewport();

// Text content
expect(locator).toHaveText('exact text');
expect(locator).toContainText('partial text');

// Value
expect(locator).toHaveValue('input-value');
expect(locator).toHaveAttribute('href', '/path');

// Count
expect(locator).toHaveCount(5);

// Enabled/Disabled
expect(locator).toBeEnabled();
expect(locator).toBeDisabled();

// Checked
expect(locator).toBeChecked();
expect(locator).not.toBeChecked();

// Custom assertions
expect(element).toHaveClass('active');
expect(element).toHaveCSS('color', 'rgb(0, 0, 0)');

// Wait for condition
await expect(locator).toBeVisible({ timeout: 5000 });
await expect(page).toHaveURL('/dashboard');

// Negation
expect(locator).not.toBeVisible();
expect(locator).not.toHaveText('expected');
```

### Custom Assertions in Page Objects

```typescript
export class ProductPage extends BasePage {
    private addToCartButton: Locator = this.page.getByRole('button', { name: 'Add to Cart' });

    public async verifyProductVisible(): Promise<void> {
        await expect(this.addToCartButton).toBeVisible();
    }

    public async verifyProductPrice(expectedPrice: string): Promise<void> {
        const priceElement = this.page.locator('[data-testid="price"]');
        await expect(priceElement).toHaveText(expectedPrice);
    }

    public async verifyProductInStock(): Promise<void> {
        const stockStatus = this.page.locator('[data-testid="stock"]');
        await expect(stockStatus).toContainText('In Stock');
    }
}
```

---

## Working with Forms

### Filling Form Fields

```typescript
export class RegistrationPage extends BasePage {
    private firstNameInput = this.page.locator('#firstName');
    private lastNameInput = this.page.locator('#lastName');
    private emailInput = this.page.locator('#email');
    private passwordInput = this.page.locator('#password');
    private countrySelect = this.page.locator('#country');
    private agreeCheckbox = this.page.locator('#agree');
    private submitButton = this.page.getByRole('button', { name: 'Register' });

    // Text inputs
    public async fillFirstName(name: string): Promise<void> {
        await this.firstNameInput.fill(name);
    }

    // Password field
    public async fillPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    // Select dropdown
    public async selectCountry(country: string): Promise<void> {
        await this.countrySelect.selectOption(country);
    }

    // Checkbox
    public async checkAgreeTerms(): Promise<void> {
        await this.agreeCheckbox.check();
    }

    public async isAgreeChecked(): Promise<boolean> {
        return await this.agreeCheckbox.isChecked();
    }

    // Radio button
    public async selectGender(gender: string): Promise<void> {
        await this.page.locator(`input[name="gender"][value="${gender}"]`).check();
    }

    // Complete form submission
    public async fillAndSubmitRegistration(data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        country: string;
    }): Promise<void> {
        await this.fillFirstName(data.firstName);
        await this.page.locator('#lastName').fill(data.lastName);
        await this.emailInput.fill(data.email);
        await this.fillPassword(data.password);
        await this.selectCountry(data.country);
        await this.checkAgreeTerms();
        await this.submitButton.click();
    }
}
```

### Form Validation

```typescript
export class RegistrationPage extends BasePage {
    private firstNameError = this.page.locator('[data-error="firstName"]');
    private emailError = this.page.locator('[data-error="email"]');

    public async getFirstNameError(): Promise<string> {
        return await this.firstNameError.textContent() || '';
    }

    public async isFirstNameErrorVisible(): Promise<boolean> {
        return await this.firstNameError.isVisible();
    }

    public async verifyFormErrors(): Promise<Record<string, boolean>> {
        return {
            firstName: await this.isFirstNameErrorVisible(),
            email: await this.page.locator('[data-error="email"]').isVisible(),
        };
    }
}
```

---

## Handling Browser Events

### Dialog Boxes (Alert, Confirm, Prompt)

```typescript
export class LoginPage extends BasePage {
    private loginButton: Locator = this.page.getByRole('button', { name: 'Login' });

    public async handleAlertAndLogin(): Promise<string> {
        let alertMessage = '';

        // Listen for dialog
        this.page.on('dialog', async (dialog) => {
            alertMessage = dialog.message();
            console.log(`Alert: ${alertMessage}`);
            await dialog.accept(); // Or dialog.dismiss()
        });

        // Trigger action that shows alert
        await this.loginButton.click();

        return alertMessage;
    }

    public async handlePromptDialog(inputValue: string): Promise<void> {
        this.page.on('dialog', async (dialog) => {
            if (dialog.type() === 'prompt') {
                await dialog.accept(inputValue);
            } else {
                await dialog.dismiss();
            }
        });

        await this.loginButton.click();
    }
}
```

### Multiple Browser Tabs/Windows

```typescript
export class BasePage {
    public async switchToNewTab(): Promise<void> {
        // Wait for new page to open
        const newPage = await this.page.context().waitForEvent("page");
        pageFixture.page = newPage;
        await this.page.waitForLoadState();
    }

    public async switchToTab(index: number): Promise<void> {
        const allPages = await this.page.context().pages();
        pageFixture.page = allPages[index];
    }

    public async getAllTabTitles(): Promise<string[]> {
        const allPages = await this.page.context().pages();
        return Promise.all(allPages.map(p => p.title()));
    }

    public async closeCurrentTab(): Promise<void> {
        await this.page.close();
        // Switch to first remaining tab
        const allPages = await this.page.context().pages();
        if (allPages.length > 0) {
            pageFixture.page = allPages[0];
        }
    }
}
```

### Network Events

```typescript
public async interceptApiCall(): Promise<any> {
    let apiResponse: any;

    // Intercept API responses
    this.page.on('response', async (response) => {
        if (response.url().includes('/api/users')) {
            apiResponse = await response.json();
        }
    });

    // Perform action that triggers API call
    await this.submitForm();

    return apiResponse;
}
```

### Page Navigation

```typescript
public async navigateAndWaitForNavigation(url: string): Promise<void> {
    await Promise.all([
        this.page.waitForNavigation(),
        this.page.goto(url)
    ]);
}

public async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
}
```

---

## Advanced Scenarios

### Data-Driven Testing with Scenario Outline

```gherkin
@regression
Scenario Outline: Validate login with multiple credentials
    When I enter username "<username>"
    And I enter password "<password>"
    And I click login button
    Then I should see "<expectedResult>"

    Examples:
        | username  | password     | expectedResult      |
        | user1     | pass123      | Welcome, user1      |
        | user2     | pass456      | Welcome, user2      |
        | invalid   | wrong        | Invalid credentials |
```

### Conditional Assertions

```typescript
Then('I should see {string} based on status {string}', 
    async function (this: CucumberWorld, expectedText: string, status: string) {
        if (status === 'active') {
            expect(await this.homePage.isWelcomeMessageVisible()).toBe(true);
            expect(await this.homePage.getWelcomeMessage()).toContain(expectedText);
        } else {
            expect(await this.homePage.isErrorMessageVisible()).toBe(true);
        }
    });
```

### Retry Mechanism

```typescript
private async retryAction(action: () => Promise<void>, maxRetries: number = 3): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            await action();
            return;
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await this.page.waitForTimeout(1000);
        }
    }
}

public async fillFieldWithRetry(selector: string, value: string): Promise<void> {
    await this.retryAction(async () => {
        const element = this.page.locator(selector);
        await element.fill(value);
    });
}
```

### Working with Tables

```typescript
export class DataTablePage extends BasePage {
    private tableRows = this.page.locator('table tbody tr');

    public async getTableData(): Promise<string[][]> {
        const rows = await this.tableRows.all();
        const tableData: string[][] = [];

        for (const row of rows) {
            const cells = row.locator('td');
            const rowData = await cells.allTextContents();
            tableData.push(rowData);
        }

        return tableData;
    }

    public async getRowByValue(columnIndex: number, value: string): Promise<Locator | null> {
        const rows = await this.tableRows.all();

        for (const row of rows) {
            const cells = row.locator('td');
            const cellValue = await cells.nth(columnIndex).textContent();
            if (cellValue === value) {
                return row;
            }
        }

        return null;
    }

    public async deleteRowWithValue(value: string): Promise<void> {
        const row = await this.getRowByValue(0, value);
        if (row) {
            const deleteButton = row.locator('button.delete');
            await deleteButton.click();
        }
    }
}
```

---

## Code Examples

### Complete Login Test Example

**Feature File**: `src/features/Login.feature`
```gherkin
@regression @login
Feature: User Login Functionality

    Background:
        Given I navigate to the login page

    @smoke @critical
    Scenario: Successful login with valid credentials
        When I enter valid username and password
        And I click the login button
        Then I should be redirected to the dashboard
        And I should see the welcome message

    Scenario Outline: Login with multiple credentials
        When I enter username "<username>"
        And I enter password "<password>"
        And I click the login button
        Then I should see "<result>"

        Examples:
            | username  | password     | result                  |
            | john      | password123  | Welcome, John!          |
            | jane      | pass456      | Welcome, Jane!          |
            | invalid   | wrongpass    | Invalid login attempt   |
```

**Step Definitions**: `src/step-definitions/Login_Steps.ts`
```typescript
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CucumberWorld } from "./world/CucumberWorld";

Given('I navigate to the login page', async function (this: CucumberWorld) {
    await this.loginPage.navigateToLoginPage();
});

When('I enter valid username and password', async function (this: CucumberWorld) {
    await this.loginPage.fillUsername('john');
    await this.loginPage.fillPassword('password123');
});

When('I enter username {string}', async function (this: CucumberWorld, username: string) {
    await this.loginPage.fillUsername(username);
});

When('I enter password {string}', async function (this: CucumberWorld, password: string) {
    await this.loginPage.fillPassword(password);
});

When('I click the login button', async function (this: CucumberWorld) {
    await this.loginPage.clickLoginButton();
    await this.loginPage.page.waitForLoadState('networkidle');
});

Then('I should be redirected to the dashboard', async function (this: CucumberWorld) {
    await expect(this.loginPage.page).toHaveURL(/.*dashboard/);
});

Then('I should see the welcome message', async function (this: CucumberWorld) {
    const isVisible = await this.homePage.isWelcomeMessageVisible();
    expect(isVisible).toBe(true);
});

Then('I should see {string}', async function (this: CucumberWorld, expectedMessage: string) {
    const message = await this.loginPage.getResultMessage();
    expect(message).toContain(expectedMessage);
});
```

**Page Object**: `src/page-objects/LoginPage.ts`
```typescript
import { Locator } from "@playwright/test";
import { BasePage } from "./base/BasePage";

export class LoginPage extends BasePage {
    private usernameField: Locator = this.page.locator('#username');
    private passwordField: Locator = this.page.locator('#password');
    private loginButton: Locator = this.page.getByRole('button', { name: 'Login' });
    private resultMessage: Locator = this.page.locator('[data-testid="result-message"]');

    public async navigateToLoginPage(): Promise<void> {
        await this.navigate('https://www.webdriveruniversity.com/login-portal/index.html');
        await this.page.waitForLoadState('networkidle');
    }

    public async fillUsername(username: string): Promise<void> {
        await this.usernameField.fill(username);
    }

    public async fillPassword(password: string): Promise<void> {
        await this.passwordField.fill(password);
    }

    public async clickLoginButton(): Promise<void> {
        await this.waitAndClick(this.loginButton);
    }

    public async getResultMessage(): Promise<string> {
        return await this.resultMessage.textContent() || '';
    }
}
```

---

## Testing Best Practices Checklist

- [ ] Steps are written in business language, not technical
- [ ] Page objects encapsulate locators and actions
- [ ] No hard-coded URLs (use environment variables)
- [ ] Assertions are specific and meaningful
- [ ] Tests are independent and can run in any order
- [ ] Meaningful error messages for debugging
- [ ] Proper logging for troubleshooting
- [ ] No test data hard-coded (use examples or external data)
- [ ] Tests follow AAA pattern (Arrange, Act, Assert)
- [ ] Reusable steps that aren't feature-specific

---

**Last Updated**: December 30, 2025
