# Browser QA

CompanyForge can run browser QA against a real preview URL using Playwright/Chromium in GitHub Actions.

Checks include page load, non-blank content, headings, navigation links, interactive controls, console errors, and uncaught page errors.

A failing browser check exits non-zero. No deployment URL is fabricated.
