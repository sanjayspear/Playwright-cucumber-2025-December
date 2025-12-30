# Framework Q&A by Difficulty Level

A beginner-friendly guide to understanding the PW-Cucumber Framework through questions and answers, organized from simple to advanced. Perfect for newcomers to quickly grasp concepts and build their own frameworks.

---

## Table of Contents

- [Simple Questions](#simple-questions---beginner-level)
- [Medium Questions](#medium-questions---intermediate-level)
- [Advanced Questions](#advanced-questions---expert-level)

---

# Simple Questions - Beginner Level

Questions for those new to testing frameworks, with straightforward answers to build foundational understanding.

---

## Q1: What exactly is this framework?

**A:** The PW-Cucumber Framework is a **testing automation tool** that helps you write tests for websites automatically. Think of it like a robot that:
1. Opens a web browser
2. Clicks buttons
3. Fills forms
4. Checks if things work correctly

It combines three technologies:
- **Playwright** - Controls the browser
- **Cucumber** - Organizes tests in readable sentences
- **TypeScript** - Makes the code safer and easier to maintain

**Real-world analogy:** Like having a checklist for testing a website, but instead of a person doing it manually, a computer does it.

---

## Q2: Why would I need this framework instead of testing manually?

**A:** Manual testing gets tedious. Instead of clicking the same buttons 100 times, the framework does it for you automatically.

**Benefits:**
- **Speed** - Tests run in seconds, not hours
- **Reliability** - Same test runs identically every time
- **Coverage** - Test many scenarios without extra effort
- **Cost** - One setup, use forever
- **Confidence** - Know when something breaks immediately

**Example:** Testing login with 10 different usernames? Manual = 10 minutes. Automated = 10 seconds.

---

## Q3: Do I need to know programming to use this framework?

**A:** You need **basic** programming knowledge, not expert-level.

**What you need to know:**
- How to read code (understand structure)
- Basic JavaScript/TypeScript (variables, functions, loops)
- How to run commands in terminal

**What you DON'T need:**
- Advanced algorithms
- System design expertise
- Years of programming experience

**Good news:** You'll learn as you go! The documentation has many examples.

---

## Q4: What are the main files I need to understand?

**A:** There are three key file types:

### 1. **Feature Files** (.feature)
```gherkin
Scenario: User can login
    Given I navigate to login page
    When I enter username "john"
    And I enter password "pass123"
    Then I should see welcome message
```
**Purpose:** Written in plain English, describes what you're testing.

### 2. **Step Definition Files** (_Steps.ts)
```typescript
When('I enter username {string}', async function(username: string) {
    await this.loginPage.fillUsername(username);
});
```
**Purpose:** Implements what happens when a step runs.

### 3. **Page Object Files** (Page.ts)
```typescript
export class LoginPage extends BasePage {
    private usernameField = this.page.locator('#username');
    
    public async fillUsername(value: string): Promise<void> {
        await this.usernameField.fill(value);
    }
}
```
**Purpose:** Represents a page and what you can do on it.

**How they connect:**
```
Feature (what to test)
    ↓
Step Definition (how to test it)
    ↓
Page Object (where on the page)
    ↓
Browser (does the actual testing)
```

---

## Q5: What is "Gherkin" syntax?

**A:** Gherkin is plain English for writing tests. It uses specific keywords:

| Keyword | Means | Example |
|---------|-------|---------|
| **Given** | Setup/precondition | Given I'm on login page |
| **When** | Action/what I do | When I click login |
| **Then** | Verification/result | Then I see dashboard |
| **And** | Additional step | And I see welcome message |
| **But** | Negative step | But I don't see error |

**Why use it?**
- **Non-programmers can read it** - Business people understand tests
- **Clear structure** - Organize tests logically
- **Reusable** - Same steps work across tests

**Example:**
```gherkin
Scenario: User registration
    Given I navigate to signup page
    When I enter email "john@example.com"
    And I enter password "secure123"
    And I click register button
    Then I should see success message
    And my account should be created
```

---

## Q6: What is "Page Object Model"?

**A:** Page Object Model (POM) is a way to organize test code by grouping all actions for a page together.

**Without POM (bad):**
```typescript
// Scattered everywhere, hard to maintain
await page.locator('#username').fill('john');
await page.locator('#password').fill('pass');
await page.locator('button[name="login"]').click();
```

**With POM (good):**
```typescript
// All login page stuff in LoginPage.ts
await this.loginPage.fillUsername('john');
await this.loginPage.fillPassword('pass');
await this.loginPage.clickLogin();
```

**Benefits:**
- Easy to find page logic
- Changes in one place
- Reusable across tests
- Less code duplication

---

## Q7: How does Playwright work?

**A:** Playwright is a library that **controls a real web browser** programmatically.

**Simple explanation:**
```
Your Code → Playwright → Browser → Website → Results → Your Code
```

**What Playwright can do:**
- Open browsers (Chrome, Firefox, Safari)
- Navigate to URLs
- Click elements
- Fill forms
- Take screenshots
- Wait for elements
- Extract data

**Real example:**
```typescript
await page.goto('https://example.com');           // Open website
await page.locator('#username').fill('john');    // Fill input
await page.locator('button').click();             // Click button
const title = await page.title();                 // Get page title
```

---

## Q8: What is "TypeScript" and why use it instead of JavaScript?

**A:** TypeScript is **JavaScript with types** - it catches errors before running code.

**JavaScript (no types):**
```javascript
function add(a, b) {
    return a + b;
}
add(5, 'hello');  // ❌ This works but gives wrong result!
```

**TypeScript (with types):**
```typescript
function add(a: number, b: number): number {
    return a + b;
}
add(5, 'hello');  // ✅ Error caught before running!
```

**Benefits:**
- **Catch errors early** - Before tests run
- **Better autocompletion** - IDE knows what you can use
- **Self-documenting** - Code explains itself
- **Safer refactoring** - Know what breaks when you change code

---

## Q9: What is a "Hook" in testing?

**A:** Hooks are code that runs **before or after** tests.

**Types of hooks:**
```typescript
BeforeAll(() => {
    // Runs once, at the very beginning
    console.log('Starting entire test suite');
});

Before(() => {
    // Runs before EACH scenario
    // Good place to set up browser
    await initializeBrowser();
});

After(() => {
    // Runs after EACH scenario
    // Good place to close browser
    await closeBrowser();
});

AfterAll(() => {
    // Runs once, at the very end
    console.log('All tests finished');
});
```

**Real-world analogy:** Like preparing before a meal and cleaning after.

---

## Q10: How do I find the right element to click on?

**A:** You need a **locator** - a way to identify elements on the page.

**Methods (best to worst):**

### 1. **By Role** (BEST - most accessible)
```typescript
this.page.getByRole('button', { name: 'Login' })
```

### 2. **By Label** (good - semantic)
```typescript
this.page.getByLabel('Email')
```

### 3. **By Placeholder** (good)
```typescript
this.page.getByPlaceholder('Enter email')
```

### 4. **By Text** (acceptable)
```typescript
this.page.getByText('Click here')
```

### 5. **By Test ID** (acceptable)
```typescript
this.page.locator('[data-testid="submit-button"]')
```

### 6. **CSS Selector** (last resort)
```typescript
this.page.locator('#login-button')
```

**How to find:**
1. Open website in browser
2. Right-click element → Inspect
3. Look at HTML
4. Find `role`, `aria-label`, `name`, or `data-testid`
5. Use the best available

**Example:**
```html
<!-- In browser's Inspect view -->
<button role="button" aria-label="Login Button">
    Log In
</button>

<!-- In test code -->
this.page.getByRole('button', { name: 'Login' })
```

---

# Medium Questions - Intermediate Level

Questions about how to use the framework effectively, with explanations of patterns and practices.

---

## Q11: How do I structure a good test scenario?

**A:** Use the **Arrange-Act-Assert** pattern through Gherkin's Given-When-Then:

```gherkin
@smoke
Scenario: User can purchase product
    # ARRANGE - Set up the test
    Given I'm logged in as a customer
    And I have items in my cart
    
    # ACT - Perform the action
    When I proceed to checkout
    And I enter shipping address
    And I confirm payment
    
    # ASSERT - Verify the result
    Then I should see order confirmation
    And I should receive confirmation email
```

**Best practices:**
- **One outcome per scenario** - Test one thing
- **Clear names** - Anyone can understand
- **Independent** - No test depends on another
- **Fast** - Run quickly
- **Deterministic** - Same result every time

**Bad example:**
```gherkin
# ❌ TOO MUCH
Scenario: Everything works
    Given I navigate to page
    When I login and fill form and submit and wait
    Then everything works and emails sent and database updated
```

---

## Q12: How do I pass test data to steps?

**A:** Use **Scenario Outline with Examples**:

```gherkin
Scenario Outline: Login with various credentials
    When I enter username "<username>"
    And I enter password "<password>"
    Then I should see "<message>"
    
    Examples:
        | username | password  | message            |
        | john     | pass123   | Login successful   |
        | jane     | pass456   | Login successful   |
        | invalid  | wrongpass | Invalid credentials|
```

**This runs 3 times** with different data each time.

**In step definition:**
```typescript
When('I enter username {string}', async function(username: string) {
    // username = "john" (first run)
    // username = "jane" (second run)
    // username = "invalid" (third run)
    await this.loginPage.fillUsername(username);
});
```

**Why use it:**
- Test multiple scenarios with one code
- Easy to maintain
- Clear what data is tested
- Business-friendly

---

## Q13: How do I wait for elements properly?

**A:** **Always wait for elements** - don't assume they're instant.

```typescript
// ❌ BAD - No wait, might fail randomly
await this.page.locator('#submit').click();

// ✅ GOOD - Wait for element to appear
await this.page.locator('#submit').waitFor({ state: 'visible' });
await this.page.locator('#submit').click();

// ✅ BEST - Built-in wait and click
await this.page.locator('#submit').click();  // Playwright waits automatically
```

**Different wait scenarios:**

```typescript
// Wait for element to be visible
await element.waitFor({ state: 'visible', timeout: 5000 });

// Wait for page to load
await this.page.waitForLoadState('networkidle');

// Wait for specific URL
await this.page.waitForURL('/dashboard');

// Wait for function condition
await this.page.waitForFunction(() => {
    return document.querySelectorAll('.item').length > 0;
});
```

**Key principle:** **Always wait before interacting**, never assume instant response.

---

## Q14: How do I test forms effectively?

**A:** Create methods for form interactions:

```typescript
export class RegistrationPage extends BasePage {
    private firstNameField = this.page.locator('#firstName');
    private emailField = this.page.locator('#email');
    private submitButton = this.page.getByRole('button', { name: 'Register' });

    // Individual field methods
    public async fillFirstName(name: string): Promise<void> {
        await this.firstNameField.fill(name);
    }

    public async fillEmail(email: string): Promise<void> {
        await this.emailField.fill(email);
    }

    // Complete form method
    public async fillRegistrationForm(data: {
        firstName: string;
        email: string;
    }): Promise<void> {
        await this.fillFirstName(data.firstName);
        await this.fillEmail(data.email);
    }

    public async submitForm(): Promise<void> {
        await this.submitButton.click();
    }

    // Verification methods
    public async isSuccessMessageVisible(): Promise<boolean> {
        return await this.page.locator('.success').isVisible();
    }
}
```

**In your test:**
```typescript
When('I fill registration form', async function(this: CucumberWorld) {
    await this.registrationPage.fillRegistrationForm({
        firstName: 'John',
        email: 'john@example.com'
    });
    await this.registrationPage.submitForm();
});

Then('registration is successful', async function(this: CucumberWorld) {
    const success = await this.registrationPage.isSuccessMessageVisible();
    expect(success).toBe(true);
});
```

**Benefits:**
- Reuse form filling
- Easy to maintain
- Clear test intent
- Handle validation

---

## Q15: How should I organize my step definitions?

**A:** **One file per feature**, with logical grouping:

```
src/step-definitions/
├── LoginFeature_Steps.ts          # All login steps
├── RegistrationFeature_Steps.ts   # All registration steps
├── CheckoutFeature_Steps.ts       # All checkout steps
├── hooks/                         # Framework hooks
└── world/                         # Test context
```

**Inside each file, group by Given-When-Then:**

```typescript
import { Given, When, Then } from "@cucumber/cucumber";
import { CucumberWorld } from "./world/CucumberWorld";

// GIVEN - Setup steps
Given('I navigate to login page', async function(this: CucumberWorld) {
    await this.loginPage.navigateToLoginPage();
});

Given('I am logged in', async function(this: CucumberWorld) {
    await this.loginPage.login('user', 'pass');
});

// WHEN - Action steps
When('I click login button', async function(this: CucumberWorld) {
    await this.loginPage.clickLoginButton();
});

// THEN - Assertion steps
Then('I should see dashboard', async function(this: CucumberWorld) {
    const isVisible = await this.dashboardPage.isDashboardVisible();
    expect(isVisible).toBe(true);
});
```

**Benefits:**
- Easy to find steps
- Related steps together
- Clear organization
- Maintainable

---

## Q16: What is the "World" context?

**A:** The **World** is an object that **shares data between steps** during a scenario.

```typescript
// In CucumberWorld.ts
export class CucumberWorld extends World {
    public loginPage: LoginPage;
    public dashboardPage: DashboardPage;
    
    // Shared data
    private currentUser?: string;
    private testData?: any;
    
    // Getters and setters
    setCurrentUser(user: string) {
        this.currentUser = user;
    }
    
    getCurrentUser(): string {
        return this.currentUser || '';
    }
}
```

**Usage in steps:**

```typescript
Given('I login as {string}', async function(this: CucumberWorld, username: string) {
    // Save username for later
    this.setCurrentUser(username);
    await this.loginPage.login(username, 'password');
});

Then('I should see my profile', async function(this: CucumberWorld) {
    // Retrieve username from earlier
    const user = this.getCurrentUser();
    const profileName = await this.dashboardPage.getProfileName();
    expect(profileName).toContain(user);
});
```

**Why needed:**
- Pass data between steps
- Manage page objects
- Track test state
- Share setup data

---

## Q17: How do I handle errors and exceptions?

**A:** Use try-catch with meaningful error messages:

```typescript
public async fillUsername(username: string): Promise<void> {
    try {
        await this.usernameField.waitFor({ state: 'visible', timeout: 5000 });
        await this.usernameField.fill(username);
        logger.info(`Username filled: ${username}`);
    } catch (error) {
        logger.error(`Failed to fill username field: ${error}`);
        await this.page.screenshot({ path: 'error-screenshot.png' });
        throw new Error(`Unable to fill username. Check screenshot at error-screenshot.png`);
    }
}
```

**Best practices:**
- **Catch specific errors** - Not generic errors
- **Log meaningfully** - Help debugging
- **Take screenshots** - Capture state
- **Provide context** - Tell what was being done
- **Fail fast** - Don't continue if critical

---

## Q18: How do I share steps across different tests?

**A:** Create **generic, reusable steps**:

```typescript
// ✅ GENERIC - Works across many tests
Given('I navigate to {string}', async function(this: CucumberWorld, url: string) {
    await this.basePage.navigate(url);
});

When('I click {word} button', async function(this: CucumberWorld, buttonName: string) {
    await this.page.getByRole('button', { name: buttonName }).click();
});

Then('I should see {string}', async function(this: CucumberWorld, text: string) {
    const visible = await this.page.getByText(text).isVisible();
    expect(visible).toBe(true);
});

// ❌ SPECIFIC - Only works for login
Given('I navigate to login page', async function(this: CucumberWorld) {
    await this.loginPage.navigateToLoginPage();
});
```

**Tips for reusable steps:**
- Use parameters (`{string}`, `{word}`)
- Generic names
- Work with multiple page objects
- Single responsibility

---

## Q19: How do I run tests with specific tags?

**A:** Use **@tags** to organize and run specific tests:

```gherkin
@regression @critical
Feature: User Login

    @smoke
    Scenario: Login with valid credentials
        # This test runs in: smoke, regression, critical

    @wip
    Scenario: Remember me feature
        # This test runs in: wip

    @ignore
    Scenario: Old test not ready
        # This test NEVER runs
```

**Run specific tests:**

```bash
# Run smoke tests
npm run cucumber smoke

# Run regression tests
npm run cucumber regression

# Run critical tests
npm run cucumber critical

# Run tests with tag combination
npx cucumber-js --tags "@smoke and not @wip"

# Run everything except ignored
npm run cucumber regression  # @ignore is excluded by default
```

**Tag strategy:**
- `@smoke` - Quick validation tests
- `@regression` - Full test suite
- `@critical` - Important features
- `@wip` - Work in progress
- `@ignore` - Skip this test
- `@flaky` - Known unreliable tests

---

## Q20: How do I take screenshots for debugging?

**A:** Use Playwright's screenshot feature:

```typescript
// Manual screenshot
public async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
}

// In hooks - automatic on failure
After(async function(scenario) {
    if (scenario.result?.status === 'FAILED') {
        await this.basePage.page.screenshot({ 
            path: `screenshots/failure-${scenario.title}.png` 
        });
    }
});

// Usage in tests
When('I click problematic button', async function(this: CucumberWorld) {
    try {
        await this.basePage.page.screenshot({ path: 'before-click.png' });
        await this.page.locator('#button').click();
    } catch (error) {
        await this.basePage.page.screenshot({ path: 'error-click.png' });
        throw error;
    }
});
```

**Location:** Screenshots saved in `screenshots/` folder (create if needed)

---

# Advanced Questions - Expert Level

Questions about architecture, optimization, and building custom frameworks.

---

## Q21: How can I build my own framework like this one?

**A:** Follow these steps to create a similar framework:

### **Step 1: Choose Technologies**
```
Browser Automation: Playwright (or Selenium)
BDD Framework: Cucumber (or Jasmine/Jest)
Language: TypeScript (or JavaScript/Python)
```

### **Step 2: Set Up Project Structure**
```
src/
├── features/               # Gherkin files
├── step-definitions/       # Step implementations
│   ├── hooks/             # Lifecycle management
│   └── world/             # Test context
├── page-objects/
│   └── base/              # Base classes
├── utils/                 # Utilities
├── logger/                # Logging
└── index.ts               # Entry point
```

### **Step 3: Create Base Classes**

```typescript
// BasePage - Common browser actions
export class BasePage {
    constructor(protected page: Page) {}
    
    async navigate(url: string): Promise<void> {
        await this.page.goto(url);
    }
    
    async click(locator: Locator): Promise<void> {
        await locator.waitFor({ state: 'visible' });
        await locator.click();
    }
    
    // Add more common methods...
}

// PageManager - Factory pattern
export class PageManager {
    constructor(protected page: Page) {}
    
    createLoginPage(): LoginPage {
        return new LoginPage(this.page);
    }
    
    createDashboardPage(): DashboardPage {
        return new DashboardPage(this.page);
    }
}
```

### **Step 4: Create World Context**

```typescript
export class CucumberWorld extends World {
    public pageManager: PageManager;
    public loginPage: LoginPage;
    
    constructor(options: IWorldOptions) {
        super(options);
        this.pageManager = new PageManager(page);
        this.loginPage = this.pageManager.createLoginPage();
    }
}

setWorldConstructor(CucumberWorld);
```

### **Step 5: Set Up Hooks**

```typescript
BeforeAll(async () => {
    // Initialize browser
});

Before(async function() {
    // Setup before each scenario
});

After(async function(scenario) {
    if (scenario.result?.status === 'FAILED') {
        // Take screenshot
    }
    // Cleanup
});

AfterAll(async () => {
    // Close browser
});
```

### **Step 6: Configuration**

```typescript
// cucumber.js configuration
module.exports = {
    requireModule: ['ts-node/register'],
    require: ['src/step-definitions/**/*.ts'],
    format: ['html:reports/report.html', 'json:reports/report.json'],
    parallel: 4,
    retry: 1,
    tags: 'not @ignore'
};
```

### **Step 7: Package.json Scripts**

```json
{
    "scripts": {
        "test": "cucumber-js",
        "test:smoke": "cucumber-js --tags @smoke",
        "test:watch": "cucumber-js --watch"
    },
    "devDependencies": {
        "@cucumber/cucumber": "^12.0.0",
        "@playwright/test": "^1.40.0",
        "typescript": "^5.0.0"
    }
}
```

**Key principles:**
- **Separation of concerns** - Each class has one job
- **DRY** - Don't Repeat Yourself
- **Factory pattern** - Create objects uniformly
- **Dependency injection** - Pass dependencies in
- **Hooks** - Lifecycle management

---

## Q22: How do I optimize test execution speed?

**A:** Several strategies to make tests faster:

### **1. Parallel Execution**
```typescript
// cucumber.js or in npm script
--parallel 4  // Run 4 tests simultaneously

// In .env
PARALLEL=4
```

### **2. Reduce Timeouts**
```typescript
// Only wait what's necessary
const SHORT_TIMEOUT = 2000;        // Quick checks
const MEDIUM_TIMEOUT = 5000;       // Normal waits
const LONG_TIMEOUT = 15000;        // Heavy operations

await element.waitFor({ timeout: SHORT_TIMEOUT });
```

### **3. Avoid Unnecessary Waits**
```typescript
// ❌ SLOW - Waits full timeout even if found instantly
await page.waitForTimeout(5000);
await element.click();

// ✅ FAST - Only waits if needed
await element.waitFor();
await element.click();
```

### **4. Headless Mode (Faster)**
```bash
HEADLESS=true npm run cucumber smoke
# vs
HEADLESS=false npm run cucumber smoke
```

### **5. Use Lightweight Browser**
```bash
# Chromium is typically fastest
UI_AUTOMATION_BROWSER=chromium npm run cucumber
```

### **6. Selective Test Running**
```bash
# Run only smoke tests first
npm run cucumber smoke

# Instead of running everything
npm run cucumber regression
```

### **7. Mock External Calls**
```typescript
// Don't wait for actual API calls
await page.route('**/api/users', route => {
    route.abort();
});
```

**Performance metrics:**
- Sequential: 100 tests × 30 seconds = 50 minutes
- Parallel (4): 100 tests ÷ 4 = ~12 minutes = 4x faster

---

## Q23: How do I implement custom assertions?

**A:** Create assertion helper methods:

```typescript
// In page object
public async assertUserIsLoggedIn(): Promise<void> {
    const profileVisible = await this.page
        .locator('[data-testid="user-profile"]')
        .isVisible();
    
    if (!profileVisible) {
        throw new Error('User profile not visible - user not logged in');
    }
}

// Or create custom assertion class
export class AssertionHelper {
    constructor(private page: Page) {}
    
    async assertElementContainsText(
        locator: Locator, 
        expectedText: string
    ): Promise<void> {
        const text = await locator.textContent();
        
        if (!text?.includes(expectedText)) {
            throw new Error(
                `Expected element to contain "${expectedText}" but found "${text}"`
            );
        }
    }
    
    async assertTableRowCount(tableSelector: string, count: number): Promise<void> {
        const rows = await this.page
            .locator(`${tableSelector} tbody tr`)
            .count();
        
        if (rows !== count) {
            throw new Error(
                `Expected ${count} table rows but found ${rows}`
            );
        }
    }
}

// Usage
Then('I assert user is logged in', async function(this: CucumberWorld) {
    await this.dashboardPage.assertUserIsLoggedIn();
});
```

**Benefits:**
- Clearer intent
- Reusable assertions
- Better error messages
- Maintainable code

---

## Q24: How do I handle API mocking/stubbing?

**A:** Use Playwright's route interception:

```typescript
export class MockingHelper {
    constructor(private page: Page) {}
    
    // Mock successful API response
    async mockApiCall(
        urlPattern: string,
        responseData: any
    ): Promise<void> {
        await this.page.route(urlPattern, route => {
            route.abort('blockedbyclient');
        });
        
        // Or return mock data
        await this.page.route(urlPattern, route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(responseData)
            });
        });
    }
    
    // Mock API error
    async mockApiError(urlPattern: string, status: number): Promise<void> {
        await this.page.route(urlPattern, route => {
            route.fulfill({
                status: status,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Mocked error' })
            });
        });
    }
    
    // Verify API was called
    async verifyApiCalled(urlPattern: string): Promise<boolean> {
        return new Promise((resolve) => {
            this.page.once('response', response => {
                if (response.url().includes(urlPattern)) {
                    resolve(true);
                }
            });
        });
    }
}
```

**Usage:**
```typescript
Before(async function(this: CucumberWorld) {
    // Mock user API
    await this.mockingHelper.mockApiCall(
        '**/api/users/**',
        { id: 1, name: 'John' }
    );
});
```

---

## Q25: How do I structure tests for maintainability?

**A:** Follow these architectural principles:

### **1. Single Responsibility**
```typescript
// ✅ GOOD - One responsibility each
export class LoginPage extends BasePage {
    async fillUsername(value: string): Promise<void> { /* */ }
    async fillPassword(value: string): Promise<void> { /* */ }
    async clickLogin(): Promise<void> { /* */ }
}

// ❌ BAD - Multiple responsibilities
export class LoginPage extends BasePage {
    async performCompleteLogin(user: string, pass: string): Promise<void> {
        // Does 3 things at once
    }
}
```

### **2. Dependency Injection**
```typescript
// ✅ GOOD - Dependencies passed in
export class PageManager {
    constructor(private page: Page) {}
    
    createLoginPage(): LoginPage {
        return new LoginPage(this.page);
    }
}

// ❌ BAD - Hard-coded dependencies
export class LoginPage {
    private page = global.page;  // Can't test independently
}
```

### **3. Separation of Concerns**
```
Concerns:
├── Locators (how to find elements)
├── Actions (what to do)
├── Assertions (what to verify)
└── Navigation (moving between pages)

Each in its own method.
```

### **4. DRY Principle (Don't Repeat Yourself)**
```typescript
// ✅ REUSABLE
public async fillField(fieldId: string, value: string): Promise<void> {
    await this.page.locator(`#${fieldId}`).fill(value);
}

// Usage multiple times
await this.fillField('email', 'john@example.com');
await this.fillField('username', 'john');

// ❌ REPETITIVE
await this.page.locator('#email').fill('john@example.com');
await this.page.locator('#username').fill('john');
```

### **5. Composition Over Inheritance**
```typescript
// ✅ FLEXIBLE - Mix and match
export class LoginPage extends BasePage {
    private locators = new LocatorHelper(this.page);
    private assertions = new AssertionHelper(this.page);
    private actions = new ActionHelper(this.page);
}

// ❌ RIGID - Deep inheritance chain
export class LoginPage extends BasePage
    extends CommonPage
    extends UiPage
    extends ...
```

---

## Q26: How do I handle different environments (dev, staging, prod)?

**A:** Use environment configuration:

```typescript
// env/.env.dev
BASE_URL=https://dev.example.com
API_URL=https://api-dev.example.com
DATABASE_URL=dev_db

// env/.env.staging
BASE_URL=https://staging.example.com
API_URL=https://api-staging.example.com
DATABASE_URL=staging_db

// env/.env.production
BASE_URL=https://example.com
API_URL=https://api.example.com
DATABASE_URL=prod_db
```

**Load environment file:**
```typescript
import dotenv from 'dotenv';

const environment = process.env.ENV || 'dev';
dotenv.config({ path: `./env/.env.${environment}` });

// Usage
const baseUrl = process.env.BASE_URL;
```

**Run with specific environment:**
```bash
ENV=dev npm run cucumber smoke
ENV=staging npm run cucumber regression
ENV=production npm run cucumber smoke
```

**In CI/CD:**
```yaml
# GitHub Actions example
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: ENV=staging npm run cucumber smoke
      - run: ENV=production npm run cucumber smoke
```

---

## Q27: How do I implement custom reporting?

**A:** Process Cucumber's JSON report:

```typescript
import * as fs from 'fs';
import * as path from 'path';

export class ReportGenerator {
    generateCustomReport(): void {
        const reportPath = path.join(__dirname, '../reports/report.json');
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        let passed = 0;
        let failed = 0;
        let skipped = 0;
        
        report.forEach((feature: any) => {
            feature.elements.forEach((scenario: any) => {
                const steps = scenario.steps;
                const allPassed = steps.every((s: any) => s.result.status === 'passed');
                
                if (allPassed) passed++;
                else failed++;
            });
        });
        
        const summary = {
            total: passed + failed,
            passed,
            failed,
            passRate: ((passed / (passed + failed)) * 100).toFixed(2) + '%',
            timestamp: new Date().toISOString()
        };
        
        fs.writeFileSync(
            path.join(__dirname, '../reports/summary.json'),
            JSON.stringify(summary, null, 2)
        );
    }
}

// Run after tests
AfterAll(() => {
    new ReportGenerator().generateCustomReport();
});
```

**Custom HTML report:**
```typescript
export class HtmlReportGenerator {
    generateHtmlReport(summary: any): void {
        const html = `
            <html>
                <head><title>Test Report</title></head>
                <body>
                    <h1>Test Report</h1>
                    <p>Total Tests: ${summary.total}</p>
                    <p>Passed: ${summary.passed}</p>
                    <p>Failed: ${summary.failed}</p>
                    <p>Pass Rate: ${summary.passRate}</p>
                </body>
            </html>
        `;
        
        fs.writeFileSync('reports/custom-report.html', html);
    }
}
```

---

## Q28: How do I implement retry logic for flaky tests?

**A:** Add retry mechanism at different levels:

### **1. Cucumber Level**
```bash
# Built-in retry
npx cucumber-js --retry 2
# Retries failed scenarios 2 times
```

### **2. Step Level**
```typescript
async function retryStep(
    action: () => Promise<void>,
    maxRetries: number = 3
): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            await action();
            return;
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await page.waitForTimeout(1000 * (i + 1));  // Exponential backoff
        }
    }
}

// Usage
When('I click unreliable button', async function(this: CucumberWorld) {
    await retryStep(async () => {
        await this.page.locator('#unreliable-btn').click();
    });
});
```

### **3. Assertion Level**
```typescript
async function assertWithRetry(
    assertion: () => Promise<void>,
    maxRetries: number = 5
): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            await assertion();
            return;
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await page.waitForTimeout(500);
        }
    }
}

// Usage
Then('element eventually contains text', async function(this: CucumberWorld) {
    await assertWithRetry(async () => {
        const text = await this.page.locator('#element').textContent();
        expect(text).toContain('expected');
    });
});
```

---

## Q29: How do I scale tests for large teams?

**A:** Implement proper practices:

### **1. Test Organization**
```
tests/
├── integration/          # Full workflow tests
├── unit/                # Single component tests
├── smoke/               # Quick checks
└── regression/          # Comprehensive suite
```

### **2. CI/CD Integration**
```yaml
# Run tests on pull request
name: Test
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run test:smoke
      - run: npm run test:regression
```

### **3. Test Sharding**
```bash
# Run different tests on different machines
# Machine 1
npx cucumber-js --parallel 4

# Machine 2
npx cucumber-js --parallel 4

# Reduces total time from 1 hour to 15 minutes
```

### **4. Code Review Process**
```
Pull Request → Code Review
    ↓
    Check for:
    - Single responsibility
    - No test duplication
    - Proper naming
    - Uses page objects
    - No hard-coded values
    ↓
Approved → Merge → Run Full Suite
```

### **5. Documentation**
- Keep STANDARDS.md updated
- Document common patterns
- Share example tests
- Regular team training

---

## Q30: What are common anti-patterns to avoid?

**A:** Learn what NOT to do:

### **❌ Anti-Pattern 1: Test Interdependence**
```typescript
// WRONG - Test B depends on Test A
Scenario A: Create user
    // Creates user "john"

Scenario B: Login as user
    // Uses "john" created in Scenario A ← FRAGILE
```

**Solution:** Each test should be independent.

### **❌ Anti-Pattern 2: Hard-Coded Values**
```typescript
// WRONG - Hard-coded email
await this.page.locator('#email').fill('john@example.com');

// RIGHT - Parametrized
When('I enter email {string}', async function(email: string) {
    await this.page.locator('#email').fill(email);
});
```

### **❌ Anti-Pattern 3: Brittle Selectors**
```typescript
// WRONG - Too specific
this.page.locator('div > div > button:nth-child(3)')

// RIGHT - Semantic
this.page.getByRole('button', { name: 'Login' })
```

### **❌ Anti-Pattern 4: Tests Testing Tests**
```typescript
// WRONG - Test verifies test code, not app
Scenario: My step works
    When I call my function
    Then my function returns true
```

**Solution:** Test application behavior, not code.

### **❌ Anti-Pattern 5: Too Much in One Test**
```typescript
// WRONG - Too many assertions
Scenario: Everything
    Given I do A
    And I do B
    And I do C
    Then result is X
    And result is Y
    And result is Z

// RIGHT - One outcome per test
Scenario: A works
    Given setup
    When A
    Then result is X

Scenario: B works
    Given setup
    When B
    Then result is Y
```

---

## Q31: How do I troubleshoot failing tests?

**A:** Systematic debugging approach:

### **Step 1: Run in Headed Mode**
```bash
HEADLESS=false npm run cucumber smoke
# See what the browser is doing
```

### **Step 2: Take Screenshots**
```typescript
await this.page.screenshot({ path: 'debug.png' });
```

### **Step 3: Add Logging**
```typescript
import logger from '../logger/logger';

logger.info('Before clicking button');
await this.button.click();
logger.info('After clicking button');
```

### **Step 4: Use Browser DevTools**
```typescript
// Pause execution and open DevTools
await this.page.pause();
```

### **Step 5: Check Selectors**
```typescript
// Verify element exists
const element = await this.page.locator('#myElement');
const isVisible = await element.isVisible();
console.log('Element visible:', isVisible);
```

### **Step 6: Review Test Reports**
```
Check:
├── reports/report.html      ← Visual overview
├── reports/report.json      ← Detailed data
├── screenshots/             ← Failure screenshots
└── logs/                    ← Application logs
```

### **Step 7: Isolate the Problem**
```bash
# Run just the failing test
npx cucumber-js src/features/YourFeature.feature:15

# Run with debug logging
LOG_LEVEL=debug npm run cucumber smoke
```

---

## Q32: What's the learning path to master this framework?

**A:** Structured learning progression:

### **Week 1: Fundamentals (4-6 hours)**
- [ ] Understand Gherkin syntax
- [ ] Write first feature file
- [ ] Implement first step definition
- [ ] Run first test

### **Week 2: Page Objects (4-6 hours)**
- [ ] Understand POM pattern
- [ ] Create first page object
- [ ] Use page objects in steps
- [ ] Manage locators

### **Week 3: Advanced Features (4-6 hours)**
- [ ] Data-driven tests (Scenario Outline)
- [ ] Assertions and verification
- [ ] Form filling and validation
- [ ] Browser events

### **Week 4: Framework Mastery (4-6 hours)**
- [ ] Hooks and lifecycle
- [ ] World context and sharing
- [ ] Custom utilities
- [ ] Error handling

### **Week 5: Architecture (4-6 hours)**
- [ ] Best practices
- [ ] Code organization
- [ ] Design patterns
- [ ] Performance optimization

### **Month 2: Real Projects**
- Write tests for real applications
- Contribute to team projects
- Code reviews and feedback
- Mentor other developers

**Key resources:**
1. Read DOCUMENTATION.md
2. Follow DEVELOPER_GUIDE.md examples
3. Reference STANDARDS.md
4. Review existing tests
5. Practice with real projects

---

## Q33: How do I migrate tests from another framework?

**A:** Process to convert existing tests:

### **Step 1: Map Old Structure to New**
```
Old Framework          → New Framework
Selenium              → Playwright
JUnit/TestNG          → Cucumber
Page Factory          → Page Object Model
Assertions            → Expect (from Playwright)
```

### **Step 2: Convert Test Cases to Gherkin**
```
Old (Java):
@Test
public void testLogin() {
    driver.get(url);
    driver.findElement(By.id("username")).sendKeys("john");
    driver.findElement(By.id("password")).sendKeys("pass");
    driver.findElement(By.id("login")).click();
    Assert.assertTrue(driver.findElement(By.id("dashboard")).isDisplayed());
}

New (Gherkin):
Scenario: User can login
    Given I navigate to login page
    When I enter username "john"
    And I enter password "pass"
    And I click login button
    Then I should see dashboard
```

### **Step 3: Implement Steps**
```typescript
// Implement each step in step definitions
Given('I navigate to login page', async function(this: CucumberWorld) {
    await this.loginPage.navigateToLoginPage();
});

When('I enter username {string}', async function(this: CucumberWorld, username: string) {
    await this.loginPage.fillUsername(username);
});

// ... etc
```

### **Step 4: Create Page Objects**
```typescript
// Migrate old Page Factory classes to new POM
export class LoginPage extends BasePage {
    private usernameField = this.page.locator('#username');
    private passwordField = this.page.locator('#password');
    private loginButton = this.page.locator('#login');
    
    public async fillUsername(value: string): Promise<void> {
        await this.usernameField.fill(value);
    }
    
    // ... etc
}
```

### **Step 5: Test and Validate**
```bash
npm install
npm run cucumber smoke
# Verify tests pass
```

---

---

## Summary: Quick Reference

### For Building Your Own Framework:

1. **Choose tech stack** - BDD tool, browser automation, language
2. **Create structure** - Features, steps, pages, hooks
3. **Build base classes** - BasePage, PageManager
4. **Implement hooks** - Before, after, error handling
5. **Add utilities** - Logging, assertions, helpers
6. **Write documentation** - How to use your framework
7. **Test thoroughly** - With real examples
8. **Share with team** - Training and guidelines

### Key Principles:

- ✅ **DRY** - Don't repeat yourself
- ✅ **SOLID** - Single responsibility, Open/closed, etc.
- ✅ **Clear naming** - Everyone understands
- ✅ **Separation of concerns** - Each class has one job
- ✅ **Dependency injection** - Pass dependencies in
- ✅ **Error handling** - Meaningful messages
- ✅ **Documentation** - How to use it
- ✅ **Maintainability** - Easy to change

### Success Checklist:

- [ ] Tests run reliably
- [ ] Easy to add new tests
- [ ] Team understands structure
- [ ] Good error messages
- [ ] Performance is acceptable
- [ ] Documentation is complete
- [ ] Code follows standards
- [ ] Scalable to large projects

---

**Document Created:** December 30, 2025  
**Status:** ✅ Complete & Ready  
**Difficulty Levels:** Simple, Medium, Advanced  
**Questions Covered:** 33 comprehensive Q&As  

This guide provides everything newcomers need to understand the framework and build similar ones!
