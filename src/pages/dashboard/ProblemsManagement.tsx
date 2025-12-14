import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Search, MapPin, Phone, Mail } from 'lucide-react';
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
const mockProblems = [
  {
    id: '1',
    title: 'Βλάβη στο δίκτυο Κέντρου',
    description: 'Διαρροή νερού στην περιοχή του κέντρου της πόλης',
    location: 'Κέντρο Πόλης, Πλατεία Ελευθερίας',
    status: 'in_progress',
    priority: 'high',
    category: 'maintenance',
    reported_by: 'Γιάννης Παπαδόπουλος',
    contact_phone: '2310-123456',
    contact_email: 'giannis@example.com',
    created_at: '2024-12-14T08:30:00Z',
    estimated_resolution: '2024-12-15T18:00:00Z',
  },
  {
    id: '2',
    title: 'Διαρροή νερού στην οδό Αθηνών',
    description: 'Αναφορά για διαρροή νερού έξω από το σπίτι',
    location: 'Οδός Αθηνών 45',
    status: 'reported',
    priority: 'medium',
    category: 'maintenance',
    reported_by: 'Μαρία Κωνσταντίνου',
    contact_phone: '2310-654321',
    contact_email: 'maria@example.com',
    created_at: '2024-12-13T14:20:00Z',
    estimated_resolution: null,
  },
  {
    id: '3',
    title: 'Πρόβλημα μετρητή',
    description: 'Ο μετρητής νερού δεν καταγράφει σωστά την κατανάλωση',
    location: 'Οδός Ηρακλείου 12',
    status: 'resolved',
    priority: 'low',
    category: 'meter',
    reported_by: 'Δημήτρης Ανδρέου',
    contact_phone: '2310-789012',
    contact_email: 'dimitris@example.com',
    created_at: '2024-12-12T11:45:00Z',
    resolved_at: '2024-12-12T16:30:00Z',
    estimated_resolution: null,
  },
];

export default function ProblemsManagement() {
  const [problems, setProblems] = useState(mockProblems);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    priority: 'medium',
    category: 'maintenance',
    status: 'reported',
    contact_phone: '',
    contact_email: '',
    reported_by: '',
  });

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || problem.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || problem.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateProblem = () => {
    const newProblem = {
      id: Date.now().toString(),
      ...formData,
      created_at: new Date().toISOString(),
      estimated_resolution: null,
      resolved_at: null,
    };
    setProblems([newProblem, ...problems]);
    setFormData({
      title: '',
      description: '',
      location: '',
      priority: 'medium',
      category: 'maintenance',
      status: 'reported',
      contact_phone: '',
      contact_email: '',
      reported_by: '',
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditProblem = (problem) => {
    setEditingProblem(problem);
    setFormData({
      title: problem.title,
      description: problem.description,
      location: problem.location || '',
      priority: problem.priority,
      category: problem.category,
      status: problem.status,
      contact_phone: problem.contact_phone || '',
      contact_email: problem.contact_email || '',
      reported_by: problem.reported_by || '',
    });
  };

  const handleUpdateProblem = () => {
    const updatedProblems = problems.map(problem =>
      problem.id === editingProblem.id
        ? {
            ...problem,
            ...formData,
            resolved_at: formData.status === 'resolved' && !problem.resolved_at
              ? new Date().toISOString()
              : problem.resolved_at
          }
        : problem
    );
    setProblems(updatedProblems);
    setEditingProblem(null);
    setFormData({
      title: '',
      description: '',
      location: '',
      priority: 'medium',
      category: 'maintenance',
      status: 'reported',
      contact_phone: '',
      contact_email: '',
      reported_by: '',
    });
  };

  const handleDeleteProblem = (problemId) => {
    setProblems(problems.filter(problem => problem.id !== problemId));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'reported':
        return <Badge variant="outline" className="border-blue-200 text-blue-800">Αναφέρθηκε</Badge>;
      case 'investigating':
        return <Badge variant="outline" className="border-yellow-200 text-yellow-800">Ερευνάται</Badge>;
      case 'in_progress':
        return <Badge className="bg-orange-100 text-orange-800">Σε Εξέλιξη</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">Επιλύθηκε</Badge>;
      case 'closed':
        return <Badge variant="secondary">Κλειστό</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="destructive">Κρίσιμο</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800">Υψηλή</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Μεσαία</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Χαμηλή</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'maintenance':
        return <Badge variant="outline">Συντήρηση</Badge>;
      case 'meter':
        return <Badge variant="outline" className="border-purple-200 text-purple-800">Μετρητής</Badge>;
      case 'billing':
        return <Badge variant="outline" className="border-blue-200 text-blue-800">Χρέωση</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Διαχείριση Προβλημάτων</h1>
          <p className="text-gray-600">Παρακολουθήστε και διαχειριστείτε τις αναφορές προβλημάτων</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Νέο Πρόβλημα
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Καταγραφή Νέου Προβλήματος</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Τίτλος Προβλήματος</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Σύντομος τίτλος του προβλήματος"
                />
              </div>
              <div>
                <Label htmlFor="description">Περιγραφή</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Λεπτομερής περιγραφή του προβλήματος"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="location">Τοποθεσία</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Διεύθυνση ή περιοχή"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Προτεραιότητα</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Χαμηλή</SelectItem>
                      <SelectItem value="medium">Μεσαία</SelectItem>
                      <SelectItem value="high">Υψηλή</SelectItem>
                      <SelectItem value="critical">Κρίσιμη</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Κατηγορία</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintenance">Συντήρηση</SelectItem>
                      <SelectItem value="meter">Μετρητής</SelectItem>
                      <SelectItem value="billing">Χρέωση</SelectItem>
                      <SelectItem value="other">Άλλο</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reported_by">Αναφέρθηκε από</Label>
                  <Input
                    id="reported_by"
                    value={formData.reported_by}
                    onChange={(e) => setFormData({ ...formData, reported_by: e.target.value })}
                    placeholder="Όνομα αναφέροντος"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Κατάσταση</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reported">Αναφέρθηκε</SelectItem>
                      <SelectItem value="investigating">Ερευνάται</SelectItem>
                      <SelectItem value="in_progress">Σε Εξέλιξη</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_phone">Τηλέφωνο Επικοινωνίας</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="2310-123456"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_email">Email Επικοινωνίας</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Ακύρωση
                </Button>
                <Button onClick={handleCreateProblem}>
                  Καταγραφή
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Αναζήτηση προβλημάτων..."
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
            <SelectItem value="reported">Αναφέρθηκαν</SelectItem>
            <SelectItem value="investigating">Ερευνώνται</SelectItem>
            <SelectItem value="in_progress">Σε Εξέλιξη</SelectItem>
            <SelectItem value="resolved">Επιλύθηκαν</SelectItem>
            <SelectItem value="closed">Κλειστά</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Προτεραιότητα" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Όλες</SelectItem>
            <SelectItem value="critical">Κρίσιμες</SelectItem>
            <SelectItem value="high">Υψηλές</SelectItem>
            <SelectItem value="medium">Μεσαίες</SelectItem>
            <SelectItem value="low">Χαμηλές</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Problems Table */}
      <Card>
        <CardHeader>
          <CardTitle>Όλα τα Προβλήματα ({filteredProblems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Πρόβλημα</TableHead>
                <TableHead>Κατάσταση</TableHead>
                <TableHead>Προτεραιότητα</TableHead>
                <TableHead>Τοποθεσία</TableHead>
                <TableHead>Αναφέρθηκε από</TableHead>
                <TableHead>Ημερομηνία</TableHead>
                <TableHead>Ενέργειες</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProblems.map((problem) => (
                <TableRow key={problem.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{problem.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{problem.description}</div>
                      <div className="flex items-center mt-1">
                        {getCategoryBadge(problem.category)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(problem.status)}</TableCell>
                  <TableCell>{getPriorityBadge(problem.priority)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm">{problem.location || 'Δεν καθορίστηκε'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium">{problem.reported_by || 'Ανώνυμος'}</div>
                      {problem.contact_phone && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Phone className="h-3 w-3 mr-1" />
                          {problem.contact_phone}
                        </div>
                      )}
                      {problem.contact_email && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Mail className="h-3 w-3 mr-1" />
                          {problem.contact_email}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(problem.created_at).toLocaleDateString('el-GR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditProblem(problem)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProblem(problem.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingProblem} onOpenChange={(open) => !open && setEditingProblem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Επεξεργασία Προβλήματος</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Τίτλος Προβλήματος</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Περιγραφή</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="edit-location">Τοποθεσία</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-priority">Προτεραιότητα</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Χαμηλή</SelectItem>
                    <SelectItem value="medium">Μεσαία</SelectItem>
                    <SelectItem value="high">Υψηλή</SelectItem>
                    <SelectItem value="critical">Κρίσιμη</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-status">Κατάσταση</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reported">Αναφέρθηκε</SelectItem>
                    <SelectItem value="investigating">Ερευνάται</SelectItem>
                    <SelectItem value="in_progress">Σε Εξέλιξη</SelectItem>
                    <SelectItem value="resolved">Επιλύθηκε</SelectItem>
                    <SelectItem value="closed">Κλειστό</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-reported_by">Αναφέρθηκε από</Label>
              <Input
                id="edit-reported_by"
                value={formData.reported_by}
                onChange={(e) => setFormData({ ...formData, reported_by: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-contact_phone">Τηλέφωνο</Label>
                <Input
                  id="edit-contact_phone"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-contact_email">Email</Label>
                <Input
                  id="edit-contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingProblem(null)}>
                Ακύρωση
              </Button>
              <Button onClick={handleUpdateProblem}>
                Αποθήκευση
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
