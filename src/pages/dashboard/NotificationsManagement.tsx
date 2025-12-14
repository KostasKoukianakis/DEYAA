import { useState } from 'react';
import { Search, Mail, CheckCircle, XCircle, Clock, Send, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data - θα αντικατασταθεί με δεδομένα από Supabase
const mockNotifications = [
  {
    id: '1',
    type: 'post_published',
    subject: 'Νέα ανακοίνωση για το νερό',
    content: 'Έχουμε δημοσιεύσει νέα ανακοίνωση σχετικά με τις υπηρεσίες ύδρευσης...',
    recipient_email: 'giannis@example.com',
    recipient_name: 'Γιάννης Παπαδόπουλος',
    sent_at: '2024-12-14T10:30:00Z',
    status: 'sent',
    created_at: '2024-12-14T10:25:00Z',
  },
  {
    id: '2',
    type: 'problem_update',
    subject: 'Ενημέρωση για το πρόβλημα στο κέντρο',
    content: 'Το πρόβλημα με τη βλάβη στο δίκτυο έχει επιλυθεί...',
    recipient_email: 'maria@example.com',
    recipient_name: 'Μαρία Κωνσταντίνου',
    sent_at: null,
    status: 'pending',
    created_at: '2024-12-13T15:45:00Z',
  },
  {
    id: '3',
    type: 'maintenance_alert',
    subject: 'Προγραμματισμένη συντήρηση δικτύου',
    content: 'Θα πραγματοποιηθεί συντήρηση του δικτύου ύδρευσης την Κυριακή...',
    recipient_email: 'dimitris@example.com',
    recipient_name: 'Δημήτρης Ανδρέου',
    sent_at: '2024-12-12T09:20:00Z',
    status: 'sent',
    created_at: '2024-12-12T09:15:00Z',
  },
  {
    id: '4',
    type: 'post_published',
    subject: 'Αλλαγές στα τιμολόγια',
    content: 'Πληροφορίες για τις νέες χρεώσεις από 1/1/2025...',
    recipient_email: 'anna@example.com',
    recipient_name: null,
    sent_at: null,
    status: 'failed',
    error_message: 'Invalid email address',
    created_at: '2024-12-11T14:30:00Z',
  },
];

export default function NotificationsManagement() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isResendDialogOpen, setIsResendDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.recipient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleResendNotification = (notification) => {
    // Mock resend
    const updatedNotifications = notifications.map(n =>
      n.id === notification.id
        ? { ...n, status: 'pending', sent_at: null, error_message: null }
        : n
    );
    setNotifications(updatedNotifications);
    setIsResendDialogOpen(false);
    setSelectedNotification(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Απεστάλη</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-200 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Εκκρεμεί</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Απέτυχε</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'post_published':
        return <Badge variant="outline" className="border-blue-200 text-blue-800">Νέα Ανακοίνωση</Badge>;
      case 'problem_update':
        return <Badge variant="outline" className="border-red-200 text-red-800">Ενημέρωση Προβλήματος</Badge>;
      case 'maintenance_alert':
        return <Badge variant="outline" className="border-orange-200 text-orange-800">Συντήρηση</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const sentNotifications = notifications.filter(n => n.status === 'sent').length;
  const pendingNotifications = notifications.filter(n => n.status === 'pending').length;
  const failedNotifications = notifications.filter(n => n.status === 'failed').length;
  const totalNotifications = notifications.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Διαχείριση Ειδοποιήσεων</h1>
          <p className="text-gray-600">Παρακολουθήστε και διαχειριστείτε τις αποσταλμένες ειδοποιήσεις</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Σύνολο Ειδοποιήσεων</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNotifications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Απεσταλμένες</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{sentNotifications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Εκκρεμείς</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingNotifications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Αποτυχημένες</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedNotifications}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Αναζήτηση ειδοποιήσεων..."
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
            <SelectItem value="all">Όλες</SelectItem>
            <SelectItem value="sent">Απεσταλμένες</SelectItem>
            <SelectItem value="pending">Εκκρεμείς</SelectItem>
            <SelectItem value="failed">Αποτυχημένες</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Τύπος" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Όλοι οι τύποι</SelectItem>
            <SelectItem value="post_published">Νέες Ανακοινώσεις</SelectItem>
            <SelectItem value="problem_update">Ενημερώσεις Προβλημάτων</SelectItem>
            <SelectItem value="maintenance_alert">Συντήρηση</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notifications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ειδοποιήσεις ({filteredNotifications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Τύπος</TableHead>
                <TableHead>Θέμα</TableHead>
                <TableHead>Παραλήπτης</TableHead>
                <TableHead>Κατάσταση</TableHead>
                <TableHead>Ημερομηνία Αποστολής</TableHead>
                <TableHead>Ενέργειες</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>{getTypeBadge(notification.type)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{notification.subject}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{notification.content}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">
                        {notification.recipient_name || 'Χωρίς όνομα'}
                      </div>
                      <div className="text-sm text-gray-500">{notification.recipient_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {getStatusBadge(notification.status)}
                      {notification.error_message && (
                        <div className="text-xs text-red-600 mt-1">
                          {notification.error_message}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {notification.sent_at ? (
                      <div className="text-sm">
                        {new Date(notification.sent_at).toLocaleDateString('el-GR')}
                        <br />
                        <span className="text-gray-500">
                          {new Date(notification.sent_at).toLocaleTimeString('el-GR')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Δεν έχει αποσταλεί</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {notification.status === 'failed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedNotification(notification);
                            setIsResendDialogOpen(true);
                          }}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Resend Dialog */}
      <Dialog open={isResendDialogOpen} onOpenChange={setIsResendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Επαναποστολή Ειδοποίησης</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Θέλετε να επαναποστείλτε αυτή την ειδοποίηση;
            </p>
            {selectedNotification && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="font-medium">{selectedNotification.subject}</div>
                <div className="text-sm text-gray-600 mt-1">
                  Παραλήπτης: {selectedNotification.recipient_email}
                </div>
                <div className="text-sm text-red-600 mt-1">
                  Προηγούμενο σφάλμα: {selectedNotification.error_message}
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsResendDialogOpen(false)}>
                Ακύρωση
              </Button>
              <Button onClick={() => handleResendNotification(selectedNotification)}>
                <Send className="mr-2 h-4 w-4" />
                Επαναποστολή
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
