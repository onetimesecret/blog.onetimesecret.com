---
layout: post
title: "Onetime Secret v0.23: Config Migration and API Improvements"
date: 2026-01-18
authors:
  - name: Delano
    to: https://blog.onetimesecret.com/about
    avatar:
      src: /img/portrait-profile-pic-delano-2025-m.png
image:
  src: /img/blog/2026/release-0.23.svg
badge:
  label: Release
readingTime: 3
---

Onetime Secret v0.23 spans four releases (v0.23.0 through v0.23.3), covering configuration migration infrastructure, anonymous API access, a new community translation, and several bug fixes.

[Full release notes on GitHub](https://github.com/onetimesecret/onetimesecret/releases/tag/v0.23.0)

## Breaking Change: Config File Migration

> [!WARNING]
> **v0.23.0 requires a config file migration before startup.** Configuration files have been converted from symbol keys to string keys. The application will not start until the migration is applied.

On first boot after upgrading to v0.23.0, you'll see a prompt like this:

```
ERROR: Migrations needed before startup
Pending migrations:
  bundle exec ruby migrations/20250727-1523_01_convert_symbol_keys.rb --dry-run
Options:
  1. Auto-migrate: Restart with CONFIG_MIGRATE=auto
  2. Manual: Run each migration with --run flag
  3. Skip: Set CONFIG_MIGRATE=skip (not recommended)
```

We recommend running the dry-run first to review the changes, then either setting `CONFIG_MIGRATE=auto` for automatic migration or running the migration script manually with the `--run` flag.

This release also introduces a `migrations/` directory and entrypoint-level migration checks, establishing infrastructure for future schema changes. See [#2075](https://github.com/onetimesecret/onetimesecret/pull/2075) for details on the settings migration infrastructure.

## Guest Routes for Anonymous API Access

v0.23.2 adds dedicated guest routes for anonymous API access ([#2191](https://github.com/onetimesecret/onetimesecret/pull/2191)). This provides a cleaner separation between authenticated and unauthenticated API operations.

## Internationalization

Community contributor [@kh0mka](https://github.com/kh0mka) added a Russian language translation ([#2130](https://github.com/onetimesecret/onetimesecret/pull/2130)). Thank you for the contribution.

This release also introduces a Git JSON merge driver for locale files ([#2080](https://github.com/onetimesecret/onetimesecret/pull/2080)), which helps prevent merge conflicts when multiple branches modify translation files concurrently.

## Bug Fixes

- **Rate limit fix** (v0.23.1): Corrected an event limit lookup bug ([#2112](https://github.com/onetimesecret/onetimesecret/pull/2112))
- **TTL fix** (v0.23.3): Resolved an issue with TTL values above 7 days ([#2393](https://github.com/onetimesecret/onetimesecret/pull/2393) via [#2390](https://github.com/onetimesecret/onetimesecret/pull/2390))

## Installation

**Docker**: `docker pull onetimesecret/onetimesecret:v0.23.3`
**Source**: [GitHub Release](https://github.com/onetimesecret/onetimesecret/releases/tag/v0.23.3)

v0.23.2 also includes 49 dependency updates. See the individual release notes for the full changelog.
