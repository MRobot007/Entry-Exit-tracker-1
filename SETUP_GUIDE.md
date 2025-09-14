# Entry/Exit Tracker - Setup Guide

## 🚀 Quick Setup

### 1. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Google Sheets API Configuration
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
VITE_GOOGLE_SHEET_ID=your_sheet_id_here
VITE_GOOGLE_CLIENT_ID=your_client_id_here

# Google Apps Script Web App URL (optional)
VITE_GOOGLE_APPS_SCRIPT_URL=your_apps_script_url_here

# Application Configuration
VITE_APP_TITLE=Entry Exit Tracker
VITE_APP_DESCRIPTION=Campus Entry Management System
```

### 2. Google Sheets Setup

#### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Rename it to "Entry Exit Tracker Database"
4. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)

#### Step 2: Set up Sheets Structure
The application will automatically create the required sheets, but you can also create them manually:

**People Sheet** (for student registrations):
- Headers: ID, Name, Enrollment No, Email, Phone, Course, Branch, Semester, Created Date, Created Time

**Entry Sheets** (one for each course/branch combination):
- Headers: Date, Time, Type, Person Name, Enrollment No, Course, Branch, Semester

#### Step 3: Share the Sheet
1. Click the "Share" button in the top right
2. Click "Change to anyone with the link"
3. Set permission to "Viewer"
4. Click "Done"

### 3. Google Cloud Console Setup

#### Step 1: Create Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one

#### Step 2: Enable APIs
1. Go to "APIs & Services" > "Library"
2. Search for "Google Sheets API" and enable it

#### Step 3: Create Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key
4. (Optional) Restrict the API key for security

#### Step 4: OAuth2 Setup (Optional)
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Set application type to "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:8080/oauth2/callback` (for development)
   - `https://yourdomain.com/oauth2/callback` (for production)
5. Copy the Client ID

### 4. Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 5. Testing the Setup

1. Open the application in your browser
2. Go to `/test` route to run diagnostic tests
3. Check if Google Sheets connection is working
4. Try adding a person and recording an entry

## 🔧 Troubleshooting

### Common Issues

1. **"Missing required environment variables" error**
   - Make sure your `.env` file exists and has all required variables
   - Restart the development server after adding environment variables

2. **Google Sheets API errors**
   - Check if the API is enabled in Google Cloud Console
   - Verify your API key is correct
   - Ensure the sheet is shared with "Anyone with the link can view"

3. **OAuth2 authentication issues**
   - Check if the redirect URI is correctly configured
   - Verify the Client ID is correct
   - Make sure the OAuth consent screen is configured

4. **Data not syncing**
   - Check the browser console for errors
   - Verify your internet connection
   - Check if the Google Sheets API quota is exceeded

### Getting Help

1. Check the diagnostic page at `/test`
2. Look at the browser console for error messages
3. Verify all environment variables are set correctly
4. Test the Google Sheets API directly

## 📱 Features

- **QR Code Scanning**: Scan student QR codes for quick entry/exit
- **Manual Entry**: Record entries manually for visitors
- **Offline Support**: Works offline and syncs when online
- **Real-time Statistics**: View today's counts and activity
- **Google Sheets Integration**: All data automatically saved to Google Sheets
- **Responsive Design**: Works on desktop and mobile devices

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Use environment-specific API keys for production
- Consider restricting API keys by IP or domain
- Regularly rotate your API keys
- Monitor your Google Sheets API usage
