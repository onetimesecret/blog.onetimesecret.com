---
layout: post
title: "Domain strategy cont'd: 1-800-Dot-Dev"
date: 2026-01-04
authors:
  - name: Delano
    to: https://blog.onetimesecret.com/about
    avatar:
      src: /img/portrait-profile-pic-delano-2025-m.png
image:
  src: /img/blog/2026/ots-dot-dev-hotline.svg
badge:
  label: Engineering
readingTime: 5
draft: true
---


## Our Domain Structure

* **`onetimesecret.com`**: Product/company homepage and portal into the regional ~dimension~ sites.
* **Regional domains** (`eu.onetimesecret.com`, `ca.onetimesecret.com`, etc): Main application instances with share-nothing architecture, providing data sovereignty, and robust, fault-tolerant operations.
* **Supporting domains**:
  * **`docs.onetimesecret.com`**: Comprehensive documentation
  * **`blog.onetimesecret.com`**: Product updates and engineering insights
  * **`status.onetimesecret.com`**: Service status and incident reporting
* **`*.onetimesecret.dev`**: Exclusively for non-production environments, clearly separated from production

## Our `.dev`: A True Non-Production Mirror

Our `.dev` TLD serves exclusively for non-production environments, providing clear separation from production systems:

* **Clear Prod/Non-Prod Distinction:** `.onetimesecret.dev` creates an unmistakable boundary between our production environment (`*.onetimesecret.com`) and all non-production activities.

* **Apex Domain Mirroring:** We mirror our production domain structure (e.g., `us.onetimesecret.dev` corresponding to `us.onetimesecret.com`). This allows development environments to replicate production DNS configurations with high fidelity, reducing "works on my machine" issues.

* **Technical Advantages:** This approach provides strict origin separation (HSTS preload), clean cookie jars, and clear visual distinction for developers and testers.

This avoids subtle problems that arise when non-production environments are subdomains of the production TLD, ensuring cleaner separation of concerns.
