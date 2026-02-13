import { useMemo, useState } from 'react';
import { Search, Mail, Phone, Calendar, UserCheck, UserX, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCreateNotification, useUpdateNotification } from '@/hooks/useNotifications';
import { useSubscribers } from '@/hooks/useSubscribers';
import { sendEmail } from '@/lib/email';

export default function SubscribersManagement() {
  const { toast } = useToast();
  const { data: subscribers = [], isLoading, error } = useSubscribers();
  const createNotification = useCreateNotification();
  const updateNotification = useUpdateNotification();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [notificationForm, setNotificationForm] = useState({
    subject: '',
    content: '',
    type: 'posts',
  });

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((subscriber: any) => {
      const matchesSearch =
        (subscriber.email ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (subscriber.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (subscriber.phone ?? '').includes(searchTerm);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && subscriber.is_active) ||
        (statusFilter === 'inactive' && !subscriber.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, subscribers]);

  const handleSelectSubscriber = (subscriberId: string) => {
    setSelectedSubscribers(prev =>
      prev.includes(subscriberId)
        ? prev.filter(id => id !== subscriberId)
        : [...prev, subscriberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSubscribers.length === filteredSubscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(filteredSubscribers.map(s => s.id));
    }
  };

  const handleSendNotification = async () => {
    try {
      const recipients = subscribers.filter((s: any) => selectedSubscribers.includes(s.id));
      const type =
        notificationForm.type === 'posts'
          ? 'post_published'
          : notificationForm.type === 'problems'
            ? 'problem_update'
            : notificationForm.type === 'maintenance'
              ? 'maintenance_alert'
              : 'post_published';

      // Create notification records first
      const notifications = await Promise.all(
        recipients.map((r: any) =>
          createNotification.mutateAsync({
            type: type as any,
            subject: notificationForm.subject,
            content: notificationForm.content,
            recipient_email: r.email,
            recipient_name: r.name,
            status: 'pending',
            sent_at: null,
            error_message: null,
            reference_id: null,
          } as any)
        )
      );

      // Send emails and update notification status
      let sent = 0;
      let failed = 0;

      for (let i = 0; i < recipients.length; i++) {
        const recipient = recipients[i];
        const notification = notifications[i];

        try {
          const result = await sendEmail({
            to: recipient.email,
            subject: notificationForm.subject,
            html: notificationForm.content,
          });

          if (result.success) {
            sent++;
            await updateNotification.mutateAsync({
              id: notification.id,
              updates: {
                status: 'sent',
                sent_at: new Date().toISOString(),
              },
            });
          } else {
            failed++;
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
      setIsNotificationDialogOpen(false);
      setSelectedSubscribers([]);
      setNotificationForm({ subject: '', content: '', type: 'posts' });
    } catch (e: any) {
      toast({
        title: 'Σφάλμα',
        description: e?.message ?? 'Αποτυχία αποστολής ειδοποιήσεων.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (subscriber) => {
    if (!subscriber.is_active) {
      return <Badge variant="secondary">Ανενεργός</Badge>;
    }
    if (!subscriber.verified_at) {
      return <Badge variant="outline" className="border-yellow-200 text-yellow-800">Μη Επαληθευμένος</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Ενεργός</Badge>;
  };

  const getPreferencesDisplay = (preferences) => {
    const prefs = [];
    if (preferences?.posts) prefs.push('Ανακοινώσεις');
    if (preferences?.problems) prefs.push('Προβλήματα');
    if (preferences?.maintenance) prefs.push('Συντήρηση');
    return prefs.join(', ') || 'Καμία';
  };

  const activeSubscribers = subscribers.filter((s: any) => s.is_active).length;
  const verifiedSubscribers = subscribers.filter((s: any) => s.verified_at).length;
  const totalSubscribers = subscribers.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Διαχείριση Συνδρομητών</h1>
          <p className="text-gray-600">Διαχειριστείτε τους συνδρομητές και στείλτε ειδοποιήσεις</p>
        </div>
        <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={selectedSubscribers.length === 0}>
              <Send className="mr-2 h-4 w-4" />
              Αποστολή Ειδοποίησης ({selectedSubscribers.length})
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Αποστολή Ειδοποίησης</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="notification-type">Τύπος Ειδοποίησης</Label>
                <Select value={notificationForm.type} onValueChange={(value) => setNotificationForm({ ...notificationForm, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="posts">Νέες Ανακοινώσεις</SelectItem>
                    <SelectItem value="problems">Ενημερώσεις Προβλημάτων</SelectItem>
                    <SelectItem value="maintenance">Συντήρηση</SelectItem>
                    <SelectItem value="general">Γενική Ειδοποίηση</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notification-subject">Θέμα</Label>
                <Input
                  id="notification-subject"
                  value={notificationForm.subject}
                  onChange={(e) => setNotificationForm({ ...notificationForm, subject: e.target.value })}
                  placeholder="Θέμα του email"
                />
              </div>
              <div>
                <Label htmlFor="notification-content">Περιεχόμενο</Label>
                <textarea
                  id="notification-content"
                  value={notificationForm.content}
                  onChange={(e) => setNotificationForm({ ...notificationForm, content: e.target.value })}
                  placeholder="Περιεχόμενο του email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                />
              </div>
              <div className="text-sm text-gray-600">
                Θα σταλεί σε {selectedSubscribers.length} συνδρομητές
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsNotificationDialogOpen(false)}>
                  Ακύρωση
                </Button>
                <Button onClick={handleSendNotification}>
                  Αποστολή
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Σύνολο Συνδρομητών</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscribers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ενεργοί Συνδρομητές</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeSubscribers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Επαληθευμένοι</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{verifiedSubscribers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Αναζήτηση συνδρομητών..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Κατάσταση" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Όλοι</SelectItem>
            <SelectItem value="active">Ενεργοί</SelectItem>
            <SelectItem value="inactive">Ανενεργοί</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Subscribers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Συνδρομητές ({filteredSubscribers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="text-sm text-muted-foreground">Φόρτωση...</div>}
          {error && (
            <div className="text-sm text-red-600">
              Σφάλμα φόρτωσης: {(error as any)?.message ?? 'Άγνωστο σφάλμα'}
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Όνομα</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Τηλέφωνο</TableHead>
                <TableHead>Προτιμήσεις</TableHead>
                <TableHead>Κατάσταση</TableHead>
                <TableHead>Ημερομηνία Εγγραφής</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedSubscribers.includes(subscriber.id)}
                      onCheckedChange={() => handleSelectSubscriber(subscriber.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {subscriber.name || 'Χωρίς όνομα'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm">{subscriber.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {subscriber.phone ? (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm">{subscriber.phone}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Δεν υπάρχει</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{getPreferencesDisplay(subscriber.preferences)}</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(subscriber)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm">
                        {new Date(subscriber.subscribed_at).toLocaleDateString('el-GR')}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
