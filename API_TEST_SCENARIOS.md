# API route test scenarios

All JSON responses follow:

```json
{ "success": boolean, "data": any, "error": string | omitted }
```

On errors, `data` is usually `null`. Successful reads return `data` as an object or array. Route handlers also attach **CORS** headers (`OPTIONS` supported on every route).

Environment notes:

- **`GAS_WEB_APP_URL`** (or `NEXT_PUBLIC_GAS_WEB_APP_URL` via `next.config`) must point at your Apps Script web app for “valid” upstream scenarios.
- To simulate **Apps Script failure** or **timeout**, you typically change env, use a mock server, or temporarily adjust `lib/server/config/timeouts.js` (e.g. `1` ms) in a local branch—**do not commit** such values.

---

## 1. `GET /api/schedule`

| Scenario | How to trigger | HTTP | Expected `success` | Expected `data` / `error` |
|----------|----------------|------|--------------------|---------------------------|
| **Valid** | GAS URL set; script returns `action=schedule` payload with `day1`–`day3` | 200 | `true` | `data`: `{ "day1": [...], "day2": [...], "day3": [...] }` (arrays, possibly empty) |
| **Invalid input** | N/A (no request body; no query params validated) | — | — | — |
| **Apps Script failure** | Missing/invalid GAS URL, GAS returns `success: false`, non-2xx, or JSON error | 502 or 503 | `false` | `data`: `null`, `error`: message (e.g. not configured, or GAS error text) |
| **Timeout** | GAS (or network) does not complete before default **12s** schedule timeout | 502 | `false` | `data`: `null`, `error`: includes *“Request timed out waiting for Google Apps Script.”* (or similar abort message) |

**Notes:** “Not configured” maps to **503** and an `error` mentioning configuration. Other upstream issues use **502**.

---

## 2. `GET /api/events`

| Scenario | How to trigger | HTTP | Expected `success` | Expected `data` / `error` |
|----------|----------------|------|--------------------|---------------------------|
| **Valid** | GAS returns `action=events` with `data` as array | 200 | `true` | `data`: array of row objects (`id`, `date`, `title`, …) |
| **Invalid input** | N/A | — | — | — |
| **Apps Script failure** | Same as schedule | 502 or 503 | `false` | `error` describes GAS/config; `data`: `null` |
| **Timeout** | Exceeds default **8s** events timeout | 502 | `false` | `error`: timeout/abort style message |

---

## 3. `GET /api/speakers`

| Scenario | How to trigger | HTTP | Expected `success` | Expected `data` / `error` |
|----------|----------------|------|--------------------|---------------------------|
| **Valid** | GAS returns `action=speakers` with `data` as array | 200 | `true` | `data`: array of speaker row objects |
| **Invalid input** | N/A | — | — | — |
| **Apps Script failure** | Same as schedule | 502 or 503 | `false` | `error` as above; `data`: `null` |
| **Timeout** | Exceeds default **8s** speakers timeout | 502 | `false` | Timeout/abort `error` |

---

## 4. `GET /api/registration/check-email?email=...`

| Scenario | How to trigger | HTTP | Expected `success` | Expected `data` / `error` |
|----------|----------------|------|--------------------|---------------------------|
| **Valid** | `email` present, valid format; GAS `checkemail` returns `success: true` | 200 | `true` | `data`: `{ "exists": true \| false }` |
| **Invalid input** | Omit `email`, empty string, too long (>254), or not matching server validation (e.g. no `@`) | 400 | `false` | `data`: `null`, `error`: e.g. *“email query parameter is required.”*, *“email format is invalid.”*, *“email is too long.”* |
| **Apps Script failure** | GAS error / not configured | 502 or 503 | `false` | `data`: `null`, `error` from GAS or config message |
| **Timeout** | Exceeds default **10s** check-email timeout | 502 | `false` | Timeout/abort `error` |

---

## 5. `POST /api/registration`

**Headers:** `Content-Type: application/json`

**Body fields (after validation):** `fullName`, `email`, `mobileNumber`, `organization`, `designation`, `topicInterest` (required); `message` optional. `topicInterest` must be one of the allowed enum values (same as the registration form).

| Scenario | How to trigger | HTTP | Expected `success` | Expected `data` / `error` |
|----------|----------------|------|--------------------|---------------------------|
| **Valid** | All fields valid; email not already registered; GAS POST succeeds | 200 | `true` | `data`: usually Apps Script payload (often `{ "success": true }` or similar) or `null` depending on script |
| **Invalid input** | Non-JSON body | 400 | `false` | `error`: *“Request body must be valid JSON.”* |
| **Invalid input** | Missing/empty required field, bad email, field too long, or **topic interest** not in allowed list | 400 | `false` | `error`: validator message (required fields, length, format, or topic enum) |
| **Conflict** | Duplicate email (GAS reports already registered) | 409 | `false` | `error`: *“This email is already registered.”* |
| **Apps Script failure** | GAS duplicate-check or POST fails (not duplicate): `success: false`, HTTP error, etc. | 502 or 503 | `false` | `error`: includes GAS message or *“Could not verify email uniqueness. …”* |
| **Timeout** | Duplicate-check or POST exceeds **10s** / **20s** respectively | 502 | `false` | Timeout/abort `error` |

---

## Quick manual checks (development)

1. **Valid:** `curl -sS http://localhost:3000/api/schedule` → `200`, `"success":true`, `data.day1`… present.
2. **Invalid (check-email):** `curl -sS "http://localhost:3000/api/registration/check-email"` (no query) → `400`.
3. **Invalid (registration):** POST `{}` or `{ "fullName": "" }` → `400` with validation `error`.
4. **GAS failure:** unset `GAS_WEB_APP_URL` in `.env.local`, restart dev → schedule/events/speakers/check-email/registration return **`503`** or **`502`** with “not configured” / upstream message.
5. **Timeout:** temporarily set very low values in `lib/server/config/timeouts.js`, restart, hit a route → **`502`** with timeout wording.

---

## OPTIONS (preflight)

Every route supports **`OPTIONS`** with **204** and CORS headers (methods, headers, max-age; `Allow-Origin` either `*` or from **`CORS_ALLOWED_ORIGINS`**).

Expected: no JSON body; browser preflight succeeds for cross-origin clients when origin is allowed.
