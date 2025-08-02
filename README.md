# Advanced Sales Report Form

This project contains a web-based sales reporting form designed to work with Google Apps Script as the backend. The form collects detailed information about sales transactions and stores the data in a Google Spreadsheet.

## How to Set Up

### 1. Setting up the Google Apps Script Backend

1. Create a new Google Spreadsheet in your Google Drive.
2. From the spreadsheet, go to `Extensions` > `Apps Script`.
3. Delete any code in the editor and paste the entire code from `appscript.js`.
4. Save the project and give it a name (e.g., "Sales Report Backend").
5. Deploy the app:
   - Click on "Deploy" > "New deployment".
   - Select "Web app" as the type.
   - Set "Execute as" to "Me".
   - Set "Who has access" to "Anyone" (for public forms) or "Anyone within your organization" (for internal forms).
   - Click "Deploy".
   - Copy the Web App URL that is generated - you will need this in the next step.

### 2. Configuring the Frontend

1. Open the `script.js` file.
2. Find the line `const SCRIPT_URL = '...'` at the beginning of the file.
3. Replace the URL with the Web App URL you copied from the Google Apps Script deployment.
4. Save the file.

### 3. Hosting the Form

1. Upload all the files (`index.html`, `styles.css`, `script.js`) to your GitHub repository.
2. Enable GitHub Pages for your repository:
   - Go to your repository on GitHub.
   - Click on "Settings".
   - Scroll down to "GitHub Pages".
   - Under "Source", select the branch you want to deploy (usually "main" or "master").
   - Click "Save".
   - Wait a few minutes, and your form will be available at the URL shown.

## Features

- Comprehensive sales data collection
- Support for different booking types (New, Reissue, Refund, Installment)
- File uploads for vouchers and invoices
- Automatic calculations for installment payments
- Form data validation
- Data is saved in Google Sheets for easy analysis
- Responsive design works on mobile and desktop

## File Structure

- `index.html` - The main HTML form
- `styles.css` - CSS styles for the form
- `script.js` - JavaScript code for form functionality and submission
- `appscript.js` - Google Apps Script code for the backend (copy to Google Apps Script)

## Troubleshooting

### CORS Issues
If you encounter CORS (Cross-Origin Resource Sharing) errors when submitting the form, make sure:
1. Your Google Apps Script is deployed as a web app with appropriate permissions.
2. The `SCRIPT_URL` in `script.js` is correctly set to your deployed web app URL.
3. In your Google Apps Script project, add this function to handle CORS:

```javascript
function doOptions(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var headers = e.parameter.headers;
    if (headers) {
      headers = JSON.parse(headers);
    }

    return ContentService
      .createTextOutput(JSON.stringify({"status": "ok"}))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

### File Upload Limits
Google Apps Script has limitations on the size of data that can be processed. If you're having issues with file uploads:
1. Reduce the file size before uploading.
2. Consider implementing file compression on the client side.
3. For production environments, consider using Google Drive API directly for file storage.

## License

This project is available for use under the MIT License.