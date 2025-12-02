# 🚀 Contributing to SkillSwap-Community-Barter-Network-React-Native-Mobile-App

Welcome to the SkillSwap community! We're excited to have you contribute to our React Native mobile app, a platform designed to foster a vibrant community-based barter economy.

## 1. Our Guiding Principles

We adhere to the core Apex Technical Authority philosophy: **"Zero-Defect, High-Velocity, Future-Proof."** This translates to:

*   **Quality First:** Every contribution should strive for correctness and robustness.
*   **Efficiency:** Streamlined workflows enable rapid iteration and deployment.
*   **Sustainability:** Codebase must be maintainable and adaptable for future growth.

## 2. Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [your-email@example.com](mailto:your-email@example.com).

## 3. How to Contribute

### 3.1. Setup Your Development Environment

Follow the setup instructions in the main `README.md` to get the project running locally. This typically involves:

1.  **Cloning the Repository:**
    bash
    git clone https://github.com/chirag127/SkillSwap-Community-Barter-Network-React-Native-Mobile-App.git
    cd SkillSwap-Community-Barter-Network-React-Native-Mobile-App
    
2.  **Installing Dependencies:** (Assuming Node.js and npm/yarn are installed)
    bash
    # For npm
    npm install
    # Or for yarn
    yarn install
    
3.  **Backend Setup:** Refer to the backend documentation within the project for its specific setup and running instructions.

### 3.2. Feature Development Workflow

*   **Identify an Issue/Feature:** Look for open issues on the GitHub repository or propose a new feature.
*   **Branching Strategy:** Create a new branch for your feature or bug fix. Use a descriptive name (e.g., `feature/user-profile-enhancement`, `bugfix/login-validation-error`).
    bash
    git checkout -b your-branch-name
    
*   **Develop:** Implement your changes following the project's coding standards and architectural patterns.
*   **Test:** Write unit and integration tests for your new code using `Vitest` (for frontend) and `Jest`/`Supertest` (for backend).
*   **Lint & Format:** Ensure your code adheres to the project's linting and formatting rules. Run `npm run lint` and `npm run format` (or equivalent `yarn` commands).
*   **Commit:** Make clear, concise, and atomic commits.
    bash
    git add .
    git commit -m "feat: Add user profile editing functionality"
    
*   **Pull Request (PR):** Open a Pull Request against the `main` branch. Provide a detailed description of your changes, the problem they solve, and how to test them.

### 3.3. Code Standards & Best Practices

*   **Language:** Primarily JavaScript (ES6+), with TypeScript for enhanced type safety in relevant modules.
*   **Frontend Framework:** React Native with Expo.
*   **Backend Framework:** Node.js with Express.js.
*   **State Management:** Use React Context API or a suitable library for global state.
*   **Styling:** Employ a consistent styling approach, likely using StyleSheet API or a compatible library.
*   **Testing:** Comprehensive test coverage is expected. Aim for high code coverage metrics.
*   **SOLID Principles:** Adhere to SOLID principles wherever applicable to ensure maintainable and scalable code.
*   **DRY (Don't Repeat Yourself):** Avoid redundant code. Utilize reusable components and utility functions.
*   **YAGNI (You Aren't Gonna Need It):** Implement only what is currently needed, avoiding premature optimization or over-engineering.

## 4. Submitting a Pull Request

*   **Ensure your fork is up-to-date:**
    bash
    git fetch upstream
    git merge upstream/main
    
*   **Run all tests and linters:** Verify that all checks pass locally.
*   **Write a clear PR description:** Explain your changes, motivation, and any potential impact.
*   **Link to the relevant issue:** If your PR addresses an issue, reference it using keywords like `Fixes #123` or `Closes #456`.

## 5. Reporting Bugs

If you find a bug, please open an issue. Provide as much detail as possible:

*   **Steps to Reproduce:** Clear, numbered steps to trigger the bug.
*   **Expected Behavior:** What should have happened?
*   **Actual Behavior:** What actually happened?
*   **Environment:** Device, OS version, App version.
*   **Screenshots/Videos:** If helpful.

## 6. Feature Requests

We welcome new feature ideas! Please open an issue and describe your proposed feature, its benefits, and how you envision it working.

## 7. Questions?

If you have any questions or need clarification, feel free to open an issue or reach out to the maintainers.

Thank you for contributing to SkillSwap! Your efforts help build a stronger community.
