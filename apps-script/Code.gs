/**
 * Wedding Binder — Google Sheets backend.
 *
 * Deploy this as a Web App (Deploy > New deployment > Web app):
 *   Execute as:      Me
 *   Who has access:  Anyone
 *
 * The deployed /exec URL is what the binder website talks to. It stores the
 * whole binder's data as one JSON blob in cell A1 of a "BinderData" sheet —
 * this sheet is a database for the app, not meant to be hand-edited.
 * Edit your data through the website instead.
 */

const SHEET_NAME = "BinderData";
const AUTH_TOKEN = "LambertLockdown"; // must match the binder's passcode

function doGet(e) {
  const sheet = getSheet();
  const json = sheet.getRange("A1").getValue() || "{}";
  return jsonOutput_(json, true);
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonOutput_({ ok: false, error: "bad_json" });
  }
  if (body.token !== AUTH_TOKEN) {
    return jsonOutput_({ ok: false, error: "unauthorized" });
  }
  const sheet = getSheet();
  sheet.getRange("A1").setValue(JSON.stringify(body.data));
  sheet.getRange("B1").setValue(new Date());
  return jsonOutput_({ ok: true });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange("A1").setValue("{}");
    sheet.getRange("A1").setNote(
      "Do not edit by hand — this stores the wedding binder's data as JSON. Edit through the binder website instead."
    );
    sheet.getRange("B1").setValue("Last updated");
  }
  return sheet;
}

// doGet already returns a raw JSON blob (not wrapped in {ok:true}), so its
// second argument skips the wrapper; doPost always wraps its result.
function jsonOutput_(payload, raw) {
  const text = raw ? payload : JSON.stringify(payload);
  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.JSON);
}
