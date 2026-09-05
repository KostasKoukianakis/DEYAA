import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (one level up from server/)
const envPath = path.resolve(__dirname, '..', '.env');
console.log('📁 Loading .env from:', envPath);
const envResult = dotenv.config({ path: envPath });

if (envResult.error) {
  console.error('❌ Error loading .env:', envResult.error);
} else {
  console.log('✅ .env file loaded successfully');
}

const app = express();
const port = process.env.EMAIL_SERVER_PORT || 3001;

// Middleware
const allowedOrigins = new Set(
  [
    process.env.FRONTEND_URL,
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ].filter(Boolean),
);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }
    callback(null, false);
  },
}));
app.use(express.json());

// Auto-detect SMTP settings based on email domain
function getSmtpConfig(email) {
  if (!email) {
    // Fallback to environment variables or Gmail defaults
    return {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
    };
  }

  const emailDomain = email.toLowerCase().split('@')[1];
  
  // Gmail
  if (emailDomain === 'gmail.com') {
    return {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
    };
  }
  
  // Outlook / Hotmail / Live / MSN
  if (['outlook.com', 'hotmail.com', 'hotmail.gr', 'live.com', 'msn.com'].includes(emailDomain)) {
    return {
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
    };
  }
  
  // Yahoo
  if (['yahoo.com', 'yahoo.gr', 'ymail.com'].includes(emailDomain)) {
    return {
      host: 'smtp.mail.yahoo.com',
      port: 587,
      secure: false,
    };
  }
  
  // Zoho
  if (emailDomain.includes('zoho')) {
    return {
      host: 'smtp.zoho.eu',
      port: 587,
      secure: false,
    };
  }
  
  // ProtonMail
  if (emailDomain === 'protonmail.com' || emailDomain === 'proton.me') {
    return {
      host: '127.0.0.1',
      port: 1025,
      secure: false,
    };
  }
  
  // Default: Use environment variables or Gmail
  return {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
  };
}

// Get SMTP config from EMAIL_USER or use defaults
const emailUser = process.env.EMAIL_USER || '';
const smtpConfig = getSmtpConfig(emailUser);

// Debug: Check if credentials are loaded
console.log('🔍 Email Configuration Check:');
console.log('   EMAIL_USER:', process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 5)}...` : 'NOT SET');
console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET (' + process.env.EMAIL_PASS.length + ' chars)' : 'NOT SET');
console.log('   SMTP Host:', smtpConfig.host);
console.log('   SMTP Port:', smtpConfig.port);

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('❌ ERROR: EMAIL_USER or EMAIL_PASS is missing!');
  console.error('   Make sure .env file exists and contains:');
  console.error('   EMAIL_USER=your_email@gmail.com');
  console.error('   EMAIL_PASS=your_app_password');
}

// Nodemailer transporter setup - auto-detects provider
const transporter = nodemailer.createTransport({
  host: smtpConfig.host,
  port: smtpConfig.port,
  secure: smtpConfig.secure,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email server connection error:', error);
    console.error('\n🔍 Troubleshooting tips:');
    console.error('   1. Verify EMAIL_USER matches your email address');
    console.error('   2. Verify EMAIL_PASS is correct (use App Password, not regular password)');
    console.error('   3. For Gmail: Enable 2FA and create App Password at https://myaccount.google.com/apppasswords');
    console.error('   4. For Outlook: Use your password or App Password');
    console.error(`\n   Detected provider: ${smtpConfig.host}:${smtpConfig.port}`);
    console.error(`   Current config: ${process.env.EMAIL_USER || 'NOT SET'} @ ${smtpConfig.host}:${smtpConfig.port}`);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('\n⚠️  EMAIL_USER or EMAIL_PASS is missing in .env file!');
      console.error('   Add to .env:');
      console.error('   EMAIL_USER=your_email@gmail.com');
      console.error('   EMAIL_PASS=your_app_password');
    }
  } else {
    console.log('✅ Email server is ready to send messages');
    console.log(`   Provider: ${smtpConfig.host}:${smtpConfig.port} (auto-detected)`);
    console.log(`   From: ${process.env.EMAIL_USER}`);
  }
});

// Helper function to escape HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// API endpoint for sending emails to subscribers
app.post('/api/send-email', async (req, res) => {
  const { to, subject, html, text } = req.body;

  // Check credentials before proceeding
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Missing email credentials!');
    console.error('   EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
    console.error('   EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
    return res.status(500).json({ 
      success: false, 
      message: 'Email server configuration error: Missing EMAIL_USER or EMAIL_PASS in .env file' 
    });
  }

  // Validation
  if (!to || !subject || !html) {
    return res.status(400).json({ 
      success: false, 
      message: 'to, subject, and html are required.' 
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const recipients = Array.isArray(to) ? to : [to];
  
  for (const email of recipients) {
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid email address: ${email}` 
      });
    }
  }

  try {
    const mailOptions = {
      from: `"ΔΕΥΑΑ Αποκορώνου" <${process.env.EMAIL_USER}>`,
      to: recipients,
      subject: subject,
      html: html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    console.log(`📧 Sending email...`);
    console.log(`   From: ${mailOptions.from}`);
    console.log(`   To: ${Array.isArray(mailOptions.to) ? mailOptions.to.join(', ') : mailOptions.to}`);
    console.log(`   Subject: ${mailOptions.subject}`);
    
    const result = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email sent successfully!`);
    console.log(`   Message ID: ${result.messageId}`);
    
    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully!',
      messageId: result.messageId
    });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    console.error('   Error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
    });
    
    let errorMessage = 'Failed to send email. Please try again later.';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Authentication failed. Check EMAIL_USER and EMAIL_PASS in .env file.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Connection failed. Check your internet connection and SMTP settings.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      errorCode: error.code || 'UNKNOWN'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'email-server' });
});

const server = app.listen(port, () => {
  console.log(`📧 Email server running on port ${port}`);
  console.log(`   Endpoint: http://localhost:${port}/api/send-email`);
  console.log(`   Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.warn(`⚠️  Port ${port} is already in use — email server is already running.`);
    process.exit(0);
  }
  throw error;
});
