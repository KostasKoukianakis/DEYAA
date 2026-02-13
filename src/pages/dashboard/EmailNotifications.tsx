import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSubscribers } from '@/hooks/useSubscribers';
import { sendEmail } from '@/lib/email';
import { useToast } from '@/hooks/use-toast';
import { useCreateNotification, useUpdateNotification } from '@/hooks/useNotifications';
import { Send, Mail } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export default function EmailNotifications() {
  const { data: subscribers = [] } = useSubscribers();
  const { toast } = useToast();
  const createNotification = useCreateNotification();
  const updateNotification = useUpdateNotification();
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    sendToAll: true,
    selectedSubscribers: [] as string[],
  });
  const [sending, setSending] = useState(false);

  const activeSubscribers = subscribers.filter(s => s.is_active);

  const handleSend = async () => {
    if (!formData.subject || !formData.content) {
      toast({
        title: 'Σφάλμα',
        description: 'Παρακαλώ συμπληρώστε όλα τα πεδία',
        variant: 'destructive',
      });
      return;
    }

    const recipients = formData.sendToAll
      ? activeSubscribers
      : activeSubscribers.filter(s => formData.selectedSubscribers.includes(s.id));

    if (recipients.length === 0) {
      toast({
        title: 'Σφάλμα',
        description: 'Δεν επιλέχθηκαν παραλήπτες',
        variant: 'destructive',
      });
      return;
    }

    setSending(true);

    let sent = 0;
    let failed = 0;

    try {
      // Create notification records first
      const notificationPromises = recipients.map((subscriber) =>
        createNotification.mutateAsync({
          type: 'post_published',
          subject: formData.subject,
          content: formData.content,
          recipient_email: subscriber.email,
          recipient_name: subscriber.name,
          status: 'pending',
          sent_at: null,
          error_message: null,
          reference_id: null,
        } as any)
      );

      const notifications = await Promise.all(notificationPromises);

      // Send emails
      for (let i = 0; i < recipients.length; i++) {
        const subscriber = recipients[i];
        const notification = notifications[i];

        try {
          const result = await sendEmail({
            to: subscriber.email,
            subject: formData.subject,
            html: formData.content,
          });

          if (result.success) {
            sent++;
            // Update notification status to sent
            await updateNotification.mutateAsync({
              id: notification.id,
              updates: {
                status: 'sent',
                sent_at: new Date().toISOString(),
              },
            });
          } else {
            failed++;
            // Update notification status to failed
            await updateNotification.mutateAsync({
              id: notification.id,
              updates: {
                status: 'failed',
                error_message: result.error || 'Unknown error',
              },
            });
          }
        } catch (error: any) {
          failed++;
          // Update notification status to failed
          await updateNotification.mutateAsync({
            id: notification.id,
            updates: {
              status: 'failed',
              error_message: error.message || 'Failed to send email',
            },
          });
        }
      }

      toast({
        title: 'Επιτυχία',
        description: `Στάλθηκαν ${sent} emails. ${failed > 0 ? `${failed} απέτυχαν.` : ''}`,
      });

      setFormData({
        subject: '',
        content: '',
        sendToAll: true,
        selectedSubscribers: [],
      });
    } catch (error: any) {
      toast({
        title: 'Σφάλμα',
        description: error.message || 'Προέκυψε σφάλμα κατά την αποστολή',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Email Notifications</h1>
        <p className="text-gray-600">Στείλτε email notifications στους συνδρομητές</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Σύνθεση Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="subject">Θέμα *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="π.χ. Νέα Ανακοίνωση"
                />
              </div>
              <div>
                <Label htmlFor="content">Περιεχόμενο (HTML) *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  placeholder="<p>Το περιεχόμενο του email...</p>"
                />
              </div>
              <Button onClick={handleSend} disabled={sending} className="w-full">
                {sending ? (
                  'Αποστολή...'
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Αποστολή Email
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recipients */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Παραλήπτες</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sendToAll"
                  checked={formData.sendToAll}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, sendToAll: checked as boolean, selectedSubscribers: [] })
                  }
                />
                <Label htmlFor="sendToAll" className="cursor-pointer">
                  Στείλε σε όλους ({activeSubscribers.length})
                </Label>
              </div>

              {!formData.sendToAll && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {activeSubscribers.map((subscriber) => (
                    <div key={subscriber.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={subscriber.id}
                        checked={formData.selectedSubscribers.includes(subscriber.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              selectedSubscribers: [...formData.selectedSubscribers, subscriber.id],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              selectedSubscribers: formData.selectedSubscribers.filter((id) => id !== subscriber.id),
                            });
                          }
                        }}
                      />
                      <Label htmlFor={subscriber.id} className="cursor-pointer text-sm">
                        {subscriber.email}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>
                    {formData.sendToAll
                      ? `${activeSubscribers.length} παραλήπτες`
                      : `${formData.selectedSubscribers.length} επιλεγμένοι`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
