# 🚀 Quick Setup Guide - Fix Connection Issues

## ❌ Current Problem
Your Google Sheets connection is failing because the environment variables are not configured.

## ✅ Solution Steps

### Step 1: Create Environment File
1. In your project root directory, create a file named `.env`
2. Copy the contents from `env.example` into your `.env` file

### Step 2: Get Google Sheets API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to "APIs & Services" > "Library"
4. Search for "Google Sheets API" and enable it
5. Go to "APIs & Services" > "Credentials"
6. Click "Create Credentials" > "API Key"
7. Copy the API key

### Step 3: Get Google Sheet ID
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Look at the URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`
4. Copy the `YOUR_SHEET_ID` part

### Step 4: Configure .env File
Replace the placeholder values in your `.env` file:

```env
# Google Sheets API Configuration
VITE_GOOGLE_SHEETS_API_KEY=AIzaSyB6pin55i4wfXUOXlUxbs8QFVsQVQxZRfw
VITE_GOOGLE_SHEET_ID=1uqwoyKauV2gzBFmBN6dXpWOWQYTApoZvf3mqpf9A3Zw
VITE_GOOGLE_CLIENT_ID=your_client_id_here
VITE_GOOGLE_APPS_SCRIPT_URL=your_apps_script_url_here

# Application Configuration
VITE_APP_TITLE=Entry Exit Tracker
VITE_APP_DESCRIPTION=Campus Entry Management System
```

### Step 5: Share Your Google Sheet
1. Open your Google Sheet
2. Click "Share" button (top right)
3. Click "Change to anyone with the link"
4. Set permission to "Viewer"
5. Click "Done"

### Step 6: Restart Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

### Step 7: Test Connection
1. Go to `http://localhost:8080/test`
2. Click "Run Diagnostic Tests"
3. All tests should now pass ✅

## 🔧 Troubleshooting

### If API Key Error:
- Make sure the API key is correct
- Check if Google Sheets API is enabled
- Verify the API key has no restrictions

### If Sheet Access Error:
- Make sure the sheet is shared with "Anyone with the link can view"
- Check if the Sheet ID is correct
- Verify the sheet exists and is accessible

### If Still Having Issues:
1. Check browser console for detailed error messages
2. Verify all environment variables are set correctly
3. Make sure you restarted the development server after creating .env
4. Check the diagnostic page for specific error details

## 📞 Need Help?
- Check the browser console for error messages
- Use the diagnostic tool at `/test` route
- Verify each step above is completed correctly
