[![CI](https://github.com/vivaciousdove/provisioning-workflow/actions/workflows/ci.yml/badge.svg)](https://github.com/vivaciousdove/provisioning-workflow/actions/workflows/ci.yml)
[![Allure Pages](https://github.com/vivaciousdove/provisioning-workflow/actions/workflows/allure-pages.yml/badge.svg)](https://github.com/vivaciousdove/provisioning-workflow/actions/workflows/allure-pages.yml)

# Provisioning Workflow — End-to-End QA Automation System

This project demonstrates modern Software Quality Engineering and SDET practices across a full system stack.

It validates a realistic provisioning workflow across the **UI, API, and database layers**, with automation integrated into CI and test reporting.

---

# 🎯 Project Purpose

Manual testing of multi-layer workflows is slow, error-prone, and difficult to scale.

This project shows how automation replaces high-risk manual testing by creating a **repeatable quality gate** for releases.

---

# 🧪 What This Project Proves (Quality Engineering Perspective)

This project demonstrates how I apply Software Quality Engineering and SDET principles in modern systems:

- End-to-end validation across UI, API, and database layers  
- Automation designed to replace high-risk manual testing  
- Backend and data integrity verification beyond UI checks  
- CI-integrated quality gates supporting release confidence  
- Explicit failure-path and negative testing  

These practices reflect the same quality engineering mindset used in enterprise environments, demonstrated here using modern web and API tooling.

---

# 🏗️ System Architecture

Browser (Playwright Tests)  
↓  
Frontend Web App  
↓  
FastAPI Backend  
↓  
MySQL Database  
↓  
GitHub Actions CI + Allure Reports

---

# 🛠️ Tech Stack

| Layer | Tools |
|---|---|
| UI Automation | Playwright |
| API Testing | Python + FastAPI |
| Database Validation | MySQL |
| CI/CD | GitHub Actions |
| Reporting | Allure Reports |
| Languages | Python, JavaScript |

---

# 🔍 Test Coverage

## UI Layer
- End-to-end workflow validation  
- Form validation and error handling  
- Cross-browser automation  

## API Layer
- Endpoint validation  
- Data integrity checks  
- Negative testing and failure paths  

## Database Layer
- Verify data persistence  
- Validate workflow side effects  
- Confirm system state after operations  

---

# ⚙️ CI Pipeline

Every push triggers automated validation:

1. Install dependencies  
2. Launch backend service  
3. Run Playwright tests  
4. Generate Allure report  
5. Publish test results  

This creates a **release confidence gate** for every change.

---

# 🚀 Running the Full Stack Locally

This project runs **frontend + backend + database + end-to-end tests together**.

---

## Prerequisites

Install before starting:

- Python 3.10+
- Node.js 18+
- MySQL 8+
- Git

---

## 1️⃣ Start MySQL Database

Open MySQL and create the database:

```sql
CREATE DATABASE provisioning_lab;
```
| Setting  | Value            |
| -------- | ---------------- |
| Host     | localhost        |
| Port     | 3306             |
| User     | root             |
| Password | root             |
| Database | provisioning_lab |

## 2️⃣ Start Backend API (FastAPI)
```bash
pip install -r requirements.txt
uvicorn backend.api:app --reload
```
## 3️⃣ Start Frontend Web App
```bash
cd web
npm install
npm run dev

Open UI:
http://localhost:5173
```
## 4️⃣ Install Playwright Browsers
```bash
npm install
npx playwright install
```
## 5️⃣ Run End-to-End Tests
```bash
npx playwright test
```
Artifacts generated:
```powershell
playwright-report/
test-results/
allure-results/
```
## 6️⃣ View Reports Locally
Playwright HTML Report
```
npx playwright show-report
```
Allure Report
```
npx allure serve allure-results
```

| Service           | URL                                                      |
| ----------------- | -------------------------------------------------------- |
| FastAPI Swagger   | [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) |
| Frontend UI       | [http://localhost:5173](http://localhost:5173)           |
| Playwright Report | Generated locally                                        |
| Allure Report     | Generated locally                                        |

