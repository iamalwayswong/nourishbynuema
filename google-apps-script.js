/**
 * Google Apps Script — paste this into your Google Sheet's Apps Script editor.
 *
 * SETUP:
 * 1. Open your Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Click Deploy → New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web app URL
 * 6. Paste it into app.js as the GOOGLE_SCRIPT_URL value
 *
 * The sheet will auto-create headers on first submission.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'First Name',
        'Last Name',
        'Email',
        'Neighborhood',
        'Preferred Time',
        'Preferred Days',
        'Broth Flavor',
        'Submitted At'
      ]);
    }

    // Append the row
    sheet.appendRow([
      new Date(),
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.neighborhood || '',
      data.time || '',
      data.days || '',
      data.flavor || '',
      data.submittedAt || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput('Nourish by Nuema waitlist endpoint is active.')
    .setMimeType(ContentService.MimeType.TEXT);
}
