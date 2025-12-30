# Framework Adoption Guide - What to Keep, What to Remove

A comprehensive guide for organizations wanting to adopt this PW-Cucumber Framework for their own projects.

---

## Table of Contents
1. [Overview](#overview)
2. [Components to Remove](#components-to-remove)
3. [Components to Keep Unchanged](#components-to-keep-unchanged)
4. [Components to Modify](#components-to-modify)
5. [Migration Checklist](#migration-checklist)
6. [Step-by-Step Adoption Guide](#step-by-step-adoption-guide)
7. [Project Structure After Adoption](#project-structure-after-adoption)
8. [Best Practices for Adoption](#best-practices-for-adoption)

---

## Overview

This framework was developed using **WebDriverUniversity** as the sample application. The framework itself is **completely generic** and can be used for any web application.

**Key Principle:** The framework architecture and structure are reusable; only the application-specific test files need to be replaced.

---

## 🗑️ Components to REMOVE

These components are specific to WebDriverUniversity and must be removed/replaced:

### 1. **Feature Files** - REMOVE COMPLETELY
**Location:** `src/features/`

**Files to delete:**
- ✅ `Contact_Us.feature` - WebDriverUniversity specific
- ✅ `Login.feature` - WebDriverUniversity specific

**Why:** These test the WebDriverUniversity application, not your application.

**What to do:** Create new feature files for your application's features.

```
❌ DELETE:
src/features/Contact_Us.feature
src/features/Login.feature

✅ CREATE:
src/features/YourFeature1.feature
src/features/YourFeature2.feature
```

---

### 2. **Step Definitions** - REMOVE ALL
**Location:** `src/step-definitions/`

**Files to delete:**
- ✅ `Base_Steps.ts` - WebDriverUniversity specific
- ✅ `ContactUs_Steps.ts` - WebDriverUniversity specific
- ✅ `Homepage_Steps.ts` - WebDriverUniversity specific
- ✅ `Login_Steps.ts` - WebDriverUniversity specific

**Why:** These implement WebDriverUniversity-specific steps.

**What to do:** Create new step definition files for your application.

```
❌ DELETE:
src/step-definitions/Base_Steps.ts
src/step-definitions/ContactUs_Steps.ts
src/step-definitions/Homepage_Steps.ts
src/step-definitions/Login_Steps.ts

✅ CREATE:
src/step-definitions/YourFeature1_Steps.ts
src/step-definitions/YourFeature2_Steps.ts
```

---

### 3. **Page Objects** - REMOVE ALL
**Location:** `src/page-objects/`

**Files to delete:**
- ✅ `ContactUsPage.ts` - WebDriverUniversity specific
- ✅ `HomePage.ts` - WebDriverUniversity specific
- ✅ `LoginPage.ts` - WebDriverUniversity specific

**Why:** These represent WebDriverUniversity pages.

**What to do:** Create new page objects for your application's pages.

```
❌ DELETE:
src/page-objects/ContactUsPage.ts
src/page-objects/HomePage.ts
src/page-objects/LoginPage.ts

✅ CREATE:
src/page-objects/YourPage1.ts
src/page-objects/YourPage2.ts
src/page-objects/YourPage3.ts
```

---

### 4. **Sample Reports** - REMOVE (Optional)
**Location:** `reports/`

**Files to delete:**
- ✅ `report.html` - Sample test report
- ✅ `report.json` - Sample test data

**Why:** These are from WebDriverUniversity test runs.

**What to do:** Delete them. The directory will auto-populate with your test reports.

```
❌ DELETE:
reports/report.html
reports/report.json

✅ KEEP:
reports/ (directory)
```

---

## ✅ Components to KEEP UNCHANGED

These components form the **reusable framework** and should NOT be modified:

### 1. **Base Framework Classes** - KEEP AS IS
**Location:** `src/page-objects/base/`

**Files to keep:**
```
✅ BasePage.ts
   - Provides common browser automation methods
   - Generic, application-agnostic
   - Used by all page objects
   - Contains utility methods like:
     - navigate()
     - waitAndClick()
     - waitForSelector()
     - etc.

✅ PageManager.ts
   - Factory pattern for page object creation
   - Manages page object instances
   - Generic implementation
```

**Why:** These are core framework components that provide reusable functionality.

---

### 2. **Cucumber Configuration** - KEEP AS IS
**Location:** `src/step-definitions/`

**Files to keep:**
```
✅ world/CucumberWorld.ts
   - Test context and dependency container
   - Shares data between steps
   - Manages page objects
   - Generic implementation

✅ hooks/hooks.ts
   - Test lifecycle management
   - Browser setup and teardown
   - Screenshot on failure
   - Generic implementation

✅ hooks/browserContextFixture.ts
   - Browser context management
   - Page fixture configuration
   - Generic implementation
```

**Why:** These are framework infrastructure, not application-specific.

---

### 3. **Utility Files** - KEEP AS IS
**Location:** `src/utils/`

**Files to keep:**
```
✅ cucumber-timeout.ts
   - Cucumber timeout configuration
   - Generic utility
   - No application-specific logic

✅ playwright-timeouts.ts
   - Playwright timeout settings
   - Generic utility
   - Application-agnostic
```

**Why:** These are framework utilities that work for any application.

---

### 4. **Logger Configuration** - KEEP AS IS
**Location:** `src/logger/`

**Files to keep:**
```
✅ logger.ts
   - Winston logger setup
   - Logging utilities
   - Generic implementation
   - No application-specific configuration
```

**Why:** This is a generic logging utility for all tests.

---

### 5. **Main Entry Point** - KEEP AS IS
**Location:** `src/`

**Files to keep:**
```
✅ index.ts
   - Entry point for running tests
   - Handles command-line arguments
   - Manages test profile execution
   - Completely generic
```

**Why:** This framework component manages test execution.

---

### 6. **Configuration Files** - KEEP (with minor updates)
**Location:** Root directory

**Files to keep:**
```
✅ playwright.config.ts
   - Playwright browser configuration
   - Reporter setup
   - Generic configuration
   - May need to update:
     - baseURL (if needed)
     - reporterOptions (optional)

✅ tsconfig.json
   - TypeScript compiler configuration
   - Framework-agnostic
   - No changes needed

✅ package.json
   - NPM dependencies
   - NPM scripts
   - May need to update:
     - Scripts (optional)
     - Dependencies (if adding packages)

✅ .gitignore
   - Git ignore configuration
   - Framework standard
   - No changes needed
```

**Why:** These are framework/project configuration files.

---

### 7. **Documentation Files** - KEEP ALL
**Location:** Root directory

**Files to keep:**
```
✅ START_HERE.md
✅ QUICKSTART.md
✅ DOCUMENTATION.md
✅ DEVELOPER_GUIDE.md
✅ STANDARDS.md
✅ ONBOARDING.md
✅ FAQ.md
✅ DOCUMENTATION_INDEX.md
✅ DOCUMENTATION_COMPLETE.md
✅ DELIVERY_SUMMARY.md
```

**Why:** These documents are framework-generic and apply to all projects using this framework.

**Optional:** You may add project-specific documentation alongside these.

---

## 🔧 Components to MODIFY

### 1. **Environment Configuration** - MODIFY
**Location:** `env/.env`

**Current content:**
```
BASE_URL=https://www.webdriveruniversity.com
CONTACT_US_URL=https://www.webdriveruniversity.com/contact-us.html
LOGIN_URL=https://www.webdriveruniversity.com/login-portal/index.html
```

**What to do:**
```
✅ KEEP the configuration structure
✅ KEEP the variable names (add more if needed)
✅ REPLACE the values with your application URLs

EXAMPLE - After modification:
BASE_URL=https://your-application.com
DASHBOARD_URL=https://your-application.com/dashboard
LOGIN_URL=https://your-application.com/login
API_BASE_URL=https://api.your-application.com
```

**Also create:**
- `env/.env.example` - Template for team members
- `env/.env.staging` - Staging environment config
- `env/.env.production` - Production environment config

---

### 2. **CucumberWorld Configuration** - MODIFY
**Location:** `src/step-definitions/world/CucumberWorld.ts`

**Current content:**
```typescript
export class CucumberWorld extends World {
    public pageManager: PageManager;
    public basePage: BasePage;
    public homePage: HomePage;           // ❌ WebDriverUniversity specific
    public contactUsPage: ContactUsPage; // ❌ WebDriverUniversity specific
    public loginPage: LoginPage;         // ❌ WebDriverUniversity specific
    // ... rest of implementation
}
```

**What to do:**
```typescript
// ✅ KEEP:
- World extension
- pageManager
- basePage
- Constructor with parameter destructuring
- Helper methods (setUrl, setFirstName, etc.)

// ❌ REPLACE:
export class CucumberWorld extends World {
    public pageManager: PageManager;
    public basePage: BasePage;
    
    // Replace with your application's pages
    public loginPage: LoginPage;          // Your app's login page
    public dashboardPage: DashboardPage;  // Your app's dashboard
    public userProfilePage: UserProfilePage; // Your app's profile page
    
    constructor({ attach, log, link, parameters }: IWorldOptions) {
        super({ attach, log, link, parameters });
        this.pageManager = new PageManager();
        this.basePage = this.pageManager.createBasePage();
        
        // Create your page objects
        this.loginPage = this.pageManager.createLoginPage();
        this.dashboardPage = this.pageManager.createDashboardPage();
        this.userProfilePage = this.pageManager.createUserProfilePage();
    }
}
```

---

### 3. **PageManager Factory** - MODIFY
**Location:** `src/page-objects/base/PageManager.ts`

**Current content:**
```typescript
export class PageManager {
    get page(): Page {
        return pageFixture.page;
    }

    createBasePage() {
        return new BasePage();
    }

    createHomePage() {
        return new HomePage();
    }

    createContactUsPage() {
        return new ContactUsPage();
    }

    createLoginPage() {
        return new LoginPage();
    }
}
```

**What to do:**
```typescript
// ✅ KEEP:
- PageManager class structure
- get page() getter
- Factory pattern approach
- BasePage creation

// ❌ REPLACE:
// Remove WebDriverUniversity-specific methods
export class PageManager {
    get page(): Page {
        return pageFixture.page;
    }

    createBasePage() {
        return new BasePage();
    }

    // Add your application's page objects
    createLoginPage() {
        return new LoginPage();
    }

    createDashboardPage() {
        return new DashboardPage();
    }

    createUserProfilePage() {
        return new UserProfilePage();
    }

    // Add more as needed...
}
```

---

## ✅ Migration Checklist

### Phase 1: Setup (Before removing files)
- [ ] Fork/copy this repository as your project's starting point
- [ ] Keep all documentation files
- [ ] Keep all framework infrastructure
- [ ] Review your application's structure
- [ ] Identify pages/features to test

### Phase 2: Remove Application-Specific Files
- [ ] Delete `src/features/Contact_Us.feature`
- [ ] Delete `src/features/Login.feature`
- [ ] Delete `src/step-definitions/Base_Steps.ts`
- [ ] Delete `src/step-definitions/ContactUs_Steps.ts`
- [ ] Delete `src/step-definitions/Homepage_Steps.ts`
- [ ] Delete `src/step-definitions/Login_Steps.ts`
- [ ] Delete `src/page-objects/ContactUsPage.ts`
- [ ] Delete `src/page-objects/HomePage.ts`
- [ ] Delete `src/page-objects/LoginPage.ts`
- [ ] Delete `reports/report.html` and `reports/report.json`

### Phase 3: Modify Configuration
- [ ] Update `env/.env` with your application URLs
- [ ] Update `src/step-definitions/world/CucumberWorld.ts` with your pages
- [ ] Update `src/page-objects/base/PageManager.ts` with your page factories
- [ ] Review `playwright.config.ts` (update if needed)

### Phase 4: Create Application-Specific Files
- [ ] Create your feature files (`.feature`)
- [ ] Create your step definition files (`*_Steps.ts`)
- [ ] Create your page objects (`*Page.ts`)
- [ ] Create `.env.example` for team reference

### Phase 5: Validation
- [ ] Run `npm install`
- [ ] Write a simple test scenario
- [ ] Run `npm run cucumber smoke`
- [ ] Verify tests execute successfully
- [ ] Review code against STANDARDS.md

### Phase 6: Documentation & Team Setup
- [ ] Customize documentation if needed
- [ ] Set up project-specific `.env` files
- [ ] Share documentation with team
- [ ] Begin writing comprehensive test scenarios

---

## 📋 Step-by-Step Adoption Guide

### Step 1: Initialize Your Project
```bash
# Option A: Clone and modify
git clone <framework-repo> your-project-name
cd your-project-name

# Option B: Copy as template
cp -r PW-cucumber-Framework your-new-project
cd your-new-project

# Initialize your own git
rm -rf .git
git init
git add .
git commit -m "Initial framework setup"
```

### Step 2: Clean Up WebDriverUniversity Files
```bash
# Remove sample features
rm src/features/Contact_Us.feature
rm src/features/Login.feature

# Remove sample step definitions
rm src/step-definitions/Base_Steps.ts
rm src/step-definitions/ContactUs_Steps.ts
rm src/step-definitions/Homepage_Steps.ts
rm src/step-definitions/Login_Steps.ts

# Remove sample page objects
rm src/page-objects/ContactUsPage.ts
rm src/page-objects/HomePage.ts
rm src/page-objects/LoginPage.ts

# Remove sample reports
rm reports/report.html
rm reports/report.json
```

### Step 3: Update Configuration
```bash
# Create your environment files
cat > env/.env << EOF
UI_AUTOMATION_BROWSER=chromium
HEADLESS=true
BROWSER_WIDTH=1920
BROWSER_HEIGHT=1080
LOG_LEVEL=info
PARALLEL=1
RETRY=0
BASE_URL=https://your-application.com
EOF

# Create example file for team
cp env/.env env/.env.example
```

### Step 4: Modify Framework Files
**File: `src/step-definitions/world/CucumberWorld.ts`**

Replace page imports:
```typescript
// Remove
import { ContactUsPage } from './../../page-objects/ContactUsPage';
import { HomePage } from '../../page-objects/HomePage';
import { LoginPage } from '../../page-objects/LoginPage';

// Add your pages
import { LoginPage } from '../../page-objects/LoginPage';
import { DashboardPage } from '../../page-objects/DashboardPage';
import { ProfilePage } from '../../page-objects/ProfilePage';
```

Replace page declarations:
```typescript
// Remove
public contactUsPage: ContactUsPage;
public homePage: HomePage;

// Add
public dashboardPage: DashboardPage;
public profilePage: ProfilePage;
```

Replace in constructor:
```typescript
// Remove
this.contactUsPage = this.pageManager.createContactUsPage();
this.homePage = this.pageManager.createHomePage();

// Add
this.dashboardPage = this.pageManager.createDashboardPage();
this.profilePage = this.pageManager.createProfilePage();
```

**File: `src/page-objects/base/PageManager.ts`**

Replace methods:
```typescript
// Remove
createContactUsPage() { return new ContactUsPage(); }
createHomePage() { return new HomePage(); }
createLoginPage() { return new LoginPage(); }

// Add
createDashboardPage() { return new DashboardPage(); }
createProfilePage() { return new ProfilePage(); }
createLoginPage() { return new LoginPage(); }
```

### Step 5: Create Your First Test
**Create: `src/features/YourFirstFeature.feature`**
```gherkin
@regression @yourFeature
Feature: Your Application Feature

    @smoke
    Scenario: Your first test scenario
        Given I navigate to your application
        When I perform some action
        Then I should see the expected result
```

**Create: `src/step-definitions/YourFeature_Steps.ts`**
```typescript
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CucumberWorld } from "./world/CucumberWorld";

Given('I navigate to your application', async function (this: CucumberWorld) {
    await this.basePage.navigate(process.env.BASE_URL!);
});

When('I perform some action', async function (this: CucumberWorld) {
    // Your action here
});

Then('I should see the expected result', async function (this: CucumberWorld) {
    // Your verification here
});
```

**Create: `src/page-objects/YourPage.ts`**
```typescript
import { Locator } from "@playwright/test";
import { BasePage } from "./base/BasePage";

export class YourPage extends BasePage {
    private element: Locator = this.page.locator('[data-testid="element"]');

    public async navigateToPage(): Promise<void> {
        await this.navigate(`${process.env.BASE_URL}/your-page`);
    }

    public async performAction(): Promise<void> {
        await this.waitAndClick(this.element);
    }
}
```

### Step 6: Test Your Setup
```bash
# Install dependencies
npm install

# Run a test
npm run cucumber smoke

# Verify it works
# Check reports/report.html
```

### Step 7: Set Up Team
```bash
# Create environment file for team
cp env/.env env/.env.local
git add env/.env.example
git ignore env/.env env/.env.local

# Share with team
# 1. Push to repository
# 2. Share ONBOARDING.md
# 3. Team creates env/.env.local
# 4. Team starts writing tests
```

---

## 📁 Project Structure After Adoption

### Before Removal (Current State)
```
PW-cucumber-Framework/
├── src/
│   ├── features/
│   │   ├── Contact_Us.feature     ❌ Remove
│   │   └── Login.feature          ❌ Remove
│   ├── step-definitions/
│   │   ├── Base_Steps.ts          ❌ Remove
│   │   ├── ContactUs_Steps.ts     ❌ Remove
│   │   ├── Homepage_Steps.ts      ❌ Remove
│   │   ├── Login_Steps.ts         ❌ Remove
│   │   ├── hooks/                 ✅ Keep
│   │   └── world/                 ✅ Keep (modify)
│   ├── page-objects/
│   │   ├── ContactUsPage.ts       ❌ Remove
│   │   ├── HomePage.ts            ❌ Remove
│   │   ├── LoginPage.ts           ❌ Remove
│   │   └── base/                  ✅ Keep
│   ├── logger/                    ✅ Keep
│   ├── utils/                     ✅ Keep
│   └── index.ts                   ✅ Keep
├── env/
│   └── .env                       ✅ Modify
├── reports/
│   ├── report.html                ❌ Remove
│   └── report.json                ❌ Remove
└── [Documentation & Config]       ✅ Keep All
```

### After Adoption (Clean State)
```
your-project/
├── src/
│   ├── features/
│   │   ├── YourFeature1.feature
│   │   ├── YourFeature2.feature
│   │   └── ...
│   ├── step-definitions/
│   │   ├── YourFeature1_Steps.ts
│   │   ├── YourFeature2_Steps.ts
│   │   ├── hooks/                 ✅ Unchanged
│   │   └── world/                 ✅ Modified
│   ├── page-objects/
│   │   ├── YourPage1.ts
│   │   ├── YourPage2.ts
│   │   └── base/                  ✅ Unchanged
│   ├── logger/                    ✅ Unchanged
│   ├── utils/                     ✅ Unchanged
│   └── index.ts                   ✅ Unchanged
├── env/
│   ├── .env                       ✅ Modified
│   ├── .env.example               ✅ New
│   ├── .env.staging               ✅ Optional
│   └── .env.production            ✅ Optional
├── reports/                       ✅ Empty (will populate)
└── [All Documentation Files]      ✅ Unchanged
```

---

## 💡 Best Practices for Adoption

### 1. **Preserve Framework Structure**
- Do NOT modify base framework classes
- Do NOT change configuration structure
- Keep hooks unchanged
- Maintain utility files as-is

### 2. **Follow Naming Conventions**
After adoption, follow established standards:
```
✅ Features: YourFeatureName.feature
✅ Steps: YourFeatureName_Steps.ts
✅ Pages: YourPageNamePage.ts
✅ Variables: camelCase
✅ Classes: PascalCase
✅ Directories: lowercase with underscores
```

### 3. **Environment Configuration**
```bash
# Keep environment files gitignored
echo "env/.env" >> .gitignore
echo "env/.env.local" >> .gitignore

# Create example for team
cp env/.env env/.env.example

# Team creates local copy
cp env/.env.example env/.env
```

### 4. **Documentation**
```bash
# Keep all framework documentation
# These apply to all projects

# Add project-specific documentation if needed
# Create PROJECT_README.md for your application
# Create APPLICATION_GUIDE.md for your specific setup
```

### 5. **Git Management**
```bash
# Initialize fresh repository
rm -rf .git
git init
git add .
git commit -m "Initial project setup from PW-Cucumber Framework"

# Or maintain framework history
# (depends on your preference)
```

### 6. **Dependency Management**
```bash
# Keep package.json as-is
# If you need to add dependencies:
npm install --save-dev @your/dependency

# Update package.json in version control
git add package.json package-lock.json
```

### 7. **CI/CD Integration**
When setting up CI/CD (GitHub Actions, Jenkins, etc.):
```yaml
# Use standard framework setup
npm install
npm run cucumber smoke  # or your tag
```

The framework handles the rest!

---

## 🚨 Common Mistakes to Avoid

❌ **Mistake 1: Modifying Base Framework Classes**
```typescript
// DON'T do this:
// Modify BasePage.ts to add application-specific methods
// This breaks for other projects

// DO this:
// Create ApplicationSpecificPage.ts extending BasePage
```

❌ **Mistake 2: Mixing Old and New Tests**
```gherkin
// DON'T do this:
// Keep WebDriverUniversity features alongside new tests
// This causes confusion

// DO this:
// Completely remove old features before starting new ones
```

❌ **Mistake 3: Committing .env Files**
```bash
# DON'T do this:
git add env/.env
git commit -m "Add environment"

# DO this:
echo "env/.env" >> .gitignore
git add env/.env.example
```

❌ **Mistake 4: Changing Configuration Structure**
```typescript
// DON'T do this:
// Change how hooks work
// Modify World structure
// Alter PageManager pattern

// DO this:
// Extend functionality while keeping structure
// Create new page objects following same pattern
```

---

## 📋 Adoption Validation Checklist

### Before Starting
- [ ] All framework infrastructure is understood
- [ ] WebDriverUniversity components are identified
- [ ] Your application structure is mapped
- [ ] Team is ready to learn framework

### After Cleanup
- [ ] All `.feature` files removed
- [ ] All `*_Steps.ts` files removed
- [ ] All `*Page.ts` files removed
- [ ] Sample reports deleted
- [ ] Directory structure clean

### After Configuration
- [ ] `env/.env` updated with your URLs
- [ ] `CucumberWorld.ts` updated with your pages
- [ ] `PageManager.ts` updated with your factories
- [ ] `env/.env.example` created for team

### After First Test
- [ ] First feature file created
- [ ] First step definitions implemented
- [ ] First page object created
- [ ] Tests execute successfully
- [ ] Reports generated correctly

### Team Ready
- [ ] Documentation shared
- [ ] Environment setup documented
- [ ] STANDARDS.md reviewed
- [ ] ONBOARDING.md available
- [ ] Team can write tests independently

---

## 🎯 Summary

### What to Remove
| Component | Keep/Remove | Reason |
|-----------|------------|--------|
| Feature Files | ❌ Remove | Application-specific |
| Step Definitions | ❌ Remove | Application-specific |
| Page Objects | ❌ Remove | Application-specific |
| Sample Reports | ❌ Remove | Old test data |

### What to Keep
| Component | Keep/Remove | Note |
|-----------|------------|------|
| Base Framework Classes | ✅ Keep | Generic, reusable |
| Hooks | ✅ Keep | Framework infrastructure |
| World Context | ✅ Keep (modify) | Framework core |
| Page Manager | ✅ Keep (modify) | Factory pattern |
| Logger | ✅ Keep | Generic utility |
| Utils | ✅ Keep | Framework utilities |
| Config Files | ✅ Keep (update) | Framework configuration |
| Documentation | ✅ Keep | Framework knowledge |
| Entry Point | ✅ Keep | Test runner |

### What to Modify
| Component | Action | Details |
|-----------|--------|---------|
| `.env` | Update URLs | Your application URLs |
| CucumberWorld | Replace pages | Your application's pages |
| PageManager | Replace factories | Your page object factories |
| playwright.config.ts | Optional | Update base URL if needed |

---

## 🚀 Next Steps After Adoption

1. **Team Onboarding** - Use ONBOARDING.md
2. **Write Tests** - Create features for your application
3. **Establish Standards** - Use STANDARDS.md
4. **Code Review** - Use code review checklist
5. **Expand** - Add more tests and features
6. **Maintain** - Keep documentation updated
7. **Scale** - Grow test suite with team

---

**Document Version:** 1.0  
**Created:** December 30, 2025  
**Status:** ✅ Ready for Adoption  

This guide ensures smooth adoption of the framework while preserving its reusability and quality standards.
