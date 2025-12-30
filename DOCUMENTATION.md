# PW-Cucumber Framework - Comprehensive Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Setup & Installation](#setup--installation)
5. [Configuration](#configuration)
6. [Writing Tests](#writing-tests)
7. [Running Tests](#running-tests)
8. [Framework Architecture](#framework-architecture)
9. [Best Practices & Standards](#best-practices--standards)
10. [Troubleshooting](#troubleshooting)

---

## Project Overview

**PW-Cucumber Framework** is a modern, TypeScript-based Behavior-Driven Development (BDD) testing framework that combines:
- **Playwright**: For browser automation
- **Cucumber**: For BDD-style test scenarios
- **Page Object Model (POM)**: For maintainable test structure

This framework is designed for automating web application testing with clear, readable test scenarios that bridge technical and non-technical stakeholders.

### Key Features
- ✅ BDD-style testing with Gherkin syntax
- ✅ Page Object Model pattern for code organization
- ✅ Cross-browser testing support (Chromium, Firefox, WebKit)
- ✅ Tag-based test execution
- ✅ Parallel test execution
- ✅ HTML & JSON reporting
- ✅ Comprehensive logging with Winston
- ✅ Environment-based configuration
- ✅ TypeScript for type safety

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Playwright | ^1.57.0 | Browser automation library |
| Cucumber | ^12.4.0 | BDD test framework |
| TypeScript | (via ts-node) | Language & type safety |
| Winston | ^3.19.0 | Logging library |
| Faker | ^9.9.0 | Test data generation |
| dotenv | ^17.2.3 | Environment variable management |
| Node.js | Latest LTS | Runtime environment |

---

## Project Structure

```
PW-cucumber-Framework/
├── src/
│   ├── features/                 # Gherkin feature files
│   │   ├── Contact_Us.feature
│   │   └── Login.feature
│   │
│   ├── step-definitions/         # Step implementation files
│   │   ├── Base_Steps.ts         # Shared/base step definitions
│   │   ├── ContactUs_Steps.ts    # Contact Us feature steps
│   │   ├── Homepage_Steps.ts     # Homepage feature steps
│   │   ├── Login_Steps.ts        # Login feature steps
│   │   ├── hooks/
│   │   │   ├── hooks.ts          # Before/After hooks
│   │   │   └── browserContextFixture.ts  # Browser context management
│   │   └── world/
│   │       └── CucumberWorld.ts  # Cucumber world context
│   │
│   ├── page-objects/             # Page Object Model classes
│   │   ├── base/
│   │   │   ├── BasePage.ts       # Base class for all pages
│   │   │   └── PageManager.ts    # Factory pattern for page creation
│   │   ├── ContactUsPage.ts      # Contact Us page object
│   │   ├── HomePage.ts           # Home page object
│   │   └── LoginPage.ts          # Login page object
│   │
│   ├── utils/
│   │   ├── cucumber-timeout.ts   # Cucumber timeout configuration
│   │   └── playwright-timeouts.ts # Playwright timeout settings
│   │
│   ├── logger/
│   │   └── logger.ts             # Winston logger configuration
│   │
│   └── index.ts                  # Main entry point for test execution
│
├── env/
│   └── .env                      # Environment variables (create this file)
│
├── reports/                      # Test execution reports
│   ├── report.html              # HTML report
│   └── report.json              # JSON report
│
├── playwright.config.ts          # Playwright configuration
├── package.json                  # NPM dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project readme

```

---

## Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation Steps

1. **Clone/Download the project**
   ```bash
   cd PW-cucumber-Framework
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the `env/` directory with the following variables:
   ```
   # Browser Configuration
   UI_AUTOMATION_BROWSER=chromium
   HEADLESS=true
   BROWSER_WIDTH=1920
   BROWSER_HEIGHT=1080
   
   # Logging
   LOG_LEVEL=info
   
   # Test Execution
   PARALLEL=1
   RETRY=0
   
   # Application URLs
   BASE_URL=https://www.webdriveruniversity.com
   CONTACT_US_URL=https://www.webdriveruniversity.com/contact-us.html
   LOGIN_URL=https://www.webdriveruniversity.com/login-portal/index.html
   ```

4. **Verify installation**
   ```bash
   npm run cucumber smoke
   ```

---

## Configuration

### Environment Variables (.env)

| Variable | Options | Default | Description |
|----------|---------|---------|-------------|
| `UI_AUTOMATION_BROWSER` | chromium, firefox, webkit | chromium | Browser to run tests |
| `HEADLESS` | true, false | true | Run browser in headless mode |
| `BROWSER_WIDTH` | number | 1920 | Browser viewport width |
| `BROWSER_HEIGHT` | number | 1080 | Browser viewport height |
| `LOG_LEVEL` | error, warn, info, debug | info | Logging verbosity level |
| `PARALLEL` | number | 1 | Number of parallel workers |
| `RETRY` | number | 0 | Retry failed scenarios |
| `BASE_URL` | URL | - | Application base URL |

### Playwright Configuration

Edit `playwright.config.ts` to customize:
- Test directory and file patterns
- Parallel execution settings
- Retry policies
- Reporter format
- Device/browser configurations
- Trace settings

### Cucumber Timeout Configuration

Adjust timeouts in `src/utils/cucumber-timeout.ts`:
- Default step timeout
- Hook timeout
- Screenshot capture on failure

---

## Writing Tests

### 1. Creating Feature Files

Create a new `.feature` file in `src/features/` with Gherkin syntax:

```gherkin
@regression @myFeature
Feature: User Authentication

    Background:
        Given I navigate to the application homepage

    @smoke @critical
    Scenario: Successful login with valid credentials
        When I navigate to the login portal
        And I enter username "testuser"
        And I enter password "password123"
        And I click the login button
        Then I should see the dashboard
        And I should see the welcome message containing "Welcome, testuser"

    @smoke @critical
    Scenario Outline: Multiple login attempts
        When I enter username "<username>"
        And I enter password "<password>"
        Then I should see the message "<expectedMessage>"

        Examples:
            | username  | password     | expectedMessage    |
            | user1     | pass123      | Login successful   |
            | user2     | wrongpass    | Invalid credentials |
```

### 2. Creating Step Definitions

Create step definition files in `src/step-definitions/`:

```typescript
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CucumberWorld } from "./world/CucumberWorld";

Given('I navigate to the login portal', async function (this: CucumberWorld) {
    await this.loginPage.navigateToLoginPage();
});

When('I enter username {string}', async function (this: CucumberWorld, username: string) {
    await this.loginPage.fillUsername(username);
});

When('I enter password {string}', async function (this: CucumberWorld, password: string) {
    await this.loginPage.fillPassword(password);
});

When('I click the login button', async function (this: CucumberWorld) {
    await this.loginPage.clickOnLoginButton();
});

Then('I should see the dashboard', async function (this: CucumberWorld) {
    const isDashboardVisible = await this.homePage.isDashboardVisible();
    expect(isDashboardVisible).toBe(true);
});
```

**Important**: Steps must have matching signatures with parameters in the step definition matching the Gherkin step.

### 3. Creating Page Objects

Create page objects in `src/page-objects/`:

```typescript
import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base/BasePage";

export class LoginPage extends BasePage {
    // Define locators
    private usernameInput: Locator = this.page.locator('#username');
    private passwordInput: Locator = this.page.locator('#password');
    private loginButton: Locator = this.page.locator('#login-button');

    // Define methods
    public async navigateToLoginPage(): Promise<void> {
        await this.navigate('https://www.webdriveruniversity.com/login-portal/index.html');
    }

    public async fillUsername(username: string): Promise<void> {
        await this.usernameInput.fill(username);
    }

    public async fillPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    public async clickOnLoginButton(): Promise<void> {
        await this.waitAndClick(this.loginButton);
    }

    public async getAlertMessage(): Promise<string | null> {
        return await this.page.evaluate(() => {
            return window.prompt ? 'Alert present' : null;
        });
    }
}
```

### 4. Using BasePage Methods

The `BasePage` class provides common utility methods:

```typescript
// Navigation
await this.navigate(url);

// Clicking
await this.waitAndClick(locator);
await this.waitAndClickSelector(selector);
await this.waitAndClickByRole(role, name);

// Switching tabs/windows
await this.switchToNewTab();

// Input
await locator.fill(value);
await locator.type(value);

// Assertions (use @playwright/test)
expect(element).toBeVisible();
expect(element).toHaveText('Expected Text');
```

### 5. Accessing Data in Steps

The `CucumberWorld` class provides context sharing:

```typescript
// Setting data
this.setUrl('https://example.com');
this.setFirstName('John');
this.setLastName('Doe');
this.setEmailAddress('john@example.com');

// Getting data
const url = this.getUrl();
const firstName = this.getFirstName();
const lastName = this.getLastName();
const email = this.getEmailAddress();

// Page objects
this.loginPage.fillUsername('testuser');
this.homePage.verifyDashboard();
this.contactUsPage.submitForm();
```

---

## Running Tests

### Command Syntax

```bash
npm run cucumber [tag]
```

### Available Test Tags

| Tag | Command | Description |
|-----|---------|-------------|
| smoke | `npm run cucumber smoke` | Quick smoke tests |
| regression | `npm run cucumber regression` | Full regression suite |
| login | `npm run cucumber login` | Login feature tests |
| contactUs | `npm run cucumber contactUs` | Contact Us feature tests |

### Examples

```bash
# Run smoke tests
npm run cucumber smoke

# Run regression tests
npm run cucumber regression

# Run login tests
npm run cucumber login

# Run contact us tests
npm run cucumber contactUs

# Run all tests (no tag parameter)
npx cucumber-js
```

### Using Environment Variables

Configure execution behavior via `.env` file:

```bash
# Run with parallel execution
PARALLEL=4 npm run cucumber smoke

# Run with retries
RETRY=2 npm run cucumber regression

# Run in Firefox headful mode
UI_AUTOMATION_BROWSER=firefox HEADLESS=false npm run cucumber login
```

### Ignoring Tests

Use the `@ignore` tag to skip scenarios:

```gherkin
@ignore
Scenario: Scenario under development
    ...
```

All scenarios with `@ignore` are automatically excluded from execution.

---

## Framework Architecture

### 1. BDD Architecture (Gherkin → TypeScript)

```
Feature File (.feature)
    ↓
Cucumber Parser
    ↓
Step Definitions (Cucumber Steps)
    ↓
Page Objects (User interactions)
    ↓
Playwright (Browser automation)
    ↓
WebApplication
```

### 2. Dependency Injection & World Context

The `CucumberWorld` class serves as the dependency container:

```typescript
export class CucumberWorld extends World {
    public pageManager: PageManager;
    public basePage: BasePage;
    public homePage: HomePage;
    public contactUsPage: ContactUsPage;
    public loginPage: LoginPage;

    constructor({ attach, log, link, parameters }: IWorldOptions) {
        super({ attach, log, link, parameters });
        this.pageManager = new PageManager();
        this.basePage = this.pageManager.createBasePage();
        this.homePage = this.pageManager.createHomePage();
        // ... initialize other pages
    }
}
```

### 3. Page Object Model Pattern

```
BasePage (Abstract)
    ├── HomePage
    ├── LoginPage
    └── ContactUsPage
    
Each page contains:
- Locators (Selectors)
- Methods (User actions)
- Assertions (Verifications)
```

### 4. Hook Lifecycle

```
BeforeAll
    ↓
BeforeEach Scenario
    ├── Initialize Browser
    ├── Create Page Context
    ├── Set Viewport Size
    └── Set Timeouts
    ↓
Execute Scenario Steps
    ↓
AfterEach Scenario
    ├── Screenshot on failure
    ├── Close Page
    └── Close Context
    ↓
AfterAll
    └── Close Browser
```

### 5. Hooks Implementation

Hooks are defined in `src/step-definitions/hooks/hooks.ts`:

```typescript
// Before all scenarios
BeforeAll(async function () {
    // Initialize browser instance
});

// Before each scenario
Before(async function () {
    // Create new page context
    // Set viewport size
    // Configure timeouts
});

// After each scenario
After(async function (scenario) {
    // Capture screenshot on failure
    if (scenario.result?.status === Status.FAILED) {
        // Take screenshot
    }
    // Close page
    // Close context
});

// After all scenarios
AfterAll(async function () {
    // Close browser
});
```

---

## Best Practices & Standards

### 1. Naming Conventions

**Feature Files**
```
✅ Contact_Us.feature
✅ Login.feature
❌ contact_us_test.feature
❌ feature.feature
```

**Step Definitions**
```
✅ Login_Steps.ts
✅ ContactUs_Steps.ts
❌ steps.ts
❌ login_step_definitions.ts
```

**Page Objects**
```
✅ LoginPage.ts
✅ ContactUsPage.ts
❌ login_page.ts
❌ Page_Login.ts
```

### 2. Locator Strategy Priority

1. **Role-based** (Most accessible)
   ```typescript
   this.page.getByRole('button', { name: 'Login' })
   ```

2. **Label-based**
   ```typescript
   this.page.getByLabel('Username')
   ```

3. **Placeholder-based**
   ```typescript
   this.page.getByPlaceholder('Enter username')
   ```

4. **Text-based**
   ```typescript
   this.page.getByText('Exact Text')
   ```

5. **CSS Selectors** (Last resort)
   ```typescript
   this.page.locator('#username')
   ```

### 3. Step Definition Standards

✅ **Do's**
```typescript
// Use action-oriented language
When('I click the login button', ...)

// Use {string} for quoted values
When('I enter username {string}', ...)

// Use {word} for single words
When('I select {word} from dropdown', ...)

// Keep steps generic and reusable
Given('I navigate to the login page', ...)
```

❌ **Don'ts**
```typescript
// Avoid implementation details
When('I click the button with id login-button', ...)

// Avoid concatenation
When('I click login button for {string}', ...)

// Avoid multiple assertions per step
Then('I see the dashboard and welcome message', ...)
```

### 4. Page Object Standards

✅ **Do's**
```typescript
export class LoginPage extends BasePage {
    // Private locators
    private usernameInput = this.page.locator('#username');

    // Public action methods
    public async fillUsername(value: string): Promise<void> {
        await this.usernameInput.fill(value);
    }

    // Assertion-style methods
    public async isLoginButtonVisible(): Promise<boolean> {
        return await this.loginButton.isVisible();
    }
}
```

❌ **Don'ts**
```typescript
// Don't expose locators
public usernameInput = this.page.locator('#username');

// Don't mix actions and assertions
public async loginWithCredentials(user: string, pass: string): Promise<boolean> {
    await this.fillUsername(user);
    await this.fillPassword(pass);
    return await this.isLoginSuccessful(); // Mixing action with assertion
}
```

### 5. Test Data Management

Use Faker for generating test data:

```typescript
import { faker } from '@faker-js/faker';

const testData = {
    username: faker.internet.username(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password(),
};

this.setFirstName(testData.firstName);
this.setEmailAddress(testData.email);
```

### 6. Logging Standards

Use Winston logger for consistent logging:

```typescript
import logger from '../../logger/logger';

logger.info('User logged in successfully');
logger.warn('Element not found, retrying...');
logger.error('Test failed: invalid credentials');
```

### 7. Error Handling

```typescript
try {
    await this.page.waitForSelector(selector, { timeout: 5000 });
} catch (error) {
    logger.error(`Element not found: ${selector}`);
    throw new Error(`Critical element missing: ${selector}`);
}
```

### 8. Scenario Tagging Standards

```gherkin
@regression      # Full test suite run
@smoke          # Quick validation
@critical       # High-priority features
@login          # Feature-based grouping
@contactUs      # Feature-based grouping
@ignore         # Skip execution
@wip            # Work in progress
@manual         # Manual testing required
```

---

## Troubleshooting

### Common Issues

#### 1. **Tests Timeout**

**Symptom**: `Timeout of 5000ms exceeded`

**Solutions**:
```bash
# Increase timeout via .env
TIMEOUT=10000 npm run cucumber smoke

# Or increase in code
this.setDefaultTimeout(10000); // in hooks.ts
```

#### 2. **Element Not Found**

**Symptom**: `Error: locator.click: Target page, context or browser has been closed`

**Solutions**:
```typescript
// Wait for element visibility
await this.page.waitForSelector(selector, { timeout: 5000 });

// Or use better locators
await this.page.getByRole('button', { name: 'Login' }).click();
```

#### 3. **Browser Won't Open**

**Symptom**: Browser instance fails to launch

**Solutions**:
```bash
# Install browser binaries
npx playwright install

# Clear playwright cache
npx playwright install --with-deps

# Run in non-headless mode to see errors
HEADLESS=false npm run cucumber smoke
```

#### 4. **Module Not Found Error**

**Symptom**: `Cannot find module '@cucumber/cucumber'`

**Solutions**:
```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Clear npm cache
npm cache clean --force
npm install
```

#### 5. **TypeScript Compilation Error**

**Symptom**: `Type errors in step definitions`

**Solutions**:
```bash
# Ensure CucumberWorld is extended correctly
class MySteps {
    myFunction(this: CucumberWorld) { ... }
}

# Rebuild TypeScript
npx tsc --noEmit
```

#### 6. **Report Not Generated**

**Symptom**: Reports folder is empty

**Solutions**:
```bash
# Ensure reports directory exists
mkdir -p reports

# Check file permissions
chmod -R 755 reports

# Verify in cucumber command
# -f json:./reports/report.json is included
```

#### 7. **Multiple Browser Tabs**

**Symptom**: Tests fail when handling multiple tabs

**Solutions**:
```typescript
// Use the switchToNewTab method
await this.switchToNewTab();

// Verify active page
const activeTab = this.page;
await activeTab.waitForURL(expectedURL);
```

### Debug Mode

Enable detailed logging:

```bash
# Set log level to debug
LOG_LEVEL=debug npm run cucumber smoke

# Run single scenario
npx cucumber-js src/features/Login.feature --tags "@smoke"

# Run headful for visual debugging
HEADLESS=false npm run cucumber smoke
```

### Useful Commands

```bash
# Check installed Playwright browsers
npx playwright install-deps

# Run specific feature file
npx cucumber-js src/features/Login.feature

# List available scenarios
npx cucumber-js --dry-run

# Run with detailed output
npx cucumber-js --publish-quiet

# Generate custom reports
npx cucumber-js -f html:custom-report.html
```

---

## Additional Resources

### Configuration Files

- **playwright.config.ts**: Browser configuration and reporter settings
- **tsconfig.json**: TypeScript compiler options
- **package.json**: Dependencies and npm scripts
- **.env**: Environment variables (create this)

### Key Utilities

- **BasePage.ts**: Common browser interaction methods
- **PageManager.ts**: Factory pattern for page object creation
- **CucumberWorld.ts**: Test context and dependency container
- **hooks.ts**: Test lifecycle management
- **logger.ts**: Centralized logging system

### File Organization Tips

1. **One scenario per feature**: Keep features focused
2. **One page object per page**: Separate concerns
3. **Group related steps**: Organize step definitions logically
4. **Reuse step definitions**: Write generic, reusable steps
5. **Keep tests independent**: Avoid test dependencies

---

## Quick Reference Card

### Running Tests
```bash
npm run cucumber smoke           # Smoke tests
npm run cucumber regression      # Full regression
npm run cucumber login          # Login feature
npm run cucumber contactUs      # Contact Us feature
```

### Writing Steps
```gherkin
Given I navigate to the [page]
When I [action]
Then I [verify]

@smoke @regression
Scenario Outline: [description]
    When I enter [field] "<value>"
    Then I should see "<expected>"
    Examples:
        | value | expected |
```

### Page Objects
```typescript
export class [PageName]Page extends BasePage {
    private selector = this.page.locator('...');
    public async method(): Promise<void> { }
}
```

### Assertions
```typescript
expect(element).toBeVisible();
expect(element).toHaveText('text');
expect(element).toBeEnabled();
```

---

## Contributing Guidelines

When adding new tests:
1. Create feature file with proper tags
2. Implement corresponding step definitions
3. Create/extend page objects
4. Follow naming conventions
5. Add logging for debugging
6. Test with multiple browsers
7. Update documentation
8. Ensure no @ignore tags remain

---

**Last Updated**: December 30, 2025

For questions or improvements, please refer to the project maintainers.
