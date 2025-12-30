# Framework Standards & Best Practices

## Table of Contents
1. [Code Organization Standards](#code-organization-standards)
2. [Naming Conventions](#naming-conventions)
3. [Step Definition Standards](#step-definition-standards)
4. [Page Object Standards](#page-object-standards)
5. [Test Scenario Standards](#test-scenario-standards)
6. [Locator Selection Strategy](#locator-selection-strategy)
7. [Error Handling & Logging](#error-handling--logging)
8. [Performance Optimization](#performance-optimization)
9. [Code Review Checklist](#code-review-checklist)
10. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)

---

## Code Organization Standards

### Directory Structure Rules

```
✅ CORRECT
src/
├── features/
│   ├── Login.feature           # One feature per file
│   ├── Contact_Us.feature
│   └── HomePage.feature
├── step-definitions/
│   ├── Login_Steps.ts          # Steps match feature name
│   ├── ContactUs_Steps.ts
│   ├── HomePage_Steps.ts
│   └── Base_Steps.ts           # Shared steps
└── page-objects/
    ├── LoginPage.ts            # Page name matches feature
    ├── ContactUsPage.ts
    └── HomePage.ts

❌ INCORRECT
src/
├── features/
│   └── all_tests.feature       # Multiple features in one file
├── step-definitions/
│   └── steps.ts                # No clear organization
└── page-objects/
    └── pages.ts                # All pages in one file
```

### File Location Rules

1. **Feature Files**: `src/features/[FeatureName].feature`
2. **Step Definitions**: `src/step-definitions/[FeatureName]_Steps.ts`
3. **Page Objects**: `src/page-objects/[PageName]Page.ts`
4. **Utilities**: `src/utils/[utility-name].ts`
5. **Base Classes**: `src/page-objects/base/`

---

## Naming Conventions

### File Naming

| Type | Pattern | Example | Notes |
|------|---------|---------|-------|
| Feature | `[FeatureName].feature` | `Login.feature` | PascalCase, singular or descriptive |
| Step Definition | `[Feature]_Steps.ts` | `Login_Steps.ts` | Matches feature name with suffix |
| Page Object | `[PageName]Page.ts` | `LoginPage.ts` | PascalCase with Page suffix |
| Utility | `[utility-name].ts` | `playwright-timeouts.ts` | kebab-case |
| Hook | `hooks.ts` | `hooks.ts` | Descriptive filename |

### Variable & Function Naming

```typescript
// ✅ GOOD - Clear intent, descriptive
const usernameInput = this.page.locator('#username');
public async fillUsername(value: string): Promise<void> {}
private async waitForElementAndClick(locator: Locator): Promise<void> {}

// ❌ BAD - Vague, abbreviations
const inp = this.page.locator('#usr');
public async fill(val: string): Promise<void> {}
private async wait(): Promise<void> {}

// ✅ GOOD - Boolean names start with is/has/should
private isLoginButtonVisible: boolean;
private hasUserLoggedIn: boolean;
public async isErrorMessageDisplayed(): Promise<boolean> {}

// ❌ BAD - Non-standard boolean naming
private loginVisible: boolean;
private userLoggedIn: boolean;
public async checkError(): Promise<boolean> {}
```

### Gherkin Naming

```gherkin
✅ GOOD - Action-oriented, clear intent
Given I navigate to the login page
When I enter valid credentials
Then I should be logged in

❌ BAD - Vague, implementation details
Given I am on the page
When I do the action
Then it works

✅ GOOD - Specific data in examples
Given a user with email "<email>"
When they submit the form
Then they should see "<message>"

❌ BAD - Hard-coded values
Given a user with email "test@example.com"
When they submit the form
Then they should see "Success"
```

---

## Step Definition Standards

### Step Definition Structure

```typescript
// ✅ GOOD
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CucumberWorld } from "./world/CucumberWorld";

// Grouped by Given, When, Then
Given('I navigate to the login page', async function (this: CucumberWorld) {
    await this.loginPage.navigateToLoginPage();
});

When('I enter username {string}', async function (this: CucumberWorld, username: string) {
    await this.loginPage.fillUsername(username);
});

Then('I should be logged in', async function (this: CucumberWorld) {
    const isLoggedIn = await this.homePage.isUserLoggedIn();
    expect(isLoggedIn).toBe(true);
});

// ❌ BAD - Mixed order, poor organization
Then('I should be logged in', async function (this: CucumberWorld) {
    // ...
});

When('I click login', async function (this: CucumberWorld) {
    // ...
});

Given('navigate to page', async function (this: CucumberWorld) {
    // ...
});
```

### Step Definition Rules

```typescript
// ✅ DO
// 1. One action per step
When('I enter username {string}', async function (username: string) {
    await this.loginPage.fillUsername(username);
});

// 2. Use consistent parameter naming
When('I enter {string} into {string} field', async function (value: string, fieldName: string) {
    await this.page.locator(`[name="${fieldName}"]`).fill(value);
});

// 3. Keep steps simple and focused
Then('I should see success message', async function (this: CucumberWorld) {
    const message = await this.page.locator('.success').textContent();
    expect(message).toBeTruthy();
});

// 4. Delegate to page objects
Given('I navigate to dashboard', async function (this: CucumberWorld) {
    await this.dashboardPage.navigateToDashboard();
});

// ❌ DON'T
// 1. Multiple actions in one step
When('I fill the form and submit it', async function () {
    await this.page.locator('#name').fill('John');
    await this.page.locator('#email').fill('john@example.com');
    await this.page.locator('#submit').click();
});

// 2. Hard-code values
When('I click login button', async function () {
    await this.page.locator('#login-button-id-12345').click();
});

// 3. Complex logic in steps
Then('I verify all fields are populated correctly', async function () {
    // 20 lines of verification logic...
});

// 4. Implementation details in step language
When('I click the button with XPath //button[@id="submit"]', async function () {
    // ...
});
```

### Parameter Types

```typescript
// ✅ CORRECT - Using Cucumber parameter types

// String (with spaces)
When('I enter email {string}', async function (email: string) {
    // Called with: When I enter email "john@example.com"
});

// Word (single word, no spaces)
When('I click {word} button', async function (button: string) {
    // Called with: When I click Submit button
});

// Integer
When('I wait {int} seconds', async function (seconds: number) {
    await this.page.waitForTimeout(seconds * 1000);
});

// Float
When('I scroll {float} pixels', async function (pixels: number) {
    // Called with: When I scroll 150.5 pixels
});

// ❌ INCORRECT - Custom parameters

// Avoid overly specific parameters
When('I enter user {string} with email {string}', async function (user: string, email: string) {
    // Too specific to one scenario
});

// Avoid ambiguous parameters
When(/^I do something with (.*)$/, async function (something: string) {
    // Too vague
});
```

---

## Page Object Standards

### Page Object Structure

```typescript
// ✅ GOOD - Well-organized page object
export class LoginPage extends BasePage {
    // 1. Locators (private)
    private usernameField: Locator = this.page.locator('#username');
    private passwordField: Locator = this.page.locator('#password');
    private loginButton: Locator = this.page.getByRole('button', { name: 'Login' });
    private errorMessage: Locator = this.page.locator('[role="alert"]');

    // 2. Navigation method
    public async navigateToLoginPage(): Promise<void> {
        await this.navigate(`${process.env.BASE_URL}/login`);
    }

    // 3. Action methods (user interactions)
    public async fillUsername(username: string): Promise<void> {
        await this.usernameField.fill(username);
    }

    public async fillPassword(password: string): Promise<void> {
        await this.passwordField.fill(password);
    }

    public async clickLoginButton(): Promise<void> {
        await this.waitAndClick(this.loginButton);
    }

    // 4. Verification methods (assertions)
    public async isErrorMessageVisible(): Promise<boolean> {
        return await this.errorMessage.isVisible();
    }

    public async getErrorMessage(): Promise<string> {
        return await this.errorMessage.textContent() || '';
    }

    // 5. Complex business operations
    public async loginAsUser(username: string, password: string): Promise<void> {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLoginButton();
        await this.page.waitForLoadState('networkidle');
    }
}

// ❌ BAD - Disorganized, mixing concerns
export class LoginPage extends BasePage {
    // Locators mixed with methods
    public username = this.page.locator('#username');

    public async doLogin() {
        const user = 'testuser'; // Hard-coded values
        this.username.fill(user);
        this.page.locator('#password').fill('test123');
        this.page.locator('button').click();
        
        // Assertion mixed with action
        const result = await this.page.locator('.success').isVisible();
        return result;
    }
}
```

### Locator Best Practices

```typescript
// ✅ GOOD - Semantic, maintainable
private submitButton = this.page.getByRole('button', { name: 'Submit' });
private emailInput = this.page.getByLabel('Email');
private userMenu = this.page.getByRole('menu', { name: 'User' });
private requiredField = this.page.locator('[required]');

// ❌ BAD - Brittle, implementation-coupled
private submitButton = this.page.locator('button.btn-primary#submit-123');
private emailInput = this.page.locator('div > div > input:nth-child(2)');
private userMenu = this.page.locator('[data-qa-id="usr-menu-v2.5"]');
```

---

## Test Scenario Standards

### Feature File Structure

```gherkin
# ✅ GOOD - Clear, focused, independent
@regression @payment
Feature: Payment Processing
    Users should be able to process payments with various payment methods

    Background:
        Given I am logged in as a regular user
        And I navigate to the checkout page

    @smoke @critical
    Scenario: Successful payment with credit card
        Given I have items in my cart
        When I enter valid credit card details
        And I click the pay button
        Then I should see payment successful message
        And my order should be created

    @regression
    Scenario Outline: Payment with various card types
        When I enter a <cardType> card with number "<cardNumber>"
        And I click the pay button
        Then I should see "<result>"

        Examples:
            | cardType | cardNumber       | result             |
            | Visa     | 4111111111111111 | payment successful |
            | MC       | 5555555555554444 | payment successful |
            | Invalid  | 1111111111111111 | payment failed     |

# ❌ BAD - Multiple features, unclear scenarios
Feature: User Management, Payments, and Reports
    Scenario: Everything related to users
        # ... 50 lines of steps
```

### Scenario Rules

✅ **DO**
- One business outcome per scenario
- Independent scenarios (can run in any order)
- Clear given/when/then separation
- Use Scenario Outline for data variations
- Include edge cases and error scenarios

❌ **DON'T**
- Multiple outcomes in one scenario
- Test dependencies (scenario A requires scenario B)
- Hard-coded test data
- Implementation-focused language
- Long steps with multiple actions

---

## Locator Selection Strategy

### Locator Priority (Best to Worst)

```typescript
// 1️⃣ BEST - By Role (most accessible)
this.page.getByRole('button', { name: 'Submit' })
this.page.getByRole('textbox', { name: 'Email' })
this.page.getByRole('link', { name: 'Login' })

// 2️⃣ GOOD - By Label (semantically correct)
this.page.getByLabel('Email Address')
this.page.getByLabel('Password')

// 3️⃣ GOOD - By Placeholder
this.page.getByPlaceholder('Enter your email')
this.page.getByPlaceholder('MM/DD/YYYY')

// 4️⃣ GOOD - By Text
this.page.getByText('Click here')
this.page.getByText('Login', { exact: true })

// 5️⃣ ACCEPTABLE - By Test ID (for dynamic content)
this.page.getByTestId('user-profile-button')
this.page.locator('[data-testid="confirm-button"]')

// 6️⃣ LAST RESORT - By CSS Selector
this.page.locator('#submit-button')
this.page.locator('.login-form input[type="password"]')

// ❌ AVOID - Fragile selectors
this.page.locator('div > div > button:nth-child(3)')
this.page.locator('button.btn-primary[id*="submit"]')
this.page.locator('//button[@class="btn" and contains(text(), "Login")]')
```

### Selector Examples

```typescript
// ✅ GOOD - Maintainable
private emailField = this.page.getByLabel('Email');
private loginButton = this.page.getByRole('button', { name: /Login|Sign In/ });
private errorAlert = this.page.locator('[role="alert"]');
private tableRows = this.page.locator('table tbody tr');

// ❌ BAD - Brittle
private emailField = this.page.locator('input[name="email"][type="text"]');
private loginButton = this.page.locator('#login > button.primary.large');
private errorAlert = this.page.locator('div.alert.error.ng-show');
private tableRows = this.page.locator('table#data-table > tbody > tr');
```

---

## Error Handling & Logging

### Structured Error Handling

```typescript
import logger from '../logger/logger';

export class LoginPage extends BasePage {
    private usernameField = this.page.locator('#username');

    public async fillUsername(username: string): Promise<void> {
        try {
            await this.usernameField.waitFor({ state: 'visible', timeout: 5000 });
            await this.usernameField.fill(username);
            logger.info(`Username filled: ${username}`);
        } catch (error) {
            logger.error(`Failed to fill username: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw new Error(`Unable to fill username field. ${error}`);
        }
    }

    public async validateFormState(): Promise<void> {
        const isVisible = await this.usernameField.isVisible().catch(() => false);
        if (!isVisible) {
            logger.warn('Username field not visible, taking screenshot for debugging');
            await this.page.screenshot({ path: 'debug-screenshot.png' });
            throw new Error('Username field is not visible');
        }
    }
}
```

### Logging Standards

```typescript
// ✅ GOOD - Meaningful, informative
logger.info('User logged in successfully');
logger.warn('Element not visible after 5 seconds, retrying...');
logger.error('Failed to submit form: Network timeout');
logger.debug('Page URL: https://example.com/login');

// ❌ BAD - Vague, unhelpful
logger.info('Done');
logger.warn('Something went wrong');
logger.error('Error!');
logger.debug('x');
```

### Custom Error Messages

```typescript
// ✅ GOOD - Descriptive, actionable
if (!isVisible) {
    throw new Error(
        `Expected element [${selector}] to be visible within 5 seconds. ` +
        `Check if the page loaded correctly or if the selector is correct.`
    );
}

// ❌ BAD - Generic, unhelpful
if (!isVisible) {
    throw new Error('Element not found');
}
```

---

## Performance Optimization

### Timeout Management

```typescript
// ✅ GOOD - Appropriate timeouts
const DEFAULT_TIMEOUT = 5000;      // Quick checks
const WAIT_FOR_LOAD_TIMEOUT = 10000; // Page loads
const ELEMENT_TIMEOUT = 15000;      // Complex waits

public async waitForElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: ELEMENT_TIMEOUT });
}

public async navigateToPage(url: string): Promise<void> {
    await this.navigate(url);
    await this.page.waitForLoadState('networkidle', { timeout: WAIT_FOR_LOAD_TIMEOUT });
}

// ❌ BAD - No timeout management
await this.page.waitForSelector(selector); // Uses default (30000ms)
await this.page.goto(url); // Potentially hangs
```

### Parallel Execution Considerations

```typescript
// ✅ GOOD - Thread-safe, isolated
export class LoginPage extends BasePage {
    // Instance variables for isolated state
    private currentUser?: string;

    public async setCurrentUser(user: string): Promise<void> {
        this.currentUser = user;
    }
}

// ❌ BAD - Shared state (problematic with parallel execution)
let globalUser = 'testuser'; // Shared across tests

export class LoginPage extends BasePage {
    public async setGlobalUser(user: string): Promise<void> {
        globalUser = user; // Can cause race conditions
    }
}
```

### Efficient Element Waiting

```typescript
// ✅ GOOD - Specific waits
public async waitForAndClickButton(name: string): Promise<void> {
    const button = this.page.getByRole('button', { name });
    await button.waitFor({ state: 'visible' });
    await button.click();
}

// ❌ BAD - Generic, slow waits
public async waitForAndClickButton(selector: string): Promise<void> {
    await this.page.waitForSelector(selector, { timeout: 30000 });
    await this.page.click(selector);
}
```

---

## Code Review Checklist

Before submitting code, verify:

### Naming & Organization
- [ ] Files follow naming convention (LoginPage.ts, Login_Steps.ts)
- [ ] Locators are private
- [ ] Methods are organized (navigation, actions, assertions)
- [ ] No implementation details in step names

### Step Definitions
- [ ] Each step does one thing
- [ ] Steps delegate to page objects
- [ ] Consistent parameter usage
- [ ] Proper type hints (`: CucumberWorld`)

### Page Objects
- [ ] Extend BasePage
- [ ] All locators are private
- [ ] Methods have clear names (is*, get*, fill*)
- [ ] No hard-coded URLs
- [ ] Assertions are in separate methods

### Test Scenarios
- [ ] Clear, business-readable language
- [ ] Independent scenarios
- [ ] Proper Given/When/Then structure
- [ ] Edge cases covered
- [ ] No @ignore tags (unless intentional)

### Error Handling & Logging
- [ ] Try-catch blocks where needed
- [ ] Meaningful error messages
- [ ] Appropriate logging levels
- [ ] No console.log (use logger instead)

### Performance
- [ ] Reasonable timeouts (not 30000ms default)
- [ ] Efficient selectors (not nth-child)
- [ ] No unnecessary waits
- [ ] No hard-coded delays

---

## Anti-Patterns to Avoid

### 1. **Step Implementation Details**

```typescript
// ❌ BAD - Implementation detail in step
When('I click button with XPath //button[@id="login"]', ...);

// ✅ GOOD - Business language
When('I click the login button', ...);
```

### 2. **Test Data in Steps**

```typescript
// ❌ BAD - Hard-coded test data
When('I enter username "testuser123"', ...);

// ✅ GOOD - Parametrized
When('I enter username {string}', async function (username: string) {
    // Uses: When I enter username "testuser123"
});
```

### 3. **Brittle Selectors**

```typescript
// ❌ BAD - Breaks easily
const button = this.page.locator('body > div > div:nth-child(2) > button[id*="submit"]');

// ✅ GOOD - Maintainable
const button = this.page.getByRole('button', { name: 'Submit' });
```

### 4. **Mixed Concerns**

```typescript
// ❌ BAD - Step does both action and assertion
When('I login and should see dashboard', ...);

// ✅ GOOD - Separated
When('I login', ...);
Then('I should see dashboard', ...);
```

### 5. **Test Dependencies**

```typescript
// ❌ BAD - Scenario B depends on A
Scenario A: Create user
Scenario B: Login as user // Depends on A

// ✅ GOOD - Each scenario is independent
Background: Given I have a user account // Setup is in Background
Scenario A: Create additional user
Scenario B: Login with existing user
```

### 6. **Overly Complex Steps**

```typescript
// ❌ BAD - Too much in one step
When('I fill the entire form with valid data, submit it, and verify success', ...);

// ✅ GOOD - Broken down
When('I fill the form with valid data', ...);
And('I click the submit button', ...);
Then('I should see the success message', ...);
```

---

## Summary

Follow these standards to ensure:
- ✅ Maintainability - Easy to update when UI changes
- ✅ Readability - Anyone can understand tests
- ✅ Reusability - Steps and pages can be shared
- ✅ Reliability - Tests are stable and consistent
- ✅ Scalability - Framework grows with projects

---

**Last Updated**: December 30, 2025
