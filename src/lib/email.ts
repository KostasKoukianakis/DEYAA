/**
 * Email notification utilities
 * Uses Express email server with Nodemailer + Zoho SMTP
 */

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email notification via email server API
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const emailApiUrl = import.meta.env.VITE_EMAIL_API_URL || '/api/send-email';
    
    const res = await fetch(emailApiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      return { success: true };
    } else {
      return { success: false, error: data.message || 'Failed to send email' };
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}

/**
 * Send notification to subscribers
 */
export async function notifySubscribers(
  subject: string,
  content: string,
  subscriberEmails: string[]
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const email of subscriberEmails) {
    const result = await sendEmail({
      to: email,
      subject,
      html: content,
    });

    if (result.success) {
      sent++;
    } else {
      failed++;
    }
  }

  return { sent, failed };
}

/**
 * Format email template for post published notification
 */
export function formatPostPublishedEmail(post: { title: string; excerpt?: string; url: string }): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9fafb; }
        .button { display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ΔΕΥΑΑ Αποκορώνου</h1>
        </div>
        <div class="content">
          <h2>Νέα Ανακοίνωση: ${post.title}</h2>
          ${post.excerpt ? `<p>${post.excerpt}</p>` : ''}
          <a href="${post.url}" class="button">Δείτε περισσότερα</a>
        </div>
      </div>
    </body>
    </html>
  `;
}
