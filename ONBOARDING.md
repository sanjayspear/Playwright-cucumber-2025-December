# Team Onboarding Guide

Welcome to the PW-Cucumber Framework! This guide will help new team members get up to speed quickly.

## 📋 Checklist for New Team Members

- [ ] Clone/download the project
- [ ] Install Node.js and npm
- [ ] Run `npm install`
- [ ] Create `env/.env` file
- [ ] Run a test: `npm run cucumber smoke`
- [ ] Read [QUICKSTART.md](QUICKSTART.md)
- [ ] Review 2-3 existing test files
- [ ] Write your first test scenario
- [ ] Ask questions in team chat

---

## 🚀 Day 1: Setup & Getting Started (30 minutes)

### 1. Install Prerequisites
- **Node.js**: https://nodejs.org/ (LTS version)
- **Code Editor**: VS Code recommended
- **Git**: For version control

### 2. Clone Project & Install Dependencies
```bash
# Navigate to project folder
cd PW-cucumber-Framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### 3. Create Environment File
Create `env/.env`:
```
UI_AUTOMATION_BROWSER=chromium
HEADLESS=true
BROWSER_WIDTH=1920
BROWSER_HEIGHT=1080
LOG_LEVEL=info
PARALLEL=1
RETRY=0
BASE_URL=https://www.webdriveruniversity.com
```

### 4. Run Your First Test
```bash
npm run cucumber smoke
```

Expected output: ✅ 1 passed scenario

---

## 📚 Day 1-2: Learning the Framework (1-2 hours)

### Read These Files (in order)
1. [QUICKSTART.md](QUICKSTART.md) - 5 min quick overview
2. [DOCUMENTATION.md](DOCUMENTATION.md) - Full framework guide
3. Existing feature files: `src/features/`
4. Existing step definitions: `src/step-definitions/`
5. Existing page objects: `src/page-objects/`

### Understand the Architecture
```
Feature File (Gherkin)
    ↓ (human-readable)
Step Definitions (TypeScript)
    ↓ (implements steps)
Page Objects (User interactions)
    ↓ (encapsulates UI)
Playwright (Browser automation)
    ↓ (controls browser)
Web Application
```

### Key Concepts
- **Gherkin**: Plain English syntax for test scenarios
- **Step Definitions**: Implementation of Gherkin steps
- **Page Object Model**: Encapsulates UI interactions
- **World Context**: Shares data between steps

---

## ✍️ Day 2-3: Write Your First Test

### Exercise 1: Simple Navigation Test

**Feature File** (`src/features/MyFirstTest.feature`):
```gherkin
@regression @learning
Feature: My First Test Feature

    @smoke
    Scenario: Navigate to home page and verify title
        Given I navigate to the webdriveruniversity homepage
        When I wait for the page to load
        Then the page should have a title
```

**Step Definitions** (`src/step-definitions/MyFirstTest_Steps.ts`):
```typescript
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CucumberWorld } from "./world/CucumberWorld";

Given('I navigate to the webdriveruniversity homepage', async function (this: CucumberWorld) {
    await this.homePage.navigateToHomePage();
});

When('I wait for the page to load', async function (this: CucumberWorld) {
    await this.basePage.page.waitForLoadState('networkidle');
});

Then('the page should have a title', async function (this: CucumberWorld) {
    const title = await this.basePage.page.title();
    expect(title).toBeTruthy();
});
```

**Run the test**:
```bash
npm run cucumber smoke
```

### Exercise 2: Form Interaction Test

**Feature**:
```gherkin
@regression @learning
Feature: Contact Form Submission

    @smoke
    Scenario: Submit contact form with valid data
        Given I navigate to the contact us page
        When I fill the contact form with valid data
        And I submit the form
        Then I should see the success message
```

**Create Page Object** (`src/page-objects/ContactFormPage.ts`):
```typescript
import { Locator } from "@playwright/test";
import { BasePage } from "./base/BasePage";

export class ContactFormPage extends BasePage {
    private nameInput = this.page.locator('input[name="first_name"]');
    private submitButton = this.page.getByRole('button', { name: 'SUBMIT' });
    private successMessage = this.page.locator('text=Thank you');

    public async navigateToContactPage(): Promise<void> {
        await this.navigate(`${process.env.BASE_URL}/contact-us.html`);
    }

    public async fillNameField(name: string): Promise<void> {
        await this.nameInput.fill(name);
    }

    public async clickSubmit(): Promise<void> {
        await this.waitAndClick(this.submitButton);
    }

    public async isSuccessMessageVisible(): Promise<boolean> {
        return await this.successMessage.isVisible();
    }
}
```

**Step Definitions**:
```typescript
// Add to ContactForm_Steps.ts
Given('I navigate to the contact us page', async function (this: CucumberWorld) {
    await this.contactFormPage.navigateToContactPage();
});

When('I fill the contact form with valid data', async function (this: CucumberWorld) {
    await this.contactFormPage.fillNameField('John Doe');
});

And('I submit the form', async function (this: CucumberWorld) {
    await this.contactFormPage.clickSubmit();
});

Then('I should see the success message', async function (this: CucumberWorld) {
    const isVisible = await this.contactFormPage.isSuccessMessageVisible();
    expect(isVisible).toBe(true);
});
```

---

## 🏗️ Week 1: Project Deep Dive

### Understanding the Codebase

**src/features/** - Feature files
- Written in Gherkin syntax
- Business-readable test scenarios
- Include examples for data-driven tests

**src/step-definitions/** - Step implementations
- Match Gherkin steps from features
- Call methods on page objects
- Handle assertions

**src/page-objects/** - UI interaction layer
- One class per page
- Encapsulate selectors
- Provide action methods

**src/step-definitions/world/** - Test context
- Dependency container
- Shares data between steps
- Manages page objects

**src/step-definitions/hooks/** - Test lifecycle
- Setup before tests
- Teardown after tests
- Handle errors/screenshots

**env/.env** - Configuration
- Browser settings
- URLs
- Logging levels

### Code Review Exercise
Pick an existing test and:
1. Read the feature file
2. Read the step definitions
3. Read the page object
4. Understand the flow
5. Identify best practices used

---

## 🎯 Week 1-2: Common Tasks

### Task 1: Add a New Feature Test
1. Create feature file: `src/features/NewFeature.feature`
2. Write scenarios in Gherkin
3. Create step definitions: `src/step-definitions/NewFeature_Steps.ts`
4. Create page object (if needed): `src/page-objects/NewFeaturePage.ts`
5. Run test: `npm run cucumber newfeature`

### Task 2: Fix a Failing Test
1. Identify failing test in reports
2. Run it headful: `HEADLESS=false npm run cucumber smoke`
3. Observe browser behavior
4. Update selectors or wait conditions
5. Re-run test

### Task 3: Create a Page Object
1. Identify page elements
2. Create class extending BasePage
3. Define locators (private)
4. Implement action methods
5. Use in step definitions

### Task 4: Add New Step
1. Identify where in a scenario a new step is needed
2. Add step to feature file
3. Implement in corresponding step definition file
4. Test it runs correctly

---

## 📖 Documentation Reference

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [QUICKSTART.md](QUICKSTART.md) | Quick setup & overview | Day 1 |
| [DOCUMENTATION.md](DOCUMENTATION.md) | Complete framework guide | Day 1-2 |
| [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) | Code examples & patterns | When writing code |
| [STANDARDS.md](STANDARDS.md) | Best practices & conventions | Before code review |
| [FAQ.md](FAQ.md) | Common questions & errors | When stuck |

---

## 💡 Tips for Success

### 1. **Start Simple**
- Write basic scenarios first
- Master one feature before moving to complex ones
- Use existing tests as templates

### 2. **Follow Naming Conventions**
```
✅ LoginPage.ts, Login_Steps.ts, Login.feature
❌ login_page.ts, login_steps.ts, login_test.feature
```

### 3. **Use Page Object Model**
- Keep selectors in page objects
- Make step definitions thin (2-3 lines)
- Reuse page methods across tests

### 4. **Write Maintainable Tests**
- Business-readable scenarios
- Independent tests
- Meaningful error messages

### 5. **Debug Effectively**
```bash
# Enable full logging
LOG_LEVEL=debug npm run cucumber smoke

# Run without headless (see browser)
HEADLESS=false npm run cucumber smoke

# Run single scenario
npx cucumber-js src/features/Login.feature:10
```

### 6. **Use Git for Version Control**
```bash
git add .
git commit -m "Add login feature tests"
git push origin main
```

---

## 🤝 Team Collaboration

### Code Review Process
1. Write test/update code
2. Create Pull Request
3. Team reviews using [STANDARDS.md](STANDARDS.md)
4. Provide feedback
5. Author updates and merges

### Review Checklist
- [ ] Naming conventions followed
- [ ] No hard-coded values
- [ ] Independent tests
- [ ] Proper error handling
- [ ] Documentation updated
- [ ] All tests pass locally

### Communication
- Ask questions in team chat
- Share learnings with team
- Report issues with tests
- Suggest framework improvements

---

## 🚨 Common Beginner Mistakes

### ❌ Mistake 1: Hard-coded Data
```typescript
// BAD
await this.page.locator('#username').fill('testuser123');

// GOOD
When('I enter username {string}', async function (username: string) {
    await this.loginPage.fillUsername(username);
});
```

### ❌ Mistake 2: No Waits
```typescript
// BAD
await this.page.click(selector); // Might not exist yet

// GOOD
await this.page.locator(selector).waitFor({ state: 'visible' });
await this.page.click(selector);
```

### ❌ Mistake 3: Brittle Selectors
```typescript
// BAD
this.page.locator('div > div > button:nth-child(3)')

// GOOD
this.page.getByRole('button', { name: 'Submit' })
```

### ❌ Mistake 4: Test Dependencies
```typescript
// BAD
// Test 2 depends on Test 1
Scenario 1: Create user
Scenario 2: Login as created user

// GOOD
// Each test is independent
Background: Given a test user exists
Scenario 1: Create additional user
Scenario 2: Login
```

### ❌ Mistake 5: Using console.log
```typescript
// BAD
console.log('Test started');

// GOOD
import logger from '../../logger/logger';
logger.info('Test started');
```

---

## 📞 Getting Help

### Resources in Order of Preference
1. **Check Documentation**: Search relevant .md files
2. **Review Examples**: Look at existing tests
3. **FAQ.md**: Common issues and solutions
4. **Team Chat**: Ask teammates
5. **Team Lead**: For framework decisions

### What to Include When Asking for Help
```
Issue: [Clear description]

What I tried:
- [Attempted solution 1]
- [Attempted solution 2]

Error message:
[Full error text or screenshot]

Expected behavior:
[What should happen]

Actual behavior:
[What actually happened]
```

---

## 📅 Onboarding Timeline

| Timeline | Milestones |
|----------|-----------|
| **Day 1** | Setup complete, run first test ✅ |
| **Day 2** | Read documentation, understand architecture ✅ |
| **Day 3** | Write first basic scenario ✅ |
| **Week 1** | Write 3-5 test scenarios, understand conventions ✅ |
| **Week 2** | Create new page objects, fix failing tests ✅ |
| **Week 3** | Contribute to existing features, code reviews ✅ |
| **Week 4** | Independent contributor, mentor others 🎉 |

---

## 🎓 Learning Path Recommendation

### Phase 1: Fundamentals (Days 1-3)
- [ ] Gherkin syntax
- [ ] Step definitions structure
- [ ] Page Object Model basics
- [ ] Running tests

### Phase 2: Hands-on (Weeks 1-2)
- [ ] Write basic scenarios
- [ ] Create page objects
- [ ] Debug failing tests
- [ ] Follow coding standards

### Phase 3: Mastery (Weeks 2-4)
- [ ] Complex scenarios
- [ ] Advanced Playwright features
- [ ] Optimize test performance
- [ ] Contribute to framework improvements

---

## ✅ Onboarding Completion Checklist

**Setup**
- [ ] Node.js and npm installed
- [ ] Project cloned/downloaded
- [ ] Dependencies installed
- [ ] .env file created
- [ ] First test runs successfully

**Knowledge**
- [ ] Understand Gherkin syntax
- [ ] Know page object pattern
- [ ] Familiar with framework structure
- [ ] Read all documentation
- [ ] Reviewed 3+ existing tests

**Skills**
- [ ] Can write a feature file
- [ ] Can implement step definitions
- [ ] Can create a page object
- [ ] Can run and debug tests
- [ ] Can follow coding standards

**Contribution**
- [ ] Written your first test
- [ ] Had code reviewed
- [ ] Received and implemented feedback
- [ ] Contributed to team repository

---

## 📚 Next Steps After Onboarding

1. **Pick a real user story**: Implement tests for actual features
2. **Contribute to test suite**: Add tests for your work
3. **Improve framework**: Suggest enhancements
4. **Mentor others**: Help new team members
5. **Explore advanced features**: Learn Playwright advanced capabilities

---

## 🎉 Welcome to the Team!

You're now ready to start writing tests with the PW-Cucumber Framework. Remember:

- **Start simple**: Master basics before complex scenarios
- **Ask questions**: Don't hesitate to ask for help
- **Follow standards**: Consistency is key
- **Review code**: Learn from others' tests
- **Have fun**: Testing can be enjoyable and rewarding!

---

**Questions?** Check [FAQ.md](FAQ.md) or ask your team lead!

**Happy Testing! 🚀**

---

**Last Updated**: December 30, 2025
