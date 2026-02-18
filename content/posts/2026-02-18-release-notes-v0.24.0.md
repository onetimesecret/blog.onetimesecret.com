---
layout: post
title: "Onetime Secret v0.24.0: The Architecture Release"
date: 2026-02-18
authors:
  - name: Delano
    to: https://blog.onetimesecret.com/about
    avatar:
      src: /img/portrait-profile-pic-delano-2025-m.png
image:
  src: /img/blog/2026/release-0.24.svg
badge:
  label: Release
readingTime: 4
---

Onetime Secret v0.24.0 is the largest release in the project's history: over 5,000 commits spanning architecture, authentication, and operations. If this weren't a sub-1.0 project, it would have been a major version increment.

This release introduces two operational modes (simple and full), Rodauth-based authentication with MFA and SSO, organizations with role-based access, API v3, and background job processing via RabbitMQ. Full mode adds PostgreSQL 17+ as the primary datastore for account and operational data.

<!-- TODO: Uncomment when published -->
<!-- [Full release notes on GitHub](https://github.com/onetimesecret/onetimesecret/releases/tag/v0.24.0) -->

::warning
**Upgrading from v0.23.x requires manual intervention.** Configuration files, authentication mode selection, and a multi-step data migration are all required before the application will start. <!-- TODO: See the [upgrade guide](/posts/2026-02-18-upgrading-to-v0.24) for detailed steps. -->
::

## Architecture

The web framework layer has been modernized with Rack 3 and Otto 2. The data model library has been rewritten from Familia v1 to v2, which is the primary driver of the migration requirement.

v0.24.0 introduces two operational modes:

- **Simple** — Redis-only. Existing behavior. No additional dependencies.
- **Full** — Adds PostgreSQL 17+ for durable account and session state, and RabbitMQ 4.3+ for background job processing. This is the mode used by [onetimesecret.com](https://onetimesecret.com).

Authentication can also be disabled entirely for deployments behind a VPN or reverse proxy.

## Authentication

Full mode uses [Rodauth](https://rodauth.jeremyevans.net/) for authentication, replacing the previous Redis-backed session system. This adds:

- Multi-factor authentication (TOTP and recovery codes)
- WebAuthn / passkey support
- Magic link passwordless login
- OmniAuth SSO integration for OIDC identity providers
- Argon2id password hashing with transparent bcrypt migration for existing accounts

Signin and signup routes are controlled via `AUTH_SIGNIN_ENABLED` and `AUTH_SIGNUP_ENABLED` feature flags.

## Organizations and Billing

Organizations replace Teams as the primary grouping model. Organization owners can invite members, assign roles, and manage permissions. Custom domains are now scoped to organizations rather than individual accounts.

The billing system introduces entitlement enforcement, plan switching for existing Stripe subscribers, and HMAC-based subscription federation for cross-region benefit sharing.

## API

API v3 is introduced alongside a reconstituted V1 API. Guest access is available via `/share` endpoints for anonymous users. External identifiers now use an opaque identifier pattern (ExtId/ObjId), and OpenAPI generation infrastructure is in place.

## Background Jobs

RabbitMQ 4.3+ handles email delivery (including delayed delivery for expiration warnings), secret reveal notifications, and asynchronous Stripe webhook processing. Health check endpoints include RabbitMQ connection monitoring. Dead-letter queue management is available via CLI.

## Also in This Release

**i18n**: 27 languages are now supported for email templates. Locale files have been split into a modular structure and migrated from kebab-case to snake_case. The custom i18n implementation has been replaced with the `ruby-i18n` gem, with SHA256-based change tracking for translations.

**CLI**: Migrated from drydock to dry-cli. New commands include `bin/ots status`, domain verification, DLQ management, and billing catalog management. Bin wrappers added for frontend, scheduler, and Stripe webhook processes.

**Logging**: SemanticLogger replaces the custom logging system. Structured output with correlation tracking, monotonic timing, and fork-safe logging for Puma cluster mode. HTTP request logging is configured via `logging.yaml`.

**Health**: Health check endpoints with RabbitMQ connection monitoring.

## New Contributors

- [@aprivette](https://github.com/aprivette) ([#1620](https://github.com/onetimesecret/onetimesecret/pull/1620))
- [@jhob101](https://github.com/jhob101) ([#1840](https://github.com/onetimesecret/onetimesecret/pull/1840))
- [@david-garcia-garcia](https://github.com/david-garcia-garcia) ([#1936](https://github.com/onetimesecret/onetimesecret/pull/1936))
- [@kh0mka](https://github.com/kh0mka) ([#2130](https://github.com/onetimesecret/onetimesecret/pull/2130))

## Installation

<!-- TODO: Update Docker tag when published -->

**Docker**: `docker pull onetimesecret/onetimesecret:v0.24.0`

**Source**: [GitHub Release](https://github.com/onetimesecret/onetimesecret/releases/tag/v0.24.0)

::ImageModal{src="/img/blog/2026/release-0.24.svg" alt="Onetime Secret v0.24.0 release illustration" width="600"}
::
