# Email Server Setup Guide

This project uses Nodemailer with Zoho SMTP for sending emails to subscribers.

## Environment Variables

**IMPORTANT:** The `.env` file is not included in the repository for security reasons. You need to create your own `.env` file.

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in your actual values (see `.env.example` for the structure)

### Required Zoho App Password Setup

**You MUST create a Zoho App-Specific Password (not your regular password):**

1. Go to: https://accounts.zoho.eu/home#security/app-passwords (or https://accounts.zoho.com/home#security/app-passwords)
2. Sign in with your Zoho account
3. Click "Generate New Password"
4. Enter a label (e.g., "DEYAA Email Server")
5. Copy the generated password immediately (it won't be shown again)
6. Use this app password in `EMAIL_PASS` in your `.env` file

**Note:** If you don't have 2FA enabled, you can use your regular Zoho password, but app-specific passwords are more secure.

### Example `.env` file structure:

**For Local Development:**
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key

# Email Server Configuration
EMAIL_SERVER_PORT=3001
FRONTEND_URL=http://localhost:5173

# Zoho SMTP Configuration
EMAIL_HOST=smtp.zoho.eu
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@zoho.com
EMAIL_PASS=your_zoho_app_password_here
```

**For Production:**
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key

# Email Server Configuration
EMAIL_SERVER_PORT=3001
FRONTEND_URL=https://yourdomain.com

# Zoho SMTP Configuration
EMAIL_HOST=smtp.zoho.eu
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@zoho.com
EMAIL_PASS=your_zoho_app_password_here

# Frontend Environment Variable (for production)
VITE_EMAIL_API_URL=https://api.yourdomain.com/api/send-email
```

**Note:** `FRONTEND_URL` is used for CORS configuration - it tells the email server which frontend domain is allowed to send requests. Use `http://localhost:5173` for local development and `https://yourdomain.com` for production.

## Installation

Install the required dependencies:

```bash
npm install express nodemailer cors dotenv concurrently
```

## Local Development

1. Create a `.env` file with your Zoho email credentials
2. Start the email server: `npm run email:server`
3. In another terminal, start the frontend: `npm run dev`
4. Or run both together: `npm run dev:with-email`

The Vite dev server will proxy `/api/send-email` requests to the email server running on port 3001.

## Production Deployment

1. Deploy the email server (`server/email-server.js`) to your production server
2. Set environment variables on your production server
3. Set `VITE_EMAIL_API_URL` in your frontend build to point to your production email server
4. Build and deploy the frontend: `npm run build`

## Zoho SMTP Settings

- **Host**: smtp.zoho.com (or smtp.zoho.eu for Europe)
- **Port**: 587 (TLS) or 465 (SSL)
- **Secure**: false for port 587, true for port 465
- **Authentication**: Use your Zoho email address and password (or app-specific password if 2FA is enabled)

## Testing

1. Make sure the email server is running (`npm run email:server`)
2. Go to `/dashboard/email-notifications` or `/dashboard/subscribers`
3. Select subscribers and send a test email
4. Check the email server console for success/error messages
5. Verify the email is received at the subscriber's email address

## Usage

### From Dashboard Email Notifications Page

1. Go to `/dashboard/email-notifications`
2. Compose your email (subject + HTML content)
3. Select recipients (all active subscribers or specific ones)
4. Click "Αποστολή Email"

### From Subscribers Management Page

1. Go to `/dashboard/subscribers`
2. Select subscribers using checkboxes
3. Click "Αποστολή Ειδοποίησης"
4. Fill in the notification form
5. Click "Αποστολή"

Both methods will:
- Send the email via the email server
- Create a record in the `notifications` table with status `sent` or `failed`
- Update the notification status based on the result
