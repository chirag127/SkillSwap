# SkillSwap-Community-Barter-Network-React-Native-Mobile-App

A cutting-edge React Native mobile application fostering a vibrant community-driven barter economy, enabling seamless trading of skills and services.

---

## Project Overview

SkillSwap empowers communities by facilitating a direct exchange of skills and services without the need for traditional currency. Users can offer their talents (e.g., graphic design, tutoring, handyman services) and find others offering skills they need, creating a robust and interconnected local economy. The application is built with modern, performant technologies to ensure a smooth user experience.

---

## 🚀 Features

*   **Skill & Service Marketplace:** Browse, search, and list diverse skills and services available for barter.
*   **Time Bank System:** Utilize a transparent time-based currency to track exchanges and ensure fairness.
*   **Verified Reviews & Ratings:** Build trust and reputation through a secure system for user feedback.
*   **User Profiles:** Showcase skills, experience, and availability.
*   **Secure Messaging:** Communicate directly and safely with other users.
*   **Node.js/Express Backend:** Robust and scalable API powering the application.
*   **MongoDB Database:** Flexible and efficient data storage.
*   **JWT Authentication:** Secure user login and session management.

---

## 🛠️ Technology Stack

*   **Frontend (Mobile):** React Native, Expo
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB
*   **Authentication:** JWT (JSON Web Tokens)
*   **Development Language:** JavaScript

---

## 🏗️ Architecture

This project follows a **Client-Server architecture** with a **Modular Monolith** pattern on the backend for maintainability and scalability.

mermaid
graph TD
    A[React Native Mobile Client] --> B(API Gateway / Express.js Backend);
    B --> C{MongoDB Database};
    B --> D[JWT Auth Module];
    A --> E(Real-time Messaging Service - e.g., Socket.IO);
    B --> E;
    subgraph Backend
        B
        D
        E
    end


---

## 🤖 AI Agent Directives

<details>
  <summary>View AI Agent Directives</summary>

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
**Directives:** Detect the project type and apply the corresponding **Apex Toolchain**. This repository, `SkillSwap-Community-Barter-Network-React-Native-Mobile-App`, is a JavaScript-based mobile application.

*   **PRIMARY SCENARIO: WEB / APP / EXTENSION (TypeScript/JavaScript)**
    *   **Stack:** This project leverages **JavaScript (ES2023+)** with **React Native** and **Expo** for cross-platform mobile development. State management adheres to **Signals** (or equivalent like Zustand/Jotai for React Native). For UI, **Tailwind CSS** (or native equivalent like `NativeWind`) is preferred for utility-first styling. Testing is handled by **Vitest** for unit/integration and **Playwright** for E2E mobile testing (if applicable via simulators).
    *   **Architecture:** Adheres to **Feature-Sliced Design (FSD)** principles for frontend organization, ensuring clear boundaries between features, layers, and shared code. Backend services integrate via RESTful APIs or GraphQL.
    *   **Lint/Format:** **Biome** is used for ultra-fast linting and code formatting.

*   **SECONDARY SCENARIO B: SYSTEMS / PERFORMANCE (Rust/Go) - *Not applicable for this project's primary function.***
    *   **Stack:** Rust (Cargo) or Go (Modules).
    *   **Lint:** Clippy / GolangCI-Lint.
    *   **Architecture:** Hexagonal Architecture (Ports & Adapters).

*   **TERTIARY SCENARIO C: DATA / AI / SCRIPTS (Python) - *Not applicable for this project's primary function.***
    *   **Stack:** uv (Manager), Ruff (Linter), Pytest (Test).
    *   **Architecture:** Modular Monolith or Microservices.

### 4. CODE QUALITY & DEVELOPMENT PRINCIPLES
*   **SOLID Principles:** Adhere rigorously to Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.
*   **DRY (Don't Repeat Yourself):** Eliminate redundant code through abstraction and modularity.
*   **YAGNI (You Ain't Gonna Need It):** Implement features only when required, avoiding speculative complexity.
*   **KISS (Keep It Simple, Stupid):** Favor straightforward solutions over overly complex ones.
*   **Defensive Programming:** Implement robust error handling, input validation, and edge case management.

### 5. TESTING STRATEGY
*   **Unit Tests:** Comprehensive coverage using **Vitest**, focusing on individual components and utility functions.
*   **Integration Tests:** Verify interactions between modules and services using **Vitest**.
*   **End-to-End (E2E) Tests:** Simulate user interactions across the application flow using **Playwright** on simulators or devices.

### 6. DEPLOYMENT & CI/CD
*   **CI/CD Pipeline:** Automate build, test, and deployment processes using GitHub Actions (triggered on push/merge to main/develop branches).
*   **Environment Management:** Utilize environment variables (e.g., `.env` files) for configuration across development, staging, and production.

### 7. SECURITY MANDATES
*   **Dependency Scanning:** Regularly scan dependencies for known vulnerabilities (e.g., `npm audit` or GitHub Dependabot).
*   **Secure Authentication:** Implement robust JWT handling, secure token storage, and refresh mechanisms.
*   **Input Sanitization:** Validate and sanitize all user inputs to prevent injection attacks (XSS, SQLi).
*   **Rate Limiting:** Protect backend APIs against abuse.
*   **HTTPS Everywhere:** Ensure all communication is encrypted.

### 8. CODE CONTRIBUTIONS
*   **Branching Strategy:** Adopt a standard Gitflow or GitHub Flow branching model.
*   **Pull Requests:** All code changes must be submitted via Pull Requests with clear descriptions and linked issues.
*   **Code Reviews:** Mandatory peer reviews for all PRs before merging.

</details>

---

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm or Yarn
*   Expo CLI (`npm install -g expo-cli` or `yarn global add expo-cli`)
*   MongoDB installed or accessible (cloud instance recommended)

### Installation

1.  **Clone the repository:**
    bash
    git clone https://github.com/chirag127/SkillSwap-Community-Barter-Network-React-Native-Mobile-App.git
    cd SkillSwap-Community-Barter-Network-React-Native-Mobile-App
    

2.  **Install frontend dependencies:**
    bash
    npm install
    # or
    yarn install
    

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and populate it with your backend API URL and other necessary configurations.
    env
    API_BASE_URL=http://localhost:3000 # Replace with your backend URL
    MONGODB_URI=mongodb://localhost:27017/skillswap # Replace with your MongoDB connection string
    JWT_SECRET=your_super_secret_key
    

4.  **Start the development server:**
    bash
    npx expo start
    

   Follow the on-screen instructions to run the app on an iOS simulator, Android emulator, or a physical device.

### Backend Setup (Separate Repository Recommended)

Refer to the backend repository's `README.md` for specific installation and setup instructions.

---

## 📜 License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0). See the [LICENSE](LICENSE) file for details.

---

## ⭐ Star ⭐ This Repo

If you find this project useful, please consider starring it on GitHub!

[![](https://img.shields.io/github/stars/chirag127/SkillSwap-Community-Barter-Network-React-Native-Mobile-App?color=0070FF&label=Star&logo=github&style=flat-square)](https://github.com/chirag127/SkillSwap-Community-Barter-Network-React-Native-Mobile-App/stargazers)
