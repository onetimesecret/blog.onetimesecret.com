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
readingTime: 8
---

Onetime Secret v0.24.0 is the largest release in the project's history: over 5,000 commits spanning architecture, infrastructure, and operations. If this weren't a sub-1.0 project, it would have been a major version increment.

This release introduces PostgreSQL as the primary datastore, optional RabbitMQ for background processing, and a configurable authentication system with three distinct modes. Existing installations will require manual intervention to upgrade.

<!-- TODO: Add GitHub release link when published -->
<!-- [Full release notes on GitHub](https://github.com/onetimesecret/onetimesecret/releases/tag/v0.24.0) -->

## Upgrade Notice

::warning
**v0.24.0 requires manual intervention to upgrade from v0.23.x.** This is not a drop-in replacement. You will need to update configuration files, add new config entries, and run a multi-step data migration. Read this entire section before starting.
::

### Upgrade Steps

1. **Back up everything.** Your Redis data, your configuration files, your environment variables. All of it.
2. **Update configuration files.** New settings and config files have been added that must be present before the application will start. <!-- TODO: Link to migration guide or list specific new config files -->
3. **Choose an authentication mode** (see [Authentication Modes](#authentication-modes) below). This decision affects your system requirements.
4. **Run the data migration.** This is a multi-step process that must be completed before the application will serve requests. <!-- TODO: Add specific migration commands -->
5. **Verify system requirements.** If you choose the _full_ authentication mode, you will need PostgreSQL 17+ and RabbitMQ 4.3+ installed and configured.

<!-- TODO: Link to a dedicated upgrade guide if one is published separately -->

## What's New

### Authentication Modes

v0.24.0 introduces three authentication modes, replacing the previous single-mode approach:

**Simple mode** — The default. Uses the existing Redis-backed authentication. No additional system dependencies. Suitable for most self-hosted deployments where a single operator manages access.

**Full mode** — Adds account management, session handling, and background job processing backed by PostgreSQL and RabbitMQ. This is the mode used by [onetimesecret.com](https://onetimesecret.com) and is intended for deployments that need multi-user account features, audit trails, or integrations that depend on durable state.

**Disabled** — Turns off authentication entirely. The application operates in anonymous-only mode. Useful for internal tools behind a VPN or reverse proxy that handles auth at the network layer.

<!-- TODO: Add configuration examples for each mode -->

### PostgreSQL 17+

Full authentication mode requires PostgreSQL 17 or later as the primary relational datastore. Redis continues to handle ephemeral secret storage and caching, but account data, sessions, and operational state now live in PostgreSQL.

<!-- TODO: Expand on what specifically moved to PostgreSQL and why -->

### RabbitMQ 4.3

Full authentication mode also introduces RabbitMQ 4.3 for asynchronous job processing. This handles tasks like email delivery, scheduled cleanup, and event processing without blocking request handling.

<!-- TODO: Expand on specific job types and configuration -->

### Data Migration

The migration from v0.23.x to v0.24.0 is a multi-step process that transforms the existing Redis-only data layout to support the new architecture. The migration tooling will guide you through each step.

<!-- TODO: Document the specific migration steps, expected duration for various data sizes, and rollback procedures -->

## System Requirements

### Simple mode
- Ruby <!-- TODO: specify version -->
- Redis 7+

### Full mode
- Ruby <!-- TODO: specify version -->
- Redis 7+
- **PostgreSQL 17+** (new)
- **RabbitMQ 4.3+** (new)

## Installation

<!-- TODO: Update with actual Docker tag and GitHub release link when published -->

**Docker**: `docker pull onetimesecret/onetimesecret:v0.24.0`

**Source**: [GitHub Release](https://github.com/onetimesecret/onetimesecret/releases/tag/v0.24.0)

## Looking Ahead

<!-- TODO: Add notes on what's planned for v0.25+ if applicable -->

This release represents a foundational shift in how Onetime Secret is built and operated. The architecture changes in v0.24.0 set the stage for features that weren't previously possible with a Redis-only backend.

---

_This is a draft. Sections marked with TODO will be completed before publication._

::ImageModal{src="/img/blog/2026/release-0.24.svg" alt="Onetime Secret v0.24.0 release illustration" width="600"}
::
