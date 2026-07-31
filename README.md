# Playwright Test Automation — Hackathon Project

## Overview
This repository contains a Playwright end-to-end test suite covering guest, user, and admin flows for a hackathon project. The base framework and initial test scaffolding were already in place when I joined; my contributions below were built on top of that existing setup.

## My Contributions

| Branch | Description | Test Cases Added |
|---|---|---|
| `feat/guest-login-coverage-plan` | Guest Sign In modal happy-path test from the header, plus a coverage plan mapping remaining login/booking scenarios still needing tests | 1 |
| `feat/performance-coverage` | Navigation Timing API budget checks across guest (home, our-cars, about-us, booking), user (profile, booking, T&C, payment), and admin (cars, bookings) pages | 10 |
| `feat/lighthouse-coverage` | Lighthouse audits (performance, accessibility, best practices, SEO) across guest, user, and admin pages, tagged `@lighthouse` for isolated runs | 4 |
| `feat/pom-refactor` | Refactored guest/user/admin coverage into a Page Object Model: 11 page/component classes, a `PageManager`, and a `pom` fixture (with the ad-blocker fixture composed on top) | 0 (architecture only) |

**Total new test cases added: 15**, plus an architectural refactor into a Page Object Model for long-term maintainability of the suite.

## What This Demonstrates
- Identifying and closing real coverage gaps (guest login, performance budgets, accessibility) in an existing framework rather than starting from scratch
- Working with Playwright's Navigation Timing API and Lighthouse integration for non-functional testing (performance, accessibility)
- Structuring test suites for maintainability (Page Object Model, fixture composition) even where that work doesn't add new test cases directly

## Background
Built as part of a hackathon project on top of a shared starter repository, with the base framework already in place.
