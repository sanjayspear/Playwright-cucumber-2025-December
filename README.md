# PW-Cucumber Framework

A professional automation testing framework combining **Playwright**, **Cucumber**, and **TypeScript** for building scalable, maintainable BDD (Behavior-Driven Development) tests.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Initial Setup](#initial-setup)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Features](#features)
- [Prerequisites](#prerequisites)

---

## Quick Start

Get started in 3 steps:

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp env/.env.example env/.env  # if available, or create manually

# 3. Run your first test
npm run cucumber smoke
```

---

## Initial Setup

### Prerequisites

Before starting, ensure you have:

- **Node.js** version 16.x or higher
  - Download: https://nodejs.org/
  - Verify: `node --version`

- **npm** version 8.x or higher
  - Usually comes with Node.js
  - Verify: `npm --version`

- **Git** (optional, for version control)
  - Download: https://git-scm.com/

- **VS Code** (recommended IDE)
  - Download: https://code.visualstudio.com/

### Step 1: Install Dependencies

```bash
npm install
```

This installs all required packages:
- `@playwright/test` - Browser automation
- `@cucumber/cucumber` - BDD framework
- `typescript` - Type safety
- `dotenv` - Environment configuration
- `winston` - Logging
- `@faker-js/faker` - Test data generation

### Step 2: Set Up Environment File

Create `env/.env` in the project root:

```bash
# Copy template if available
cp env/.env.example env/.env
```

Or manually create `env/.env`:

```env
# Browser Configuration
UI_AUTOMATION_BROWSER=chromium        # chromium | firefox | webkit
HEADLESS=true                         # true | false
BROWSER_WIDTH=1920
BROWSER_HEIGHT=1080

# Application Configuration
BASE_URL=https://www.webdriveruniversity.com

# Logging
LOG_LEVEL=info                        # debug | info | warn | error

# Test Execution
PARALLEL=1                            # Number of parallel tests
RETRY=0                               # Retry failed tests

# Timeout (milliseconds)
DEFAULT_TIMEOUT=5000
NAVIGATION_TIMEOUT=10000
```

**Environment Variable Guide:**

| Variable | Values | Default | Purpose |
|----------|--------|---------|---------|
| `UI_AUTOMATION_BROWSER` | chromium, firefox, webkit | chromium | Browser engine to use |
| `HEADLESS` | true, false | true | Run browser in headless mode (no UI) |
| `BASE_URL` | URL string | depends on env | Application under test |
| `LOG_LEVEL` | debug, info, warn, error | info | Logging detail level |
| `PARALLEL` | 1-8 | 1 | Number of tests to run simultaneously |
| `RETRY` | 0+ | 0 | Retry failed tests |

### Step 3: Install Playwright Browsers

```bash
npx playwright install
```

This downloads browser binaries needed for testing.

### Step 4: Verify Installation

```bash
npm run cucumber smoke
```

If tests run successfully, your setup is complete! ✅

---

## Running Tests

### Basic Commands

```bash
# Run smoke tests (quick validation)
npm run cucumber smoke

# Run all regression tests
npm run cucumber regression

# Run tests with specific tag
npm run cucumber login
npm run cucumber contactUs

# Run all tests
npm run cucumber
```

### Advanced Commands

#### Run Tests in Different Modes

```bash
# Headed mode (see browser)
HEADLESS=false npm run cucumber smoke

# Different browser
UI_AUTOMATION_BROWSER=firefox npm run cucumber regression

# Parallel execution (4 tests at once)
PARALLEL=4 npm run cucumber smoke

# With debug logging
LOG_LEVEL=debug npm run cucumber smoke

# Retry failed tests 2 times
RETRY=2 npm run cucumber regression
```

#### Run Specific Tests

```bash
# Run by tag
npx ts-node src/index.ts smoke
npx ts-node src/index.ts regression

# Run all tests
npx ts-node src/index.ts all

# Run and ignore @wip tests
npm run cucumber  # @ignore is excluded by default
```

#### Run in Different Environments

```bash
# Development environment
ENV=dev npm run cucumber smoke

# Staging environment
ENV=staging npm run cucumber regression

# Production environment (smoke only)
ENV=production npm run cucumber smoke
```

### Test Reports

After running tests, reports are generated:

- **HTML Report**: `reports/report.html` - Open in browser
- **JSON Report**: `reports/report.json` - For CI/CD integration
- **Screenshots**: `screenshots/` - Failure screenshots (if enabled)
- **Logs**: Check console output for detailed logs

---

## Project Structure

```
PW-cucumber-Framework/
├── src/
│   ├── features/                 # Gherkin test scenarios
│   │   ├── Login.feature
│   │   └── Contact_Us.feature
│   ├── step-definitions/         # Step implementations
│   │   ├── Login_Steps.ts
│   │   ├── ContactUs_Steps.ts
│   │   ├── hooks/
│   │   │   ├── browserContextFixture.ts
│   │   │   └── hooks.ts         # Before/After hooks
│   │   └── world/
│   │       └── CucumberWorld.ts  # Test context
│   ├── page-objects/             # Page Object Model
│   │   ├── LoginPage.ts
│   │   ├── ContactUsPage.ts
│   │   └── base/
│   │       ├── BasePage.ts       # Base class for all pages
│   │       └── PageManager.ts    # Factory pattern
│   ├── utils/                    # Utilities
│   │   ├── cucumber-timeout.ts
│   │   └── playwright-timeouts.ts
│   ├── logger/
│   │   └── logger.ts             # Winston logging setup
│   └── index.ts                  # Entry point
├── env/
│   └── .env                      # Environment variables (create this)
├── reports/
│   ├── report.html              # Test report (auto-generated)
│   └── report.json              # JSON report (auto-generated)
├── playwright.config.ts          # Playwright configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── README.md                     # This file
├── START_HERE.md                 # Documentation navigation
├── QUICKSTART.md                 # 5-minute setup guide
└── DOCUMENTATION.md              # Complete framework guide
```

---

## Features

✅ **BDD Framework** - Write tests in readable Gherkin language  
✅ **Page Object Model** - Maintainable test structure  
✅ **Playwright** - Modern browser automation  
✅ **TypeScript** - Type-safe test code  
✅ **Parallel Execution** - Run multiple tests simultaneously  
✅ **Comprehensive Logging** - Debug with detailed logs  
✅ **Test Reports** - HTML and JSON reports  
✅ **Retry Logic** - Automatic test retry on failure  
✅ **Environment Config** - Easy environment switching  
✅ **Professional Documentation** - 10+ guide documents  

---

## Common Issues & Solutions

### Issue: `npm: command not found`
**Solution**: Install Node.js from https://nodejs.org/

### Issue: `Cannot find module '@playwright/test'`
**Solution**: Run `npm install` to install dependencies

### Issue: `Browser not found`
**Solution**: Run `npx playwright install` to download browsers

### Issue: `Tests timeout`
**Solution**: Increase timeout in `.env`:
```env
DEFAULT_TIMEOUT=15000
NAVIGATION_TIMEOUT=20000
```

### Issue: `Cannot find env/.env`
**Solution**: Create the file manually:
```bash
touch env/.env
# Then add configuration from Initial Setup section
```

### Issue: `EACCES: permission denied`
**Solution**: Run with elevated permissions:
```bash
sudo npm install
```

---

## Documentation

For detailed information, see:

| Document | Purpose |
|----------|---------|
| [START_HERE.md](START_HERE.md) | Navigation guide - **Start here!** |
| [QUICKSTART.md](QUICKSTART.md) | 5-minute setup and first test |
| [DOCUMENTATION.md](DOCUMENTATION.md) | Complete framework reference (23 KB) |
| [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) | Code examples and patterns (23 KB) |
| [STANDARDS.md](STANDARDS.md) | Best practices and coding standards (21 KB) |
| [FRAMEWORK_QA_BY_DIFFICULTY.md](FRAMEWORK_QA_BY_DIFFICULTY.md) | 33 Q&As from beginner to expert |
| [ONBOARDING.md](ONBOARDING.md) | Team onboarding guide |
| [FAQ.md](FAQ.md) | Troubleshooting and common questions |
| [FRAMEWORK_ADOPTION.md](FRAMEWORK_ADOPTION.md) | Guide for adopting framework in your org |

---

## Next Steps

1. **Follow QUICKSTART.md** - Write your first test in 10 minutes
2. **Read DOCUMENTATION.md** - Understand the framework structure
3. **Review DEVELOPER_GUIDE.md** - Learn code patterns and examples
4. **Check STANDARDS.md** - Follow best practices
5. **Explore FRAMEWORK_QA_BY_DIFFICULTY.md** - Answer common questions

---

## Learning Resources

This framework was built following best practices from:

- **[Playwright with Cucumber BDD TypeScript - Beginner to Pro](https://capgemini.udemy.com/course/playwright-with-cucumber-bdd-typescript-beginner-to-pro/)** (Udemy)
  - Comprehensive course covering framework design and best practices

**Official Documentation**:
- [Playwright Documentation](https://playwright.dev/)
- [Cucumber.js Documentation](https://cucumber.io/docs/cucumber/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## Quick Reference - Common Commands

```bash
# Setup
npm install                          # Install dependencies
npx playwright install              # Download browsers
cp env/.env.example env/.env        # Create environment file

# Testing
npm run cucumber smoke              # Run smoke tests
npm run cucumber regression         # Run all tests
HEADLESS=false npm run cucumber     # Run in headed mode
PARALLEL=4 npm run cucumber         # Run 4 tests in parallel

# Debugging
LOG_LEVEL=debug npm run cucumber    # Debug logging
npx ts-node src/index.ts smoke      # Run with direct ts-node

# Cleanup
rimraf reports                      # Clear old reports
rimraf node_modules                 # Clean dependencies (for fresh install)
```

---

## Contributing

When adding new tests:

1. Follow the structure in [STANDARDS.md](STANDARDS.md)
2. Write clear Gherkin scenarios
3. Create page objects following Page Object Model
4. Add appropriate tags (@smoke, @regression, etc.)
5. Update documentation if needed
6. Test locally before committing

---

## Support

For questions or issues:

1. Check [FAQ.md](FAQ.md) - Troubleshooting guide
2. Review [FRAMEWORK_QA_BY_DIFFICULTY.md](FRAMEWORK_QA_BY_DIFFICULTY.md) - 33 Q&As
3. See [DOCUMENTATION.md](DOCUMENTATION.md) - Complete guide
4. Review existing test examples in `src/features/`

---

## License

ISC

---

**Last Updated**: December 30, 2025  
**Framework Version**: 1.0.0  
**Playwright Version**: ^1.57.0  
**Cucumber Version**: ^12.4.0