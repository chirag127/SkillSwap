# Contributing to SkillSwap-Community-Skill-Exchange-Mobile-App

Thank you for considering contributing to the SkillSwap community! We welcome your ideas, bug reports, and code contributions to make SkillSwap an even better platform for community-driven skill and service exchange.

## Guiding Principles

Our development follows the Apex Technical Authority's philosophy: "Zero-Defect, High-Velocity, Future-Proof." This means we prioritize:

*   **Quality:** Robustness, reliability, and adherence to best practices.
*   **Speed:** Efficient development cycles and clear contribution pathways.
*   **Sustainability:** Maintainable, scalable, and adaptable code.

## How to Contribute

### 1. Reporting Bugs

Before reporting a bug, please check the existing issues to see if it has already been reported.

If it's a new bug:

*   **Navigate to the Issues tab** on GitHub.
*   **Click "New Issue"** and select the `Bug Report` template.
*   **Provide a clear and concise title.**
*   **Describe the bug in detail:**
    *   What did you expect to happen?
    *   What actually happened?
    *   Steps to reproduce the bug (including device, OS version, app version if applicable).
    *   Screenshots or screen recordings are highly encouraged.
*   **Add any relevant logs or error messages.**

## 2. Suggesting Enhancements or Features

We love new ideas!

*   **Navigate to the Issues tab** on GitHub.
*   **Click "New Issue"** and select the `Feature Request` template.
*   **Describe your suggestion** clearly.
*   **Explain why** this feature would be valuable to the SkillSwap community.

## 3. Contributing Code

We encourage pull requests for bug fixes and new features.

### Prerequisites

*   **Fork the repository** to your GitHub account.
*   **Clone your forked repository** locally:
    bash
    git clone https://github.com/chirag127/SkillSwap-Community-Skill-Exchange-Mobile-App
    cd SkillSwap-Community-Skill-Exchange-Mobile-App
    
*   **Set up your development environment:** Follow the instructions in the `README.md` to install dependencies (likely using Expo CLI for React Native).

### Development Workflow

1.  **Create a New Branch:** Always branch from the `main` branch. Give your branch a descriptive name (e.g., `fix/login-bug`, `feat/add-user-profile`).
    bash
    git checkout -b fix/my-bug-fix
    
2.  **Make Your Changes:** Write clean, well-commented code. Adhere to the project's coding style and architectural patterns.
3.  **Test Your Changes:** Ensure your changes do not introduce regressions. Run the relevant tests. For React Native, this typically involves:
    *   Manual testing on emulators/devices.
    *   Running unit/integration tests (if applicable, via Jest or similar).
    *   Leveraging Expo's development tools for live reloading and debugging.
4.  **Commit Your Changes:** Write clear and concise commit messages. Follow conventional commits if possible.
    bash
    git add .
    git commit -m "fix: Resolve issue with user authentication flow"
    
5.  **Push Your Branch:** Push your changes to your fork.
    bash
    git push origin fix/my-bug-fix
    
6.  **Create a Pull Request (PR):**
    *   Navigate to the `SkillSwap-Community-Skill-Exchange-Mobile-App` repository on GitHub.
    *   Click the **"Compare & pull request"** button.
    *   Ensure your branch is compared against the `main` branch of the original repository.
    *   **Fill out the Pull Request Template:** Provide a clear title and a detailed description of your changes. Explain the problem solved and the solution implemented.
    *   Link any related issues (e.g., `Closes #123`).

### Code Standards & Best Practices

*   **Readability:** Write clear, concise, and well-documented code.
*   **Consistency:** Adhere to the existing code style (e.g., formatting, naming conventions). We use ESLint and Prettier configured within the Expo project.
*   **Modularity:** Design components and modules for reusability and separation of concerns.
*   **Error Handling:** Implement robust error handling mechanisms.
*   **Security:** Be mindful of security best practices, especially when handling user data or interacting with APIs.

## AI Agent Directives & Environment Setup

For detailed insights into our architectural patterns, AI integrations (if any), and specific verification commands, please refer to the **AI Agent Directives** section within the `README.md` file. This section outlines the core principles and tools we rely on, ensuring alignment for all contributors.

## Licensing

By contributing to this project, you agree that your contributions will be licensed under the **CC BY-NC 4.0 License**.

---