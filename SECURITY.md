# Security Policy

## Supported versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a vulnerability

Please report security issues to **bizykov@gmail.com** (do not use public issues).  
We will respond within 48 hours and release a fix as soon as possible.

## Security best practices in this project

- JWT tokens stored in HttpOnly cookies (or localStorage with precautions)
- CSRF protection via token
- Input validation on all forms
- Regular dependency updates via Dependabot