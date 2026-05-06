# Google Apps Script Setup (Google Sheet Backend)

Use this to store registration submissions and serve schedule, events, and speakers data from Google Sheets.

## 1) Create the target Google Sheet

- Create a Google Sheet.
- Rename first sheet tab to `Registrations` (or update the script name accordingly).
- Add headers in row 1:
  - `Full Name`
  - `Email`
  - `Mobile number`
  - `Organization`
  - `Designation`
  - `Attendance`
  - `Topic_interest`
  - `Topic_interest_array`
  - `message`
  - `Timestamp`

- Create **4** sheet tabs for schedule data (recommended names — script matches loosely):
  - `Day 1` → JSON `day1` → Opening Ceremony on `/schedule`
  - `Conference Day 1` → JSON `day2` → Conference Day 1 tab
  - `Conference Day 2` → JSON `day4` → Conference Day 2 tab
  - `Day 3` → JSON `day3` → WTISD tab on `/schedule`
- Add these headers in row 1 for **each** schedule day tab (`Day 1`, `Conference Day 1`, `Conference Day 2`, `Day 3`):
  - `id`
  - `time_slot`
  - `description`
  - `speaker`

- Create one more tab for events:
  - `Events`
- Add these headers in row 1 for `Events`:
  - `id`
  - `date`
  - `title`
  - `description`
  - `link`

- Create one more tab for speakers:
  - `Speakers`
- Add these headers in row 1 for `Speakers`:
  - `id`
  - `name`
  - `designation`
  - `company`
  - `biography`
  - `photo`

## 2) Create Apps Script

- In the Google Sheet: `Extensions` -> `Apps Script`
- Replace code with:

```javascript
function doGet(e) {
  try {
    const action = (e.parameter.action || "").toLowerCase();

    if (action === "schedule") {
      return jsonResponse({
        success: true,
        data: {
          day1: readScheduleSheet_("Day 1"),
          day2: readScheduleSheet_("Conference Day 1"),
          day3: readScheduleSheet_("Day 3"),
          day4: readScheduleSheet_("Conference Day 2")
        }
      });
    }

    if (action === "events") {
      return jsonResponse({
        success: true,
        data: readScheduleSheet_("Events")
      });
    }

    if (action === "speakers") {
      return jsonResponse({
        success: true,
        data: readScheduleSheet_("Speakers")
      });
    }

    if (action === "checkemail") {
      const email = String(e.parameter.email || "").trim().toLowerCase();
      if (!email) {
        return jsonResponse({ success: false, error: "email query parameter is required." });
      }

      return jsonResponse({
        success: true,
        exists: emailExists_("Registrations", "Email", email)
      });
    }

    return jsonResponse({ success: true, message: "Apps Script is running." });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Registrations");
    if (!sheet) {
      return jsonResponse({ success: false, error: "Sheet 'Registrations' not found." });
    }

    const data = JSON.parse(e.postData.contents || "{}");
    const fullName = data["Full Name"] || "";
    const email = data.Email || "";
    const mobileNumber = data["Mobile number"] || "";
    const organization = data.Organization || "";
    const designation = data.Designation || "";
    const attendance = data.Attendance || "";
    const topicInterest = data.Topic_interest || "";
    const topicInterestArray = data.Topic_interest_array || "[]";
    const message = data.message || "";

    if (!fullName || !email || !mobileNumber || !organization || !designation || !attendance) {
      return jsonResponse({
        success: false,
        error: "Full Name, Email, Mobile number, Organization, Designation, and Attendance are required."
      });
    }

    sheet.appendRow([
      fullName,
      email,
      mobileNumber,
      organization,
      designation,
      attendance,
      topicInterest,
      topicInterestArray,
      message,
      new Date()
    ]);

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function normalizeSheetTitle_(s) {
  return String(s || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function getSheetByNameLoose_(name) {
  if (!name) return null;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var exact = ss.getSheetByName(name);
  if (exact) return exact;
  var want = normalizeSheetTitle_(name);
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var sh = sheets[i];
    if (normalizeSheetTitle_(sh.getName()) === want) return sh;
  }
  return null;
}

function readScheduleSheetFromSheet_(sheet) {
  if (!sheet) return [];
  var dataRange = sheet.getDataRange();
  var rawRows = dataRange.getValues();
  var displayRows = dataRange.getDisplayValues();
  if (displayRows.length < 2) return [];
  var headers = rawRows[0];
  var normalized = headers.map(function (h) {
    return String(h).trim();
  });
  return displayRows
    .slice(1)
    .filter(function (row) {
      return row.some(function (cell) {
        return String(cell).trim() !== "";
      });
    })
    .map(function (row) {
      var obj = {};
      normalized.forEach(function (key, idx) {
        obj[key] = String(row[idx] ?? "").trim();
      });
      return obj;
    });
}

function readScheduleSheet_(sheetName) {
  return readScheduleSheetFromSheet_(getSheetByNameLoose_(sheetName));
}

function readScheduleSheetFirstFound_(candidateNames) {
  for (var i = 0; i < candidateNames.length; i++) {
    var sheet = getSheetByNameLoose_(candidateNames[i]);
    if (sheet) return readScheduleSheetFromSheet_(sheet);
  }
  return [];
}

function emailExists_(sheetName, emailHeader, normalizedEmail) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return false;

  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return false;

  const headers = rows[0].map((h) => String(h).trim().toLowerCase());
  const emailIdx = headers.indexOf(String(emailHeader).trim().toLowerCase());
  if (emailIdx < 0) return false;

  for (var i = 1; i < rows.length; i++) {
    const value = String(rows[i][emailIdx] || "").trim().toLowerCase();
    if (value && value === normalizedEmail) {
      return true;
    }
  }
  return false;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3) Deploy as Web App

- Click `Deploy` -> `New deployment`
- Type: `Web app`
- Execute as: `Me`
- Who has access: `Anyone`
- Deploy and copy the Web app URL (ends with `/exec`)

## 4) Connect Next.js app

- In project root, create `.env.local`
- Add:

```env
GAS_WEB_APP_URL="PASTE_YOUR_WEB_APP_EXEC_URL_HERE"
```

- Restart dev server after updating env:
  - `npm run dev`

## 5) Test

- Open `/register`
- Submit form
- Confirm new row is appended in Google Sheet

## 6) Test schedule API

- Open this in browser after deployment:
  - `YOUR_EXEC_URL?action=schedule`
- Confirm JSON contains arrays:
  - `data.day1` — sheet **Day 1** (Opening Ceremony tab)
  - `data.day2` — sheet **Conference Day 1**
  - `data.day3` — sheet **Day 3** (WTISD tab)
  - `data.day4` — sheet **Conference Day 2** (empty `[]` if the tab is missing or only has a header row)
- Open `/schedule` and verify each tab shows the matching sheet.

**Quick mapping**

| Google Sheet tab       | JSON key | Schedule page tab        |
|------------------------|----------|---------------------------|
| Day 1                  | `day1`   | Opening Ceremony        |
| **Conference Day 1** | `day2` | Conference Day 1 |
| **Conference Day 2** | `day4` | Conference Day 2 |
| Day 3                  | `day3`   | WTISD                    |

**Conference Day 2 tab empty?** Paste **`google-apps-script/Code.gs`** into Apps Script, redeploy the web app, open **`YOUR_EXEC_URL?action=schedule`** and check **`data.day4`**. Tab matching ignores extra spaces and letter case. Restart your Next.js host so schedule isn’t served from an old cached payload (`schedule-page:v4` cache bump).

## 7) Test events API

- Open this in browser after deployment:
  - `YOUR_EXEC_URL?action=events`
- Confirm JSON rows include:
  - `id`
  - `date`
  - `title`
  - `description`
  - `link`
- Open `/events` and home page latest updates to verify live rows load.

## 8) Test duplicate email check

- Open this in browser after deployment:
  - `YOUR_EXEC_URL?action=checkEmail&email=someone@example.com`
- Confirm JSON returns:
  - `success: true`
  - `exists: true` (if email already present) or `false`
- Open `/register` and submit with existing email:
  - App should show: `This email is already registered.`

## 9) Test speakers API

- Open this in browser after deployment:
  - `YOUR_EXEC_URL?action=speakers`
- Confirm JSON rows include:
  - `id`
  - `name`
  - `designation`
  - `company`
  - `biography`
  - `photo`
- Open `/speakers` and home page speaker section to verify live rows load.
- `photo` supports:
  - Full URL (for example: `https://.../photo.jpg`)
  - Local filename in `public/speakers` (for example: `Dr.Shantigram Jagannath.png`)

