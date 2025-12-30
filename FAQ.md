# FAQ & Troubleshooting Guide

## Frequently Asked Questions

### General Questions

**Q: What's the difference between Cucumber and Playwright?**
A: Cucumber provides the BDD framework and test organization (Feature files, step definitions), while Playwright provides the browser automation capabilities. They work together: Cucumber parses Gherkin scenarios and Playwright automates browser interactions.

**Q: Can I run tests without Cucumber?**
A: Technically yes, but this framework is specifically designed around Cucumber's BDD approach. Using just Playwright would eliminate the business-readable scenarios and step definitions.

**Q: Do I need to know JavaScript/TypeScript to write tests?**
A: You need basic TypeScript knowledge for step definitions and page objects, but feature files are written in plain English (Gherkin). Non-technical team members can read and understand scenarios.

**Q: Can I use this framework with other applications (not just webdriveruniversity)?**
A: Yes! The framework is generic and can be adapted for any web application. Update the URLs in `.env` and create appropriate page objects for your application.

---

### Setup & Installation

**Q: I'm getting "command not found: npm"**
A: Node.js is not installed. Download from https://nodejs.org/. Install the LTS version (includes npm).

**Q: "playwright module not found" error**
```bash
# Solution:
npm install
npx playwright install
```

**Q: Port conflicts when running tests**
A: Ensure no other process is using the port. Check `.env` for BASE_URL configuration.

**Q: "Permission denied" errors on Mac/Linux**
```bash
# Solution:
chmod -R 755 .
npm install
```

---

### Running Tests

**Q: How do I run a single scenario?**
```bash
# By scenario name (find the line number)
npx cucumber-js src/features/Login.feature:12

# By tag
npx cucumber-js --tags "@smoke and not @ignore"
```

**Q: Tests run but don't generate reports**
```bash
# Ensure reports directory exists:
mkdir -p reports

# Check that command includes report format:
# Should have: -f json:./reports/report.json --format html:./reports/report.html
```

**Q: Why are tests slow?**
Possible causes:
- Default timeout is too high: Reduce in code
- Running serially instead of parallel: Set PARALLEL=4 in .env
- Browser overhead: Use --headed=false
- Network waits: Check website responsiveness

**Q: Tests pass locally but fail in CI/CD**
Common issues:
- Different environment URLs: Check .env configuration
- Timing differences: Increase timeouts in CI
- Browser differences: Test in multiple browsers
- Headless mode issues: Try running headful

---

### Writing Tests

**Q: How do I parametrize test data?**
Use Scenario Outline with Examples:
```gherkin
Scenario Outline: Login with credentials
    When I enter username "<username>"
    And I enter password "<password>"
    Then I should see "<result>"

    Examples:
        | username | password | result  |
        | user1    | pass1    | Success |
```

**Q: Can I use external data files (CSV, JSON)?**
Not directly through Cucumber, but you can:
- Use Faker for random data
- Load data in hooks from files
- Pass data through DataTable

```gherkin
Scenario: Create multiple users
    Given the following users exist:
        | name  | email            |
        | John  | john@example.com |
        | Jane  | jane@example.com |
```

**Q: How do I skip a test?**
Add `@ignore` tag:
```gherkin
@ignore
Scenario: Test to skip
    ...
```

**Q: How do I handle dynamic content/IDs?**
Use flexible locators:
```typescript
// ❌ AVOID
this.page.locator('#user-panel-123')

// ✅ PREFER
this.page.getByRole('heading', { name: 'User Panel' })
this.page.locator('[data-testid="user-panel"]')
```

---

### Page Objects & Locators

**Q: My locator is breaking when the UI changes**
Use more robust selectors:
```typescript
// ❌ BREAKS EASILY
this.page.locator('div > div > button:nth-child(3)')

// ✅ MORE STABLE
this.page.getByRole('button', { name: 'Submit' })
this.page.locator('[data-testid="submit-button"]')
```

**Q: How do I find the right selector?**
1. Right-click element → Inspect
2. Look for semantic attributes: `role`, `aria-label`, `name`
3. Use test IDs: `data-testid`
4. Fall back to CSS selectors
5. Avoid XPath (less stable)

**Q: Can I use XPath?**
Technically yes, but it's fragile:
```typescript
// Works but not recommended
this.page.locator('//button[contains(text(), "Login")]')

// Better alternative
this.page.getByRole('button', { name: 'Login' })
```

**Q: How do I wait for elements?**
```typescript
// Method 1: Built-in wait (recommended)
await element.waitFor({ state: 'visible', timeout: 5000 });

// Method 2: Wait for condition
await this.page.waitForFunction(() => {
    return document.querySelectorAll('.item').length > 0;
});

// Method 3: Custom wait utility
private async waitForElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
}
```

---

### Debugging & Troubleshooting

**Q: A test is flaky (sometimes passes, sometimes fails)**
Common causes:
- **Timing issues**: Add explicit waits
- **Timing): **Network race conditions**: Wait for network idle
- **Stale elements**: Re-query elements before interaction
- **Hidden elements**: Wait for visibility

```typescript
// ✅ GOOD - Robust
await element.waitFor({ state: 'visible' });
await element.click();

// ❌ BAD - Flaky
await element.click(); // Might fail if element not ready
```

**Q: Element clicks but nothing happens**
```typescript
// Try these solutions:
1. // Wait for element to be stable
   await element.waitFor({ state: 'attached' });
   
2. // Click multiple times if first fails
   await element.click({ clickCount: 2 });
   
3. // Use force click (bypass checks)
   await element.click({ force: true });
   
4. // Try keyboard enter instead
   await element.focus();
   await page.keyboard.press('Enter');
```

**Q: How do I debug a failing test?**

1. **Run in headed mode**:
   ```bash
   HEADLESS=false npm run cucumber smoke
   ```

2. **Add logging**:
   ```typescript
   logger.info('Before clicking button');
   await button.click();
   logger.info('Button clicked successfully');
   ```

3. **Take screenshots**:
   ```typescript
   await this.page.screenshot({ path: 'debug.png' });
   ```

4. **Use browser console**:
   ```typescript
   const result = await this.page.evaluate(() => {
       return document.querySelectorAll('button').length;
   });
   console.log(`Found ${result} buttons`);
   ```

5. **Trace recording** (in hooks):
   ```typescript
   await this.page.context().tracing.start({ screenshots: true, snapshots: true });
   // Run test...
   await this.page.context().tracing.stop({ path: 'trace.zip' });
   ```

**Q: "Timeout of 5000ms exceeded"**
```bash
# Solution 1: Increase timeout in .env
TIMEOUT=10000 npm run cucumber smoke

# Solution 2: Increase in code
this.setDefaultTimeout(10000);

# Solution 3: Increase for specific step
Step(options: { timeout: 15000 })
```

**Q: "page context or browser has been closed"**
This happens when:
- Test ends before async operation completes
- Browser closes unexpectedly
- Page navigates away

```typescript
// Solution: Ensure waits are proper
await this.page.waitForLoadState('networkidle');
await this.page.waitForURL(expectedURL);
```

---

### Browser & Configuration

**Q: How do I run tests on different browsers?**
```bash
# Update .env
UI_AUTOMATION_BROWSER=firefox

# Or pass as environment variable
UI_AUTOMATION_BROWSER=webkit npm run cucumber smoke
```

**Q: Can I run tests on mobile devices?**
Partially through device emulation:
```typescript
// In hooks.ts, add device configuration
const devices = require('@playwright/test').devices;
const iPhone = devices['iPhone 12'];

await browserInstance.newContext({
    ...iPhone,
});
```

**Q: How do I handle HTTPS/SSL certificate errors?**
Already configured in `hooks.ts`:
```typescript
pageFixture.context = await browserInstance.newContext({
    ignoreHTTPSErrors: true
});
```

**Q: Can I run tests in Docker?**
Yes, create a Dockerfile:
```dockerfile
FROM mcr.microsoft.com/playwright:v1.57.0-jammy
WORKDIR /app
COPY . .
RUN npm install
CMD npm run cucumber smoke
```

---

### Reporting & Analytics

**Q: Where are test reports generated?**
Reports are in the `reports/` directory:
- `report.html` - Visual HTML report
- `report.json` - Machine-readable JSON report

**Q: How do I customize the HTML report?**
The HTML report is generated by Cucumber's built-in reporter. To customize:
1. Use the JSON report with a custom reporter
2. Modify formatting in `package.json` script

**Q: How do I integrate with test management tools?**
Use the JSON report and integrate with tools like:
- Xray
- TestRail
- ReportPortal

Map Cucumber tags to test case IDs and process the JSON report.

---

### Performance & Optimization

**Q: How do I make tests run faster?**

1. **Enable parallel execution**:
   ```bash
   PARALLEL=4 npm run cucumber smoke
   ```

2. **Reduce timeouts** (if stable):
   ```typescript
   const timeout = 3000; // Instead of 5000
   ```

3. **Headless mode** (faster than headed):
   ```bash
   HEADLESS=true npm run cucumber smoke
   ```

4. **Skip screenshots** (if not debugging):
   Modify hooks.ts to disable screenshot on failure

5. **Use faster browser**:
   ```bash
   # Chromium is typically fastest
   UI_AUTOMATION_BROWSER=chromium npm run cucumber smoke
   ```

**Q: How many parallel workers should I use?**
Rule of thumb: Number of CPU cores
```bash
# Check your CPU cores
node -e "console.log(require('os').cpus().length)"

# Set accordingly
PARALLEL=8 npm run cucumber smoke
```

---

### Cucumber-Specific

**Q: What's the difference between Background and BeforeAll hook?**
- **Background**: Runs before each Scenario (visible in feature file)
- **BeforeAll hook**: Runs once before all tests (in code)

Use Background for test setup visible to stakeholders, hooks for technical setup.

**Q: Can I use DataTable in steps?**
Yes:
```gherkin
Scenario: Create multiple users
    Given I have the following users:
        | name | email            |
        | John | john@example.com |
        | Jane | jane@example.com |
```

```typescript
import { DataTable } from '@cucumber/cucumber';

Given('I have the following users:', async function (dataTable: DataTable) {
    const users = dataTable.hashes();
    for (const user of users) {
        await this.userPage.createUser(user.name, user.email);
    }
});
```

**Q: How do I set up test hooks globally?**
All hooks are in `src/step-definitions/hooks/hooks.ts`:
```typescript
BeforeAll(() => { /* Runs once */ });
Before(() => { /* Before each scenario */ });
After(() => { /* After each scenario */ });
AfterAll(() => { /* Runs once */ });
```

---

### Advanced Topics

**Q: How do I test file uploads?**
```typescript
public async uploadFile(selector: string, filePath: string): Promise<void> {
    await this.page.locator(selector).setInputFiles(filePath);
}
```

**Q: How do I handle popups/dialogs?**
```typescript
public async handleAlert(accept: boolean = true): Promise<string> {
    let message = '';
    
    this.page.once('dialog', async (dialog) => {
        message = dialog.message();
        if (accept) {
            await dialog.accept();
        } else {
            await dialog.dismiss();
        }
    });

    return message;
}
```

**Q: How do I test API calls made by the page?**
```typescript
public async interceptApiResponse(): Promise<any> {
    let apiResponse: any;
    
    this.page.once('response', async (response) => {
        if (response.url().includes('/api/users')) {
            apiResponse = await response.json();
        }
    });

    // Trigger action that makes API call
    await this.submitForm();
    
    return apiResponse;
}
```

---

## Common Error Messages & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Cannot find module` | Missing dependency | Run `npm install` |
| `ERR_INVALID_URL` | Invalid BASE_URL in .env | Check `.env` file |
| `Timeout exceeded` | Element not found within timeout | Increase timeout or fix selector |
| `Target page closed` | Browser closed before operation | Fix async/await timing |
| `Element is not visible` | Element hidden/not in viewport | Add wait for visibility |
| `Locator not found` | Selector is wrong | Use Inspector to find correct selector |
| `Port already in use` | Another process using port | Change port or kill existing process |
| `EACCES permission denied` | File permissions issue | Run `chmod -R 755 .` |

---

## Support Resources

**Internal Documentation**
- [DOCUMENTATION.md](DOCUMENTATION.md) - Full framework documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) - Code examples and patterns
- [STANDARDS.md](STANDARDS.md) - Coding standards and best practices

**External Resources**
- [Cucumber.js Documentation](https://cucumber.io/docs/cucumber/)
- [Playwright Documentation](https://playwright.dev/)
- [Gherkin Syntax Guide](https://cucumber.io/docs/gherkin/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

**Getting Help**
1. Check the relevant documentation file
2. Look at existing examples in the codebase
3. Enable debug logging: `LOG_LEVEL=debug npm run cucumber smoke`
4. Check browser console: `HEADLESS=false npm run cucumber smoke`
5. Review test reports in `reports/`

---

**Last Updated**: December 30, 2025

Still need help? Check the framework's log files or reach out to the team!
