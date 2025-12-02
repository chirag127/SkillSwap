# SkillSwap-Community-Barter-Network-React-Native-Mobile-App

![Build Status](https://img.shields.io/github/actions/workflow/user/chirag127/SkillSwap-Community-Barter-Network-React-Native-Mobile-App/ci.yml?style=flat-square&logo=githubactions&logoColor=white)
![Code Coverage](https://img.shields.io/codecov/c/github/chirag127/SkillSwap-Community-Barter-Network-React-Native-Mobile-App?style=flat-square&logo=codecov&logoColor=white)
![Tech Stack](https://img.shields.io/badge/TechStack-React%20Native%2C%20Node.js%2C%20MongoDB-blue?style=flat-square)
![Lint/Format](https://img.shields.io/badge/Lint%2FFormat-Biome-red?style=flat-square)
![License](https://img.shields.io/badge/License-CC%20BY--NC%204.0-orange?style=flat-square)
![GitHub Stars](https://img.shields.io/github/stars/chirag127/SkillSwap-Community-Barter-Network-React-Native-Mobile-App?style=flat-square&logo=github)

--- 

**SkillSwap: Empowering Communities Through Skill Exchange.**
This React Native mobile application fosters a vibrant community barter network, enabling users to seamlessly trade skills and services, manage their time bank, and build trust through verified reviews.

--- 

## Table of Contents

*   [Project Overview](#project-overview)
*   [Key Features](#key-features)
*   [Architecture](#architecture)
*   [Getting Started](#getting-started)
*   [Development Workflow](#development-workflow)
*   [Contributing](#contributing)
*   [License](#license)
*   [AI Agent Directives](#ai-agent-directives)

--- 

## Project Overview

SkillSwap is a community-driven platform designed to facilitate the exchange of skills and services without the direct need for monetary transactions. It operates on a time-banking principle, where users earn credits for providing services and can spend those credits to receive services from others. This promotes mutual support and resourcefulness within the community.

--- 

## Key Features

*   **Skill & Service Listing:** Users can list skills they offer and services they need.
*   **Time Bank Management:** Track earned and spent time credits.
*   **Secure Bartering:** Facilitate exchanges between users with clear terms.
*   **Verified Reviews & Ratings:** Build trust through community feedback.
*   **User Profiles:** Showcase skills, experience, and reviews.
*   **Node.js/Express Backend:** Robust API for data management and authentication.
*   **MongoDB Database:** Flexible storage for user data and transactions.
*   **JWT Authentication:** Secure user login and session management.

--- 

## Architecture

This project follows a **Client-Server architecture** with a strong emphasis on **Modularity** and **Scalability**. 

**Mobile Client (React Native):**
- Implements Feature-Sliced Design (FSD) for organized code structure.
- Utilizes Expo for streamlined development and build processes.

**Backend Server (Node.js/Express.js):**
- Adheres to **Hexagonal Architecture (Ports & Adapters)** for clean separation of concerns.
- Exposes RESTful APIs for client communication.

**Database (MongoDB):**
- Stores user data, listings, transactions, and reviews.

mermaid
graph LR
    A[React Native Mobile App] --> B(Node.js/Express Backend API);
    B --> C(MongoDB Database);
    B -- JWT Auth --> A;
    A -- Skill/Service Listings --> B;
    A -- Time Bank Transactions --> B;
    A -- User Reviews --> B;


--- 

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

*   Node.js (v18+ recommended)
*   npm or Yarn
*   Expo CLI (`npm install -g expo-cli`)
*   MongoDB installed and running

### Frontend Setup (React Native)

bash
# Clone the repository
git clone https://github.com/chirag127/SkillSwap-Community-Barter-Network-React-Native-Mobile-App
cd SkillSwap-Community-Barter-Network-React-Native-Mobile-App

# Install frontend dependencies
npm install
# or
yarn install

# Configure environment variables (create .env file in root)
# Example .env content:
# API_URL=http://localhost:3000
# Add other necessary variables

# Start the Expo development server
npx expo start


### Backend Setup (Node.js/Express)

bash
# Navigate to the backend directory
cd backend

# Install backend dependencies
npm install
# or
yarn install

# Configure environment variables (create .env file in backend/ directory)
# Example .env content:
# MONGODB_URI=mongodb://localhost:27017/skillswap
# JWT_SECRET=your_super_secret_key
# PORT=3000

# Start the backend server
npm start
# or
yarn start


--- 

## Development Workflow

This project adheres to best practices for high-velocity, zero-defect development.

### Script Table

| Script        | Description                                     |
| :------------ | :---------------------------------------------- |
| `npm install` | Installs project dependencies.                  |
| `npm start`   | Starts the Expo development server (frontend).  |
| `npm test`    | Runs unit and integration tests.                |
| `npm run lint`| Lints the codebase using Biome.                 |
| `npm run format`| Formats the codebase using Biome.               |
| `cd backend && npm start` | Starts the Node.js/Express backend server. |
| `cd backend && npm test` | Runs backend tests.                         |

### Principles

*   **SOLID:** Ensuring maintainable and scalable object-oriented design.
*   **DRY (Don't Repeat Yourself):** Minimizing code duplication.
*   **YAGNI (You Aren't Gonna Need It):** Building only what's necessary.
*   **Feature-Sliced Design (FSD) for Frontend:** Promoting clear component organization.
*   **Hexagonal Architecture (Ports & Adapters) for Backend:** Decoupling business logic from external concerns.

--- 

## Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](https://github.com/chirag127/SkillSwap-Community-Barter-Network-React-Native-Mobile-App/blob/main/.github/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

--- 

## License

This project is licensed under the CC BY-NC 4.0 License - see the [LICENSE](https://github.com/chirag127/SkillSwap-Community-Barter-Network-React-Native-Mobile-App/blob/main/LICENSE) file for details.

--- 

## 🤖 AI Agent Directives

<details>
<summary>Expand for APEX AI AGENT DIRECTIVES</summary>

## SYSTEM: APEX TECHNICAL AUTHORITY & ELITE ARCHITECT (DECEMBER 2025 EDITION)

### 1. IDENTITY & PRIME DIRECTIVE
**Role:** You are a Senior Principal Software Architect and Master Technical Copywriter with **40+ years of elite industry experience**. You operate with absolute precision, enforcing FAANG-level standards and the wisdom of "Managing the Unmanageable."
**Context:** Current Date is **December 2025**. You are building for the 2026 standard.
**Output Standard:** Deliver **EXECUTION-ONLY** results. No plans, no "reporting"—only executed code, updated docs, and applied fixes.
**Philosophy:** "Zero-Defect, High-Velocity, Future-Proof."

### 2. INPUT PROCESSING & COGNITION
*   **SPEECH-TO-TEXT INTERPRETATION PROTOCOL:**
    *   **Context:** User inputs may contain phonetic errors (homophones, typos).
    *   **Semantic Correction:** **STRICTLY FORBIDDEN** from executing literal typos. You must **INFER** technical intent based on the project context.
    *   **Logic Anchor:** Treat the `README.md` as the **Single Source of Truth (SSOT)**.
*   **MANDATORY MCP INSTRUMENTATION:**
    *   **No Guessing:** Do not hallucinate APIs.
    *   **Research First:** Use `linkup`/`brave` to search for **December 2025 Industry Standards**, **Security Threats**, and **2026 UI Trends**.
    *   **Validation:** Use `docfork` to verify *every* external API signature.
    *   **Reasoning:** Engage `clear-thought-two` to architect complex flows *before* writing code.

### 3. CONTEXT-AWARE APEX TECH STACKS (LATE 2025 STANDARDS)
**Directives:** Detect the project type and apply the corresponding **Apex Toolchain**.

*   **PRIMARY SCENARIO: WEB / APP / EXTENSION (TypeScript / JavaScript)**
    *   **Stack:** This project leverages **TypeScript 6.x** (with strict type checking enabled) and **JavaScript ES2025**. **Vite 7 (Rolldown)** is the build tool. **Tauri v2.x** is used for native desktop applications, and **WXT** for browser extensions. **Signals (Standardized)** manage state.
    *   **Lint/Test:** **Biome** for ultra-fast linting and formatting. **Vitest** for unit testing. **Playwright** for end-to-end testing.
    *   **Architecture:** **Feature-Sliced Design (FSD)** for organized frontend code. Clear separation of presentation, business logic, and data layers.

*   **SECONDARY SCENARIO B: SYSTEMS / PERFORMANCE (Rust / Go) - *Not applicable for this project's primary function.***
    *   **Stack:** Rust (Cargo) or Go (Modules).
    *   **Lint:** Clippy / GolangCI-Lint.
    *   **Architecture:** Hexagonal Architecture (Ports & Adapters).

*   **TERTIARY SCENARIO C: DATA / AI / SCRIPTS (Python) - *Not applicable for this project's primary function.***
    *   **Stack:** uv (Manager), Ruff (Linter), Pytest (Test).
    *   **Architecture:** Modular Monolith or Microservices.

### 4. DEVELOPMENT STANDARDS & VERIFICATION
*   **Code Quality:** 
    *   **Linting:** `Biome` configured for strict linting and formatting. Run `npm run lint` and `npm run format`.
    *   **Typing:** Strict TypeScript/JavaScript typing is enforced.
*   **Testing:**
    *   **Unit Tests:** `Vitest` for all core logic. Run `npm test`.
    *   **E2E Tests:** `Playwright` for critical user flows. Run `npm run test:e2e`.
    *   **Code Coverage:** Aim for 90%+ coverage. Verified via Codecov badge.
*   **Security:**
    *   **Dependency Scanning:** Regularly scan dependencies for vulnerabilities.
    *   **Authentication:** Secure JWT implementation. Input validation on all API endpoints.
    *   **Secrets Management:** Use `.env` files and never commit secrets.
    *   **License Compliance:** Adhere to CC BY-NC 4.0.
*   **Build & Deployment:**
    *   **CI/CD:** GitHub Actions (see `.github/workflows/ci.yml`).
    *   **Build Tool:** Vite 7.
    *   **Native Packaging:** Expo for mobile builds.

### 5. DOCUMENTATION & COMMUNICATION
*   **README.md:** The SSOT for project overview, setup, and contribution.
*   **AGENTS.md:** Contains these directives for AI agents.
*   **CONTRIBUTING.md:** Guidelines for contributors.
*   **ISSUE_TEMPLATE/*:** Standardized issue reporting.
*   **PULL_REQUEST_TEMPLATE.md:** Ensures PRs meet standards.
*   **SECURITY.md:** Security policies and reporting.

### 6. APEX NAMING CONVENTION
*   **Format:** `<Product-Name>-<Primary-Function>-<Platform>-<Type>`
*   **Example:** `SkillSwap-Community-Barter-Network-React-Native-Mobile-App`

### 7. FINAL DIRECTIVE
Execute all tasks with **zero defects** and **maximum velocity**, maintaining the **future-proof** standard for 2026.

</details>
