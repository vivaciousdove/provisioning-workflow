# Test Evidence

This project keeps test evidence from GitHub Actions so failures can be investigated beyond a simple pass/fail result.

## Automated Coverage

The current Playwright suite includes:

- 3 UI tests
- 6 API tests
- 1 database persistence test

The database test creates a provisioning request through the API and queries MySQL directly to confirm the expected values were stored.

## CI Evidence

Each GitHub Actions run can produce the following artifacts.

### Playwright HTML Report

`playwright-html-report`

Provides the test execution summary and failure details.

### Playwright Test Results

`playwright-test-results`

Can contain screenshots, videos, and traces captured according to the Playwright configuration.

These are useful when investigating UI failures.

### Allure Results

`allure-results`

Contains the raw results used to generate the Allure report.

### Allure HTML Report

`allure-html-report`

Provides another view of the automated test results and is published through GitHub Pages for runs on `main`.

### Server Logs

`server-logs`

Contains:

- `api.log`
- `web.log`

These logs help distinguish application or environment failures from test failures.

## Failure Evidence

The CI workflow uploads reports and logs with `if: always()`, so evidence is still collected when a test fails.

This helps answer a basic QA troubleshooting question:

**Did the application fail, did the environment fail, or did the test fail?**

## CI Environment

The workflow:

1. Starts a MySQL 8 service container
2. Creates the provisioning database schema
3. Starts FastAPI and the web server
4. Confirms both services are healthy
5. Runs the Playwright UI, API, and database tests
6. Generates reports
7. Uploads the available test evidence

The test run is associated with the GitHub commit that triggered the workflow, making it possible to connect the results back to a specific code change.
