# Security Policy for SkillSwap

## Our Commitment

The SkillSwap team is deeply committed to the security and integrity of our platform and the privacy of our community. We value the work of independent security researchers and believe that responsible disclosure is essential for maintaining a secure environment. This policy outlines our process for receiving, triaging, and addressing security vulnerabilities.

## Reporting a Vulnerability

We take all security reports seriously. If you believe you have discovered a security vulnerability in the SkillSwap mobile application, backend API, or any related infrastructure, please report it to us through one of the following methods.

### Primary Method: GitHub Private Vulnerability Reporting

This is the preferred method for reporting vulnerabilities. It ensures that your report is delivered directly to our security team while remaining confidential.

**[Submit a private vulnerability report via GitHub](https://github.com/chirag127/SkillSwap-Community-Skill-Exchange-Mobile-App/security/advisories/new)**

### Alternative Method: Security Email

If you are unable to use GitHub's private reporting feature, you can email our security team at `security.skillswap@chirag127.dev`. Please use a descriptive subject line, such as `[SECURITY] Vulnerability in SkillSwap API`.

### What to Include

To help us resolve the issue quickly, please provide a detailed report including:

*   **Description**: A clear and concise description of the vulnerability and its potential impact.
*   **Proof-of-Concept**: The precise steps to reproduce the vulnerability. Include any relevant code snippets, screenshots, or screen recordings.
*   **Affected Components**: The specific version of the mobile app, API endpoint, or component that is affected.
*   **Your Contact Information**: Your name and a method to contact you (e.g., email or GitHub handle).

## Our Process (Service Level Agreement)

1.  **Acknowledgment**: We will acknowledge receipt of your report within **48 hours**.
2.  **Triage**: We will triage the vulnerability and confirm its validity, typically within **5 business days**.
3.  **Resolution**: Our team will work to develop and deploy a patch. The timeline for this will vary depending on the complexity of the issue, but we will keep you informed of our progress.
4.  **Disclosure**: We follow a policy of coordinated disclosure and will work with you to publicly disclose the vulnerability **90 days** after the initial report, or once a patch is widely available.

## Supported Versions

Security updates are only applied to the latest major version of the SkillSwap mobile application available on the official app stores. We encourage all users to keep their app updated.

| Version | Supported          |
| :------ | :----------------- |
| `2.x`   | :white_check_mark: |
| `1.x`   | :x:                |

## Scope

The following areas are considered **in-scope** for our vulnerability disclosure program:

*   The SkillSwap React Native mobile application.
*   The official backend API endpoints (`api.skillswap.app`).
*   Authentication and authorization mechanisms.

### Out of Scope

The following are **out-of-scope** and not eligible for this program:

*   Attacks requiring physical access to a user's device.
*   Social engineering or phishing attacks targeting users or staff.
*   Denial of Service (DoS/DDoS) attacks.
*   Outdated client-side issues on unsupported operating systems or browsers.
*   Reports from automated scanners without a manual proof-of-concept.

Thank you for helping us keep SkillSwap and our community safe.