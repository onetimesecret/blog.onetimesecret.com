---
layout: post
title: "Onetime Secret v0.24.0: A New Foundation"
date: 2026-03-04
authors:
  - name: Delano
    to: https://blog.onetimesecret.com/about
    avatar:
      src: /img/portrait-profile-pic-delano-2025-m.png
image:
  src: /img/blog/2026/release-0.24.svg
badge:
  label: Release
readingTime: 6
---

Onetime Secret v0.24.0 is the largest release in the project's history: over 5,000 commits spanning architecture, authentication, and operations. If this weren't a sub-1.0 project, it would have been a major version increment.

The motivation behind this release is straightforward. As more organizations began self-hosting Onetime Secret, the original single-mode, Redis-only architecture started showing its limits — particularly around authentication, access control, and operational visibility. Rather than patch around those limits, we rebuilt the foundation.

Here's what's new:

- Three authentication modes — **disabled**, **simple** (Redis-only), and **full** (PostgreSQL + RabbitMQ)
- Rodauth-based authentication with MFA, passkeys, and SSO
- Organizations with role-based access, replacing the older Teams model
- API v3 with OpenAPI infrastructure
- Background job processing via RabbitMQ
- Billing consolidation with entitlement enforcement
- Frontend upgraded to Vite 6 and Tailwind CSS v4

[Full release notes on GitHub](https://github.com/onetimesecret/onetimesecret/releases/tag/v0.24.0)

::warning
**Upgrading from v0.23.x requires manual intervention.** Configuration files, authentication mode selection, and a multi-step data migration are all required before the application will start. See the [upgrade guide](https://docs.onetimesecret.com/en/self-hosting/upgrading-v0-24/) for detailed steps.
::

### Migrate or start fresh?

**Start fresh** if you don't use accounts, have few live secrets in flight, or want to adopt full authentication mode. You're not reinstalling from scratch — you start from the new default config files and re-apply your site-specific settings.

**Migrate** if you have active user accounts, live secrets that can't expire and be re-created, or API integrations that depend on stable identifiers. The Familia v1-to-v2 data migration pipeline handles the transform, and passwords migrate transparently from bcrypt to argon2id on next login.

| Situation | Recommendation |
|---|---|
| Anonymous-only instance, no accounts | Fresh start |
| Few accounts, no live secrets, moving to full auth | Fresh start |
| Few accounts, no live secrets, staying simple | Either works; fresh start is less effort |
| Active accounts, live secrets, staying simple | Migrate |
| Active accounts, live secrets, moving to full auth | Migrate |
| Public instance, many accounts, API integrations | Migrate |

## Architecture

Under the hood, the web framework layer has moved to Rack 3 and Otto 2, and the data model library has been rewritten from Familia v1 to v2. That rewrite is the primary driver behind the migration requirement — along with the new organization and authentication systems, the data shapes have changed enough that existing installs need a structured migration path.

The application is now fully multi-threaded and fork-safe for Puma cluster mode.

The front end upgraded to Vite 6 and Tailwind CSS v4. JSON serialization moved to OJ.

The most visible architectural change is the introduction of three authentication modes:

- **Disabled** — No authentication at all. Anonymous secret sharing only. Redis is the sole data store. Minimal operational footprint, ideal for deployments behind a VPN or reverse proxy that handles auth upstream.
- **Simple** — Redis-only authentication. Same behavior as v0.23, no additional dependencies. If you're running a small internal instance, this is all you need.
- **Full** — Adds PostgreSQL 17+ for durable account and session state, and RabbitMQ 4.3+ for background job processing. This is the mode used by [onetimesecret.com](https://onetimesecret.com).

## Authentication

The previous authentication system stored sessions in Redis and handled passwords directly. It worked, but it couldn't grow to support MFA, SSO, or passwordless login without becoming a bespoke auth framework — and building auth frameworks is not how we want to spend our time.

Full mode now uses [Rodauth](https://rodauth.jeremyevans.net/), which brings:

- Multi-factor authentication (TOTP and recovery codes)
- WebAuthn / passkey support
- Magic link passwordless login
- OmniAuth SSO integration for OIDC identity providers
- Argon2id password hashing with transparent bcrypt migration for existing accounts

Existing bcrypt-hashed passwords are migrated to Argon2id transparently on next login — no user action required. Signin and signup routes are controlled via `AUTH_SIGNIN_ENABLED` and `AUTH_SIGNUP_ENABLED` feature flags.

## Organizations

The older Teams model was a flat structure — it grouped accounts but didn't express ownership or permissions. Organizations replace it with a proper hierarchy: owners, members, and roles. Custom domains are now scoped to organizations rather than individual accounts, which better reflects how teams actually deploy the product.

## API v3

API v3 ships alongside a reconstituted V1 API, so existing integrations continue to work. Guest access is available via `/share` endpoints for anonymous users who don't need an account. External identifiers have moved to an opaque pattern (ExtId/ObjId) — no more leaking internal structure through IDs. OpenAPI generation infrastructure is in place, with full spec publishing coming in a follow-up release.

## Background Jobs

Previously, email delivery and webhook processing happened inline during request handling, which meant slow external services could block user-facing responses. Full mode now routes these through RabbitMQ 4.3+: email delivery (including delayed expiration warnings), secret reveal notifications, and asynchronous Stripe webhook processing all run in background workers. Health check endpoints include RabbitMQ connection monitoring, and dead-letter queue management is available via the CLI.

## Also in This Release

**i18n** — 27 languages are now supported for email templates. The custom i18n implementation has been replaced with the `ruby-i18n` gem, locale files have been split into a modular structure, and SHA256-based change tracking helps keep translations in sync.

**CLI** — The command-line interface has moved from drydock to dry-cli, with new commands for organization management, domain verification, rabbitmq queue management. Bin wrappers for frontend, scheduler, and backend processes make it easier to run individual components.

**Billing** — Plans are consolidated into a unified structure with legacy plan mapping. An entitlement enforcement system gates features based on plan. HMAC-based subscription federation enables cross-region benefit sharing. New CLI commands handle catalog management, price generation, and webhook replay.

**Logging** — SemanticLogger replaces the custom logging system, bringing structured output with correlation tracking, monotonic timing, and fork-safe logging for Puma cluster mode. HTTP request logging is configured via `logging.yaml`.

**Configuration** — The config structure has been reorganized. Key changes include `fromname` → `from_name`, domains and regions config moving from `site` to `features`, session config moving from `auth.yaml` to site config, and a new `logging.yaml` for HTTP request logging. Full env var configuration is now supported via `.env` files — see `.env.example` for the complete set.

## New Contributors

- [@aprivette](https://github.com/aprivette) ([#1620](https://github.com/onetimesecret/onetimesecret/pull/1620))
- [@jhob101](https://github.com/jhob101) ([#1840](https://github.com/onetimesecret/onetimesecret/pull/1840))
- [@david-garcia-garcia](https://github.com/david-garcia-garcia) ([#1936](https://github.com/onetimesecret/onetimesecret/pull/1936))
- [@kh0mka](https://github.com/kh0mka) ([#2130](https://github.com/onetimesecret/onetimesecret/pull/2130))

## Installation

**Docker**: `docker pull ghcr.io/onetimesecret/onetimesecret:v0.24.0`

**Source**: [GitHub Release](https://github.com/onetimesecret/onetimesecret/releases/tag/v0.24.0)

**Full changelog**: [v0.23.1...v0.24.0](https://github.com/onetimesecret/onetimesecret/compare/v0.23.1...v0.24.0)

---

This release has been a long time coming. It touches nearly every layer of the application, and we're aware that means a non-trivial upgrade path for existing installs. The [upgrade guide](https://docs.onetimesecret.com/en/self-hosting/upgrading-v0-24/) walks through every step. If you run into issues, [open a discussion on GitHub](https://github.com/onetimesecret/onetimesecret/discussions) — we're here to help.

::ImageModal{src="/img/blog/2026/release-0.24.svg" alt="Onetime Secret v0.24.0 release illustration" width="600"}
::
