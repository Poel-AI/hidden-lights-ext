# Speech overlap auto-fix — step reference

## Purpose (why this exists)

CentralReach reports a **speech concurrence** when billable **97153** minutes overlap another service (e.g. **92507**). The fix **splits one timesheet entry into 2 or 3 service lines** on the **same** timesheet so:

1. **Line 1** — Original **97153**, shortened so it **does not** cover the overlap interval (the “trimmed” segment).
2. **Line 2** — A **nonbillable** line whose times are **exactly** the overlap window (explicit nonbillable coverage).
3. **Line 3** — (*Middle* overlaps only) The **remaining 97153** after the overlap, with payor / place / address aligned to line 1, and the **clinical note attached** to this line.

**Start** / **end** overlap geometry only needs **lines 1–2**; **middle** needs **1–2–3**.

---

This document lists **everything the extension does today** when you click **Fix** on a Speech overlap. Use it to tune delays, optional steps, and match strings.

**Code:** `sidepanel-source/sidepanel.js` — delegated handler on `document.body` for `button.overlap-btn` (Fix).  
**Scan (before Fix):** `inject-overlaps.js` + `runFindOverlaps` / `runOverlapScanOnly` — builds groups and `getOverlapFixForGroup()` chooses **start** / **end** / **middle** and Part 1 / overlap / Part 3 times.

---

## A. Discovery (Auto or Manual “Speech Concurances”)

| Step | What happens |
|------|----------------|
| A1 | User clicks **Speech Concurances** (`overlap-fix-find` or `overlaps`). |
| A2 | `inject-overlaps.js` runs in the tab; result in `window.__overlapsResult`. |
| A3 | `renderOverlaps()` lists groups; each **Fix** button gets `data-entry-id`, `data-time-from`, `data-time-to`, `data-overlap*`, `data-overlap-type` (`start` \| `end` \| `middle`), and for middle `data-part3-from` / `data-part3-to`. |

---

## B. Fix flow — always (all overlap types)

| # | Step | Inject / action | Tunable constants (sidepanel.js) |
|---|------|-------------------|-----------------------------------|
| B1 | Set entry id on page | `window.__overlapFixEntryId = entryId` | — |
| B2 | Open provider combo for that entry | `inject-provider-combo-for-entry.js` | Poll up to **5s** / **400ms** for `window.__overlapFixProviderLabels` |
| B3 | (Optional) Capture provider labels | Reads `__overlapFixProviderLabels` | Failure is logged; flow **continues** |
| B4 | Navigate to timesheet | `location.hash = billingmanager/timesheeteditor/?&id=` + entryId | **500ms** wait after |
| B5 | **Part 1 — set times** | `inject-enter-times.js` (after setting `__enterTimesFrom` / `__enterTimesTo` from button attrs) | Poll up to **5s** / **400ms** for `__enterTimesResult` |
| B6 | **Part 1 — verify end time** | `inject-read-time-to.js` → `__readTimeToResult` | **OVERLAP_FIX_AFTER_FIRST_END_TIME_MS** (1200), retry verify after **800ms**, up to **OVERLAP_FIX_PART1_VERIFY_ATTEMPTS** (3), **600ms** between attempts |
| B7 | Step delay | `setTimeout` | **OVERLAP_FIX_STEP_DELAY_MS** (350) |
| B8 | Read first line snapshot | `inject-read-timesheet.js` → `__timesheetResult` | Stores **lastOverlapFixRecord**: provider, placeOfService, serviceAddress, dateOfService |
| B9 | Step delay | — | **OVERLAP_FIX_STEP_DELAY_MS** |
| B10 | Add **2nd** service line | `inject-add-service-line.js` | Expect **countBefore === 1**, **countAfter === 2**; extra **100ms** after inject |
| B11 | Step delay | — | **OVERLAP_FIX_STEP_DELAY_MS** |
| B12 | Set date on new line | `inject-set-date-of-service.js` (`__dateOfServiceValue` from record) | **OVERLAP_FIX_STEP_DELAY_MS** |
| B13 | Wait for new line UI | — | **OVERLAP_FIX_BEFORE_NONBILLABLE_MS** (1500) |
| B14 | Select **nonbillable** service code | `inject-select-service-codes.js` | **OVERLAP_FIX_STEP_DELAY_MS**; errors fail the fix |
| B15 | Step delay | — | **OVERLAP_FIX_STEP_DELAY_MS** |
| B16 | Wait for time inputs | — | **OVERLAP_FIX_BEFORE_OVERLAP_TIMES_MS** (1800) |
| B17 | **Line 2 — overlap window times** | `inject-enter-times.js` with `overlapFrom` / `overlapTo` | **OVERLAP_FIX_STEP_DELAY_MS** |
| B18 | **Branch** | If `overlapType !== 'middle'` → **done (2-line fix)**. If `middle` → continue to section C. | — |

---

## C. Fix flow — **middle** overlap only (third billable line + note)

| # | Step | Inject / action | Tunable constants |
|---|------|-------------------|-------------------|
| C1 | Step delay | — | **OVERLAP_FIX_STEP_DELAY_MS** |
| C2 | Add **3rd** service line | `inject-add-service-line.js` | Expect **2 → 3** lines; **100ms** after inject |
| C3 | Step delay | — | **OVERLAP_FIX_STEP_DELAY_MS** |
| C4 | Set date on third line | `inject-set-date-of-service.js` | **OVERLAP_FIX_STEP_DELAY_MS** |
| C5 | Wait for billable UI | — | **OVERLAP_FIX_BEFORE_97153_MS** (1500) |
| C6 | Click **97153** billable | `inject-click-billable-97153.js` | **OVERLAP_FIX_AFTER_97153_MS** (1000) |
| C7 | Select payor (**Master**) | `inject-select-payor-option.js` with **PAYOR_OPTION_MATCH** (`'master'`) | **OVERLAP_FIX_AFTER_MASTER_MS** (1000) |
| C8 | Place of service | `inject-select-place-of-service.js` — match from **lastOverlapFixRecord.placeOfService**, fallback **PLACE_OF_SERVICE_MATCH** (`'office'`) | **OVERLAP_FIX_STEP_DELAY_MS** |
| C9 | Service address | `inject-select-service-address.js` — from record, fallback **SERVICE_ADDRESS_MATCH** | **OVERLAP_FIX_STEP_DELAY_MS** |
| C10 | Wait for Part 3 time fields | — | **OVERLAP_FIX_BEFORE_OVERLAP_TIMES_MS** (1800) again |
| C11 | **Part 3 times** | `inject-enter-times.js` (`part3From` / `part3To` from button) | **OVERLAP_FIX_STEP_DELAY_MS** |
| C12 | **Connect note** | `inject-click-existing-note.js` | **OVERLAP_FIX_NOTE_STEP_MS** (800) |
| C13 | Click note by **date + provider** | `inject-click-note-by-date-name.js` — args from **lastOverlapFixRecord** (dateOfService, provider) | **OVERLAP_FIX_NOTE_STEP_MS** |
| C14 | Validate note click | `window.__clickNoteByDateNameResult` | Failure → error (no fallback) |
| C15 | Close note | `inject-click-close-note.js` | **OVERLAP_FIX_NOTE_STEP_MS** |
| C16 | Success UI | Button success state + summary HTML | — |

---

## D. Error handling

| Item | Behavior |
|------|----------|
| Uncaught exception | `catch`: log, button **error** state, `setOverlapFixFailReason` |
| Cancel on error | `clickTimesheetCancel` is **commented out** (disabled) |

---

## E. Related top-level constants (easy knobs)

| Constant | Default | Role |
|----------|---------|------|
| `OVERLAP_FIX_STEP_DELAY_MS` | 350 | Generic pause between many steps |
| `OVERLAP_FIX_BEFORE_NONBILLABLE_MS` | 1500 | After add line, before nonbillable code picker |
| `OVERLAP_FIX_BEFORE_OVERLAP_TIMES_MS` | 1800 | Before entering overlap / Part 3 times |
| `OVERLAP_FIX_BEFORE_97153_MS` | 1500 | Before clicking 97153 on line 3 |
| `OVERLAP_FIX_AFTER_97153_MS` | 1000 | After 97153 click |
| `OVERLAP_FIX_AFTER_FIRST_END_TIME_MS` | 1200 | After Part 1 enter-times, before verify |
| `OVERLAP_FIX_PART1_VERIFY_ATTEMPTS` | 3 | Part 1 end-time verify retries |
| `OVERLAP_FIX_AFTER_MASTER_MS` | 1000 | After payor select |
| `OVERLAP_FIX_NOTE_STEP_MS` | 800 | Between note-related injects |
| `PAYOR_OPTION_MATCH` | `'master'` | Payor dropdown match |
| `PLACE_OF_SERVICE_MATCH` | `'office'` | Fallback if record empty |
| `SERVICE_ADDRESS_MATCH` | `'30 carn'` | Fallback if record empty |
| `NOTE_MATCH_DATE` / `NOTE_MATCH_NAME` | (in inject) | **Not** used in overlap fix path — note match uses **record** date + provider |

---

## F. Not in auto speech fix

- **97155 Concurances** scan uses `inject-overlaps-97155.js`; Fix buttons are **not implemented** (title says so in `renderOverlaps97155`).
- Manual panel duplicate steps (individual buttons) are separate from this **Fix** pipeline.

---

## G. Ideas for “more variable” later

- Single **profile** or **JSON config** for all `OVERLAP_FIX_*` delays and match strings.
- Per-step **skip toggles** (e.g. skip note connection, skip address if empty).
- **97155** fix pipeline parallel to this one.
- Re-enable **Cancel on error** behind a setting.
