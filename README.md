# Extension project (Hidden Lights)

Forked from Hidden Talents. Top modes: **BCBA reports**, **RBT reports**, and **Concurrences** (AI Search removed). Report modes are stubs for now; Concurrences matches Hidden Talents.

This folder is the **content you commit to your private GitHub repo**. The POEL CLIENTS shell loads it via your Next.js backend (token → config + scripts).

## Structure

- **config.json** — Standardized config schema. Includes `sidepanelApp: "app"` so the shell loads the full panel UI from `scripts/app.js`. Defines app name, version, script list, and (when no sidepanel app) UI panels/buttons.
- **scripts/** — One `.js` file per script. `app.js` is the full Hidden Lights side panel (overlap scan, result list, Fix flow, manual buttons). Other files (e.g. `inject-draw.js`) are page scripts. Backend serves at `GET /api/extension/scripts/:name` (e.g. `app` → `scripts/app.js`).
- **sidepanel-source/** — Canonical `sidepanel.html` + `sidepanel.js` for the side panel UI (edit here; no dependency on `canvas-s-drawer/`).
- **scripts/build-app.js** — Optional. From `remote-hidden-lights/scripts`, run `node build-app.js` to rebuild `app.js` from `sidepanel-source/`.

## Flow

1. User enters token in POEL CLIENTS shell.
2. Backend verifies token and fetches `config.json` from this repo (via GitHub API).
3. If config has `sidepanelApp` (e.g. `"app"`), the shell fetches `scripts/app.js`, injects it into the panel, and the app builds the full Hidden Lights UI (three top modes; Concurrences has scan/fix). Otherwise the shell renders the simple button list from `config.ui`.
4. The app uses `window.SHELL.runScript(name)` to run page scripts; the shell fetches each script from the API and injects it into the active tab.

## Note on overlap “Fix” flow

The Concurrences mode has a multi-step “Fix” flow (Part 1 times, add line, nonbillable, overlap times, 97153, etc.) orchestrated in the side panel.
