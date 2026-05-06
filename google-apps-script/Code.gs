/**
 * NTCE Google Apps Script — bind to your spreadsheet (Extensions → Apps Script).
 * Docs: ../GOOGLE_APPS_SCRIPT_SETUP.md
 *
 * Schedule tabs (exact sheet names):
 *   Day 1 → day1 (Opening Ceremony)
 *   Conference Day 1 → day2 (Conference Day 1)
 *   Conference Day 2 → day4 (Conference Day 2)
 *   Day 3 → day3 (WTISD)
 *
 * Tab lookup is loose (case/extra spaces). Legacy names still work via programme action fallbacks.
 */

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
          day4: readScheduleSheet_("Conference Day 2"),
        },
      });
    }

    if (action === "programme") {
      return jsonResponse({
        success: true,
        data: {
          conference1: readScheduleSheetFirstFound_(["Conference Day 1", "Conference 1"]),
          conference2: readScheduleSheetFirstFound_(["Conference Day 2", "Conference 2"]),
        },
      });
    }

    if (action === "events") {
      return jsonResponse({
        success: true,
        data: readScheduleSheet_("Events"),
      });
    }

    if (action === "speakers") {
      return jsonResponse({
        success: true,
        data: readScheduleSheet_("Speakers"),
      });
    }

    if (action === "checkemail") {
      const email = String(e.parameter.email || "").trim().toLowerCase();
      if (!email) {
        return jsonResponse({ success: false, error: "email query parameter is required." });
      }

      return jsonResponse({
        success: true,
        exists: emailExists_("Registrations", "Email", email),
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
    if (!sheet) return jsonResponse({ success: false, error: "Sheet 'Registrations' not found." });

    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const fullName = data["Full Name"] || "";
    const email = data.Email || "";
    const mobileNumber = data["Mobile number"] || "";
    const organization = data.Organization || "";
    const designation = data.Designation || "";
    const attendance = data.Attendance || "";
    const topicInterest = data.Topic_interest || "";
    const topicInterestArray = data.Topic_interest_array || "[]";
    const message = data.message || "";
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!fullName || !email || !mobileNumber || !organization || !designation || !attendance) {
      return jsonResponse({
        success: false,
        error:
          "Full Name, Email, Mobile number, Organization, Designation, and Attendance are required.",
      });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      if (normalizedEmail && emailExists_("Registrations", "Email", normalizedEmail)) {
        return jsonResponse({
          success: false,
          code: "DUPLICATE_EMAIL",
          error: "This email is already registered.",
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
        new Date(),
      ]);
    } finally {
      lock.releaseLock();
    }

    var adminEmailSent = false;
    var adminEmailError = "";

    var adminEmail = "tandin.jamtsho@bt.bt";
    var adminSubject = "New NTCE Registration: " + fullName;
    var adminBody =
      "A new registration was submitted.\n\n" +
      "Full Name: " +
      fullName +
      "\n" +
      "Email: " +
      email +
      "\n" +
      "Mobile: " +
      mobileNumber +
      "\n" +
      "Organization: " +
      organization +
      "\n" +
      "Designation: " +
      designation +
      "\n" +
      "Attendance: " +
      attendance +
      "\n" +
      "Topic Interest: " +
      topicInterest +
      "\n" +
      "Message: " +
      message +
      "\n" +
      "Timestamp: " +
      new Date().toISOString() +
      "\n";

    try {
      MailApp.sendEmail({
        to: adminEmail,
        subject: adminSubject,
        body: adminBody,
        replyTo: email,
      });
      adminEmailSent = true;
    } catch (err) {
      adminEmailError = String(err);
      Logger.log("Admin email failed: " + adminEmailError);
    }

    return jsonResponse({
      success: true,
      email: {
        adminEmailSent: adminEmailSent,
        adminEmailError: adminEmailSent ? "" : "Admin notification failed.",
      },
    });
  } catch (err) {
    return jsonResponse({ success: false, error: String(err) });
  }
}

/** Normalize tab titles so "Conference  2" matches "conference 2". */
function normalizeSheetTitle_(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/** Exact name first, then case/spacing-insensitive match across all tabs. */
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

/** First alias that resolves to a sheet wins. */
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
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
