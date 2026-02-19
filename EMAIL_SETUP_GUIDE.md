# 📧 Email Setup Guide - Step by Step

## Gmail Setup (Recommended)

### Step 1: Create Gmail Account (if you don't have one)
1. Go to: https://accounts.google.com/signup
2. Fill in your details and create account

### Step 2: Enable 2-Step Verification
1. Go to: https://myaccount.google.com/security
2. Find "Signing in to Google" section
3. Click on "2-Step Verification"
4. Click "Get Started"
5. Follow the steps (verify with phone or Authenticator app)

### Step 3: Create App Password
1. After enabling 2-Step Verification, go to: https://myaccount.google.com/apppasswords
2. Select "Select app" → Choose "Mail"
3. Select "Select device" → Choose "Other (Custom name)"
4. Type: "DEYAA Newsletter Server"
5. Click "Generate"
6. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

### Step 4: Add to .env file
1. Open your `.env` file in the project root
2. Add these lines:
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=abcdefghijklmnop
```
(Remove spaces from the app password - it should be 16 characters without spaces)

### Step 5: Restart Server
1. Stop the server (Ctrl+C)
2. Run again: `npm run dev:with-email`

---

## Outlook/Hotmail Setup (Alternative)

### Step 1: Enable Two-Step Verification
1. Go to: https://account.microsoft.com/security
2. Enable "Two-step verification"

### Step 2: Create App Password
1. Go to: https://account.microsoft.com/security/app-passwords
2. Create App Password for "Mail"
3. Copy the password

### Step 3: Add to .env file
```env
EMAIL_USER=your_email@outlook.com
EMAIL_PASS=app_password_here
```

---

## Important Notes

⚠️ **Use App Password, NOT your regular password!**
- App Passwords are safer and required for SMTP
- Your regular password won't work for sending emails

⚠️ **Keep your App Password secure**
- If you lose it, just create a new one
- You can have multiple App Passwords for different apps

---

## Testing

After setup, try subscribing to the newsletter:
1. Go to your website footer
2. Enter a test email address
3. Check if you receive the verification email

If you see errors, check:
- Email server console for error messages
- Browser console (F12) for network errors
- Make sure EMAIL_USER and EMAIL_PASS are correct in .env

---

## Troubleshooting

**Error: "Missing credentials"**
- Make sure EMAIL_USER and EMAIL_PASS are set in .env
- Restart the server after changing .env

**Error: "Invalid login"**
- Make sure you're using App Password, not regular password
- Verify 2-Step Verification is enabled

**Error: "Connection timeout"**
- Check your internet connection
- Verify EMAIL_HOST is correct (auto-detected, but you can override)
