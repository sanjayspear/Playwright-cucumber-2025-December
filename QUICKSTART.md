# Quick Start Guide - PW-Cucumber Framework

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create .env File
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

### Step 3: Run Your First Test
```bash
npm run cucumber smoke
```

---

## Writing Your First Test - 10 Minutes

### 1. Create Feature File
Create `src/features/MyFeature.feature`:
```gherkin
@regression @myFeature
Feature: My First Test Feature

    @smoke
    Scenario: Verify page loads successfully
        Given I navigate to the application
        When I wait for the page to load
        Then I should see the home page
```

### 2. Create Step Definitions
Create `src/step-definitions/MyFeature_Steps.ts`:
```typescript
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CucumberWorld } from "./world/CucumberWorld";

Given('I navigate to the application', async function (this: CucumberWorld) {
    await this.basePage.navigate('https://www.webdriveruniversity.com');
});

When('I wait for the page to load', async function (this: CucumberWorld) {
    await this.basePage.page.waitForLoadState('networkidle');
});

Then('I should see the home page', async function (this: CucumberWorld) {
    const title = await this.basePage.page.title();
    expect(title).toBeTruthy();
});
```

### 3. Run the Test
```bash
npm run cucumber myFeature
```

---

## Useful Commands

| Command | Purpose |
|---------|---------|
| `npm run cucumber smoke` | Run smoke tests |
| `npm run cucumber regression` | Run all regression tests |
| `npm install` | Install dependencies |
| `HEADLESS=false npm run cucumber smoke` | Run with browser visible |
| `npm run cucumber login` | Run login tests only |

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/features/*.feature` | Write test scenarios here |
| `src/step-definitions/*_Steps.ts` | Implement steps here |
| `src/page-objects/*.ts` | Create page objects here |
| `env/.env` | Configure environment variables |
| `DOCUMENTATION.md` | Full framework documentation |

---

## Common Tasks

### Create a New Page Object
1. Create `src/page-objects/MyPage.ts`
2. Extend `BasePage`
3. Add locators and methods

### Add a New Feature
1. Create feature file in `src/features/`
2. Add `@tag` decorator
3. Write scenarios
4. Implement steps

### Run Tests in Different Browser
```bash
UI_AUTOMATION_BROWSER=firefox npm run cucumber smoke
UI_AUTOMATION_BROWSER=webkit npm run cucumber regression
```

### Debug a Failing Test
```bash
# Run headful to see what's happening
HEADLESS=false npm run cucumber smoke

# View the HTML report
open reports/report.html
```

---

## Need Help?

1. Check `DOCUMENTATION.md` for detailed guides
2. Review existing step definitions for examples
3. Look at page objects for common patterns
4. Check logs: `LOG_LEVEL=debug npm run cucumber smoke`

---

**Quick Troubleshooting**

- **Browser won't open**: Run `npx playwright install`
- **Tests timeout**: Increase timeout in `.env` or code
- **Module not found**: Run `npm install` again
- **No reports**: Ensure `reports/` directory exists

Happy Testing! 🚀
