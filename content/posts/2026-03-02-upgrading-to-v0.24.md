---
layout: post
title: "Upgrading to Onetime Secret v0.24.0"
date: 2026-03-02
authors:
  - name: Delano
    to: https://blog.onetimesecret.com/about
    avatar:
      src: /img/portrait-profile-pic-delano-2025-m.png
badge:
  label: Engineering
readingTime: 6
---

This guide covers upgrading from v0.23.x to v0.24.0. This is not a drop-in replacement — you will need to update configuration files, choose an authentication mode, and run several data migrations in order to continue running with your existing data.

See the [release announcement](/posts/2026-02-18-release-notes-v0.24.0) for an overview of what's new.

## Before You Start

1. **Back up everything.** Redis data, configuration files, environment variables.
2. **Review authentication modes.** This determines whether there are any new system dependencies (see below).
3. **Consider a fresh install.** It's honestly a bit job to upgrade an existing deployment to v0.24.0 due to the significant changes in the authentication system and data model. If you don't have critical data or accounts that need to be preserved, it will be a lot easier to do a fresh install of v0.24.0 and start with a clean slate.

## System Requirements

### Simple Mode

- Ruby 3.4+
- Redis 7+ (or Valkey)

### Full Mode

Everything from Simple Mode, plus:

- **PostgreSQL 17+**
- **RabbitMQ 4+**

## Upgrading

### Step 1: Choose an Authentication Mode

v0.24.0 introduces two new operational modes.

**Simple mode** — The existing classic redis-backed authentication from previous versions. No additional requirements and accounts continue to work as they always have. This is for backwards-compatibility and to maintain an easy install process that just requires redis. The functionality is limited and won't be extended with new features going forward. For example, MFA, WebAuthn, and SSO are not available in simple mode. But it functions well as a basic gating layer for creating secrets.

**Full mode** — Adds Rodauth-based authentication which includes MFA, SSO, WebAuthn, organizations, and background job processing. Account data is stored in PostgreSQL. Background jobs (email delivery, notifications, webhook processing) are handled by RabbitMQ.

**Disabled** — No authentication. The application operates in anonymous-only mode. Useful behind a VPN or reverse proxy that handles auth externally.

### Step 2: Update Configuration Files

Several configuration keys have been renamed, moved, or added. The application will not start with outdated configuration.

| Change                     | Before         | After                                                             |
| -------------------------- | -------------- | ----------------------------------------------------------------- |
| Keys type                  | symbol         | string                                                            |
| Email sender name          | `fromname`     | `from_name`                                                       |
| Auth environment variables | various names  | `AUTH_SIGNIN_ENABLED`, `AUTH_SIGNUP_ENABLED`, ... (and many more) |
| Session configuration      | `auth.yaml`    | site config                                                       |
| Domains configuration      | `site` section | Moved to `features`                                               |
| Regions configuration      | `site` section | Moved to `features`                                               |
| Experimental configuration | Top-level      | Removed                                                           |
| Auth configuration         |                | New auth.yaml file                                                |
| Billing configuration      |                | New billing.yaml file                                             |
| Logging configuration      |                | New logging.yaml file                                             |

#### Environment Variables

Many new environment variables have been added to support the new authentication modes and features. Review the .env.example files for the most common settings. For the most environment vars are consumed in the YAML config files are load-time so the values must be set before starting the application.

### Step 3: Install PostgreSQL and RabbitMQ (Full Mode Only)

For Postgresql, there is an initial schema setup that needs to be run before starting the application. See apps/web/auth/migrations/README.md.

For RabbitMQ, there is one required step for initialization of the queues and exchanges. This is handled by the `bin/ots queues init` command.

### Step 4: Run the Data Migration

The Familia data model library has been rewritten from v1 to v2. This requires a migration pipeline to transform existing Redis data to the new schema. The scripts included in the `scripts/upgrade/v0.24.0` directory handle this process and are the same files we used to migrate the onetimesecret.com production environments. They can be run in a dry-run mode to preview the changes before applying them.

All scripts support `--help` for usage instructions and options.

```bash
./scripts/upgrade/v0.24.0/info.sh

# Optional if needing to re-run:
# ./scripts/upgrade/v0.24.0/reset.sh

# Run migration (dry run is default)
./scripts/upgrade/v0.24.0/upgrade.sh [--execute]
```

The `--execute` flag applies the changes to the database. Without it, the script will only log the intended changes without modifying any data.

Each phase of the migration is designed to be idempotent and can be re-run if needed. There is a yes/no gate before each phase begins. The upgrade.sh orchestration script assumes that both the "old" (`SOURCE_REDIS_URL`) and new redis connections (`TARGET_VALKEY_URL`) are configured and available. However the dump, tranform, and validate scripts can be run independently if you want to break up the process or re-run specific phases.

For full mode deployments, existing bcrypt passwords stored in Redis are transparently migrated to Rodauth (Argon2id) on each user's first login after the upgrade. No manual password migration step is required.

For a system with a few thousand accounts and/or secrets, the migration should complete in about 5 minutes. For larger datasets, it may take several hours. Monitor the logs for progress and any potential issues.

### Step 5: Verify

After migration, verify the application is running correctly:

```bash
bundle exec puma -C etc/examples/puma.example.rb

# Basic check if the server is responding
curl -v http://localhost:3000/health

# Check advanced health endpoint for dependencies (full mode)
curl -v http://localhost:3000/health/advanced
```

Other commands:

```bash
bundle exec bin/ots boot-test
bundle exec bin/ots queues status
bundle exec bin/ots doctor
```

## Troubleshooting

If you encounter issues during the upgrade process, please check the logs for detailed error messages. Common issues include misconfigured environment variables, missing dependencies (PostgreSQL, RabbitMQ), or data migration errors. If you need assistance, please reach open an issue on GitHub or submit feedback at https://ca.onetimesecret.com/feedback and I'll do my best to help you out.
