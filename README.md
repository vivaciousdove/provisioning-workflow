[![CI](https://github.com/vivaciousdove/provisioning-workflow/actions/workflows/ci.yml/badge.svg)](https://github.com/vivaciousdove/provisioning-workflow/actions/workflows/ci.yml)

# Provisioning Workflow — End-to-End QA Automation

A hands-on QA project that tests a provisioning request across the **UI, API, and database** using **Playwright, FastAPI, MySQL, GitHub Actions, and Allure**.

The goal was to build something that behaves more like a real workflow than an isolated UI or API test.

## What It Tests

A provisioning request moves through the system like this:

**UI → API → Database**

The automated tests verify that:

- A user can submit a provisioning request through the UI
- The API accepts and processes the request
- MySQL stores the expected data
- The workflow behaves correctly from end to end

## Tools

- **Playwright** — UI and end-to-end automation
- **FastAPI** — backend API
- **MySQL** — database validation
- **GitHub Actions** — automated test execution
- **Allure** — test reporting

## CI/CD

The GitHub Actions workflow runs on:

- Push to `main`
- Pull requests into `main`
- Manual `workflow_dispatch`

During a run, the workflow:

1. Starts MySQL
2. Creates the required database schema
3. Starts the FastAPI backend and web server
4. Waits for the services to become healthy
5. Runs the Playwright tests
6. Generates test reports
7. Uploads the test evidence

## Test Evidence

Each CI run can produce:

- Playwright HTML report
- Screenshots, videos, and traces
- Allure results and HTML report
- API and web server logs

This makes it easier to investigate a failure instead of relying only on a pass/fail result.

## Run Locally

### Requirements

- Node.js 20+
- Python 3.12+
- MySQL 8.0

### Install

```bash
npm ci
python -m pip install -r requirements.txt
npx playwright install chromium
```

### Start the API

```bash
python -m uvicorn backend.api:app --host 127.0.0.1 --port 8000
```

### Start the Web Server

```bash
python -m http.server 5173 --directory web --bind 127.0.0.1
```

### Set the Application URLs

PowerShell:

```powershell
$env:WEB_BASE_URL="http://127.0.0.1:5173"
$env:API_BASE_URL="http://127.0.0.1:8000"
```

### Run the Tests

```bash
npx playwright test
```

## What I Practiced

This project gave me hands-on practice connecting **UI automation, API behavior, database validation, CI/CD, troubleshooting, and test reporting** in one workflow.
