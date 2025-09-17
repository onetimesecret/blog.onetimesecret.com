---
layout: post
title: "OneTimeSecret v0.22.4: Enhanced Security & Configuration"
date: 2025-09-16
authors:
  - name: Delano
    to: https://blog.onetimesecret.com/about
    avatar:
      src: /img/portrait-profile-pic-delano-2025-m.png
image:
  src: /img/blog/2025/release-0.22.4.svg
badge:
  label: Release
readingTime: 2
---

# OneTimeSecret v0.22.4 Release Notes

Version v0.22.4 introduces new configuration options for customizing security policies and access control.

## Changes

**Configurable Passphrase Validation**: Environment variables are now available to configure passphrase requirements, including minimum length and complexity. This is useful for deployments with specific security policies.

**Disable Homepage**: A new `AUTH_REQUIRED` mode can be enabled to restrict homepage access to authenticated users. Site navigation remains available. This can be used with `UI_ENABLED=false` for API-only deployments.

**Password Generation**: The length and character sets (uppercase, lowercase, numbers, symbols) of generated passwords can now be configured. There is also an option to exclude ambiguous characters.

> [!INFO]
> **Admin Interface**: The Colonel settings view is now read-only.

## Configuration Examples

```bash
# Disable Homepage
AUTH_REQUIRED=false
UI_ENABLED=true

# Password Policies
PASSPHRASE_MIN_LENGTH=8
PASSPHRASE_ENFORCE_COMPLEXITY=false
PASSWORD_GEN_LENGTH=12
PASSWORD_GEN_SYMBOLS=false
```

## Installation

**Docker**: `docker pull onetimesecret/onetimesecret:v0.22.6`
**Source**: [GitHub Release](https://github.com/onetimesecret/onetimesecret/releases/tag/v0.22.4)

The release also includes updates to `INSTALL.md` and the `README.md` for Docker deployment.

---

_This post was written with assistance from:_
- _Claude Code: collecting release facts, document structure, first draft._
- _Gemini CLI: content editing ("Update the text to remove false enthusiasm, marketing speak, and overall keep it an engineer's doc")_