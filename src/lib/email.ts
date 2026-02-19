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
    
    console.log('📧 Attempting to send email to:', options.to);
    console.log('📧 Email API URL:', emailApiUrl);
    
    const res = await fetch(emailApiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    // Check if response is ok before trying to parse JSON
    if (!res.ok) {
      const text = await res.text();
      console.error('❌ Email API error response:', text);
      return { 
        success: false, 
        error: `HTTP ${res.status}: ${text || 'Email server error'}` 
      };
    }

    let data;
    try {
      data = await res.json();
    } catch (e) {
      const text = await res.text();
      console.error('❌ Failed to parse JSON response:', text);
      return { success: false, error: `Server error: ${text || res.statusText}` };
    }
    
    console.log('📧 Email API response:', data);

    if (data.success) {
      return { success: true };
    } else {
      return { success: false, error: data.message || data.error || 'Failed to send email' };
    }
  } catch (error: any) {
    console.error('❌ Email send error:', error);
    const errorMessage = error.message || 'Network error';
    
    // Check if it's a network error (server not running)
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
      return { 
        success: false, 
        error: 'Email server δεν τρέχει. Παρακαλώ εκκινήστε το email server με: npm run email:server' 
      };
    }
    
    return { success: false, error: errorMessage };
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

/**
 * Format email template for problem report notification
 */
export function formatProblemReportEmail(problem: { 
  title: string; 
  description: string; 
  location?: string | null;
  priority: string;
  category: string;
  id: string;
}): string {
  const priorityLabels: Record<string, string> = {
    low: 'Χαμηλή',
    medium: 'Μεσαία',
    high: 'Υψηλή',
    critical: 'Κρίσιμη',
  };

  const categoryLabels: Record<string, string> = {
    maintenance: 'Συντήρηση',
    meter: 'Μετρητής',
    billing: 'Χρέωση',
  };

  const frontendUrl = typeof window !== 'undefined' ? window.location.origin : 'https://deyaa.gr';
  const problemUrl = `${frontendUrl}/problems`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9fafb; }
        .problem-info { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .info-row { margin: 10px 0; }
        .label { font-weight: bold; color: #666; }
        .priority-badge { display: inline-block; padding: 4px 8px; border-radius: 3px; font-size: 12px; font-weight: bold; }
        .priority-critical { background-color: #dc2626; color: white; }
        .priority-high { background-color: #f59e0b; color: white; }
        .priority-medium { background-color: #3b82f6; color: white; }
        .priority-low { background-color: #6b7280; color: white; }
        .button { display: inline-block; padding: 12px 24px; background-color: #2161ab; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ΔΕΥΑΑ Αποκορώνου</h1>
          <p style="margin: 0; font-size: 18px;">Νέα Αναφορά Προβλήματος</p>
        </div>
        <div class="content">
          <h2 style="color: #dc2626; margin-top: 0;">${problem.title}</h2>
          
          <div class="problem-info">
            <div class="info-row">
              <span class="label">Κατηγορία:</span> ${categoryLabels[problem.category] || problem.category}
            </div>
            <div class="info-row">
              <span class="label">Προτεραιότητα:</span> 
              <span class="priority-badge priority-${problem.priority}">
                ${priorityLabels[problem.priority] || problem.priority}
              </span>
            </div>
            ${problem.location ? `
            <div class="info-row">
              <span class="label">Τοποθεσία:</span> ${problem.location}
            </div>
            ` : ''}
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Περιγραφή:</h3>
            <p style="white-space: pre-wrap;">${problem.description}</p>
          </div>

          <a href="${problemUrl}" class="button">Δείτε όλα τα προβλήματα</a>

          <div class="footer">
            <p>ΔΕΥΑΑ Αποκορώνου<br/>
            Δημοτική Επιχείρηση Ύδρευσης Αποχέτευσης Αποκορώνου</p>
            <p>Αυτό το email στάλθηκε επειδή έχετε εγγραφεί για ενημερώσεις σχετικά με προβλήματα.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
