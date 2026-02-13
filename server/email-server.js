import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.EMAIL_SERVER_PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.json());

// Nodemailer transporter setup with Zoho SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.zoho.eu',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true,
  logger: true
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email server connection error:', error);
    console.error('\n🔍 Troubleshooting tips:');
    console.error('   1. Verify EMAIL_USER matches your Zoho email address');
    console.error('   2. Verify EMAIL_PASS is correct (use app-specific password if 2FA is enabled)');
    console.error('   3. Check if your Zoho account has SMTP access enabled');
    console.error('   4. Try using smtp.zoho.eu or smtp.zoho.in if you\'re in Europe/India');
    console.error(`\n   Current config: ${process.env.EMAIL_USER} @ ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}`);
  } else {
    console.log('✅ Email server is ready to send messages');
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
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to send email. Please try again later.' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'email-server' });
});

// Start the server
app.listen(port, () => {
  console.log(`📧 Email server running on port ${port}`);
  console.log(`   Endpoint: http://localhost:${port}/api/send-email`);
  console.log(`   Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});
