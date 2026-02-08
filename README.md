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

# 🚀 Running Locally

### Backend
```bash
pip install -r requirements.txt
uvicorn backend.main:app


