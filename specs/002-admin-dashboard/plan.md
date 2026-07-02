# Implementation Plan: Admin Dashboard (Multi-Site Manager)

**Branch**: `002-admin-dashboard` | **Date**: 2026-06-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-admin-dashboard/spec.md`

## Summary

A single-page developer dashboard that centrally monitors and manages multiple deployed doctor-website-template instances. The dashboard reads site configs via HTTP, pushes config updates via SSH, and stores site registry locally. Built as a lightweight Node.js application (Express backend + vanilla HTML/CSS/JS frontend) running on the developer's local machine.

## Technical Context

**Language/Version**: Node.js 20 LTS (backend) + HTML5/CSS3/Vanilla JS ES2020+ (frontend)

**Primary Dependencies**: Express.js (HTTP server), node-ssh (SSH connections), cors (middleware)

**Storage**: Local JSON files (`dashboard-registry.json`, `deployment-log.json`)

**Testing**: Node.js built-in test runner (`node --test`) + Playwright for E2E

**Target Platform**: Developer's local machine (localhost), any OS (Windows/macOS/Linux)

**Project Type**: Web application (local developer tool — not publicly hosted)

**Performance Goals**: Dashboard loads in < 3 seconds with 50+ sites; status checks complete within 30 seconds

**Constraints**: Single-user (no auth needed for v1); SSH keys must be pre-configured; depends on spec 001 FR-028 (predictable config URL + CORS)

**Scale/Scope**: 50+ managed sites, single developer user

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Applies? | Status | Notes |
|-----------|----------|--------|-------|
| I. Config-First | Partial | PASS | Dashboard registry is config-driven (`dashboard-registry.json`). The managed sites remain config-first. Dashboard itself doesn't serve patients. |
| II. SEO Excellence | No | N/A | Developer tool, not patient-facing — SEO irrelevant. |
| III. Zero-Framework Simplicity | Modified | JUSTIFIED | Constitution specifies this for the doctor template (patient-facing). Admin dashboard is a separate developer tool (stated in spec assumptions). Minimal deps (Express + node-ssh) chosen — no UI frameworks. |
| IV. Non-Technical User Friendly | No | N/A | User is the developer, not a doctor. Technical interface acceptable. |
| V. Mobile-First & Performance | Partial | PASS | Desktop-primary (developer tool), but responsive layout. Performance budget: < 3s load with 50+ sites. |
| VI. Production Security | Yes | PASS | SSH credentials stored securely (OS keychain/encrypted); no secrets in client-side code; input validation on all forms. |

**Justified Violation**: Principle III — The admin dashboard uses Node.js (Express backend) because it requires SSH connections and file system access which cannot run in a browser. This is the minimum viable server-side runtime. The frontend remains pure HTML/CSS/Vanilla JS (no UI frameworks).

## Project Structure

### Documentation (this feature)

```text
specs/002-admin-dashboard/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
admin/
├── server/
│   ├── index.js           # Express app entry point
│   ├── routes/
│   │   ├── sites.js       # CRUD for site registry
│   │   ├── config.js      # Fetch/push config operations
│   │   └── health.js      # Site health check endpoints
│   ├── services/
│   │   ├── ssh.js         # SSH connection & file operations
│   │   ├── registry.js    # Site registry CRUD (JSON file)
│   │   ├── health.js      # Status check logic
│   │   └── credentials.js # Secure credential storage
│   └── data/
│       ├── dashboard-registry.json  # Site registry store
│       └── deployment-log.json      # Audit log
├── public/
│   ├── index.html         # Dashboard SPA (single page)
│   ├── css/
│   │   └── dashboard.css  # Dashboard styles
│   └── js/
│       ├── app.js         # Main dashboard logic
│       ├── api.js         # Fetch wrapper for backend API
│       ├── editor.js      # Config editor component
│       └── ui.js          # UI helpers (modals, toasts, cards)
├── package.json           # Node.js project manifest
└── README.md              # Dashboard setup/usage guide
```

**Structure Decision**: Monorepo approach — dashboard lives under `admin/` in the same repo as the template. This keeps the developer tool co-located with the template it manages. The `admin/` directory is self-contained with its own `package.json` and can be gitignored from template deployments.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Node.js backend (Principle III) | SSH connections require server-side runtime; browsers cannot open SSH tunnels | A pure browser extension was considered but rejected — requires native messaging host, more complex than Express |
