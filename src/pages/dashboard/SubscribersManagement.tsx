import { useState } from 'react';
import { Search, Mail, Phone, Calendar, UserCheck, UserX, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@//components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data - θα αντικατασταθεί με δεδομένα από Supabase
const mockSubscribers = [
  {
    id: '1',
    email: 'giannis@example.com',
    name: 'Γιάννης Παπαδόπουλος',
    phone: '2310-123456',
    preferences: { posts: true, problems: true, maintenance: true },
    subscribed_at: '2024-10-15T10:30:00Z',
    is_active: true,
    verified_at: '2024-10-15T10:35:00Z',
  },
  {
    id: '2',
    email: 'maria@example.com',
    name: 'Μαρία Κωνσταντίνου',
    phone: '2310-654321',
    preferences: { posts: true, problems: false, maintenance: true },
    subscribed_at: '2024-11-20T14:20:00Z',
    is_active: true,
    verified_at: '2024-11-20T14:25:00Z',
  },
  {
    id: '3',
    email: 'dimitris@example.com',
    name: 'Δημήτρης Ανδρέου',
    phone: null,
    preferences: { posts: true, problems: true, maintenance: false },
    subscribed_at: '2024-12-01T09:15:00Z',
    is_active: false,
    unsubscribed_at: '2024-12-10T16:45:00Z',
    verified_at: '2024-12-01T09:20:00Z',
  },
  {
    id: '4',
    email: 'anna@example.com',
    name: null,
    phone: '2310-789012',
    preferences: { posts: false, problems: true, maintenance: true },
    subscribed_at: '2024-11-05T11:00:00Z',
    is_active: true,
    verified_at: null,
  },
];

export default function SubscribersManagement() {
  const [subscribers, setSubscribers] = useState(mockSubscribers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [notificationForm, setNotificationForm] = useState({
    subject: '',
    content: '',
    type: 'posts',
  });

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscriber.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscriber.phone?.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && subscriber.is_active) ||
                         (statusFilter === 'inactive' && !subscriber.is_active);

    return matchesSearch && matchesStatus;
  });

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

  const handleSendNotification = () => {
    // Mock notification sending
    console.log('Sending notification to:', selectedSubscribers);
    console.log('Notification:', notificationForm);
    setIsNotificationDialogOpen(false);
    setSelectedSubscribers([]);
    setNotificationForm({ subject: '', content: '', type: 'posts' });
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
    if (preferences.posts) prefs.push('Ανακοινώσεις');
    if (preferences.problems) prefs.push('Προβλήματα');
    if (preferences.maintenance) prefs.push('Συντήρηση');
    return prefs.join(', ') || 'Καμία';
  };

  const activeSubscribers = subscribers.filter(s => s.is_active).length;
  const verifiedSubscribers = subscribers.filter(s => s.verified_at).length;
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
