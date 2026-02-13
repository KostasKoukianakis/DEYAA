import { useMemo, useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateProblem, useDeleteProblem, useProblems, useUpdateProblem } from '@/hooks/useProblems';

export default function ProblemsManagement() {
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: problems = [], isLoading, error } = useProblems();
  const createProblem = useCreateProblem();
  const updateProblem = useUpdateProblem();
  const deleteProblem = useDeleteProblem();

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

  const filteredProblems = useMemo(() => {
    return problems.filter((problem: any) => {
      const matchesSearch =
        (problem.title ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (problem.description ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (problem.location ?? '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || problem.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || problem.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [problems, priorityFilter, searchTerm, statusFilter]);

  const resetForm = () => {
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

  const handleCreateProblem = async () => {
    try {
      const descriptionWithReporter =
        formData.reported_by?.trim()
          ? `Αναφέρθηκε από: ${formData.reported_by.trim()}\n\n${formData.description}`
          : formData.description;

      await createProblem.mutateAsync({
        title: formData.title,
        description: descriptionWithReporter,
        location: formData.location || null,
        status: formData.status,
        priority: formData.priority,
        category: formData.category,
        reported_by: null,
        contact_phone: formData.contact_phone || null,
        contact_email: formData.contact_email || null,
        author_id: user?.id ?? null,
        estimated_resolution: null,
      } as any);

      toast({ title: 'Καταγράφηκε', description: 'Το πρόβλημα δημιουργήθηκε επιτυχώς.' });
      resetForm();
      setIsCreateDialogOpen(false);
    } catch (e: any) {
      toast({
        title: 'Σφάλμα',
        description: e?.message ?? 'Αποτυχία δημιουργίας προβλήματος.',
        variant: 'destructive',
      });
    }
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

  const handleUpdateProblem = async () => {
    if (!editingProblem?.id) return;
    try {
      await updateProblem.mutateAsync({
        id: editingProblem.id,
        updates: {
          title: formData.title,
          description: formData.description,
          location: formData.location || null,
          status: formData.status,
          priority: formData.priority,
          category: formData.category,
          contact_phone: formData.contact_phone || null,
          contact_email: formData.contact_email || null,
          resolved_at:
            formData.status === 'resolved' && !editingProblem.resolved_at
              ? new Date().toISOString()
              : editingProblem.resolved_at,
        },
      });

      toast({ title: 'Αποθηκεύτηκε', description: 'Το πρόβλημα ενημερώθηκε επιτυχώς.' });
      setEditingProblem(null);
      resetForm();
    } catch (e: any) {
      toast({
        title: 'Σφάλμα',
        description: e?.message ?? 'Αποτυχία ενημέρωσης προβλήματος.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProblem = async (problemId) => {
    try {
      await deleteProblem.mutateAsync(problemId);
      toast({ title: 'Διαγράφηκε', description: 'Το πρόβλημα διαγράφηκε.' });
    } catch (e: any) {
      toast({
        title: 'Σφάλμα',
        description: e?.message ?? 'Αποτυχία διαγραφής προβλήματος.',
        variant: 'destructive',
      });
    }
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
          {isLoading && <div className="text-sm text-muted-foreground">Φόρτωση...</div>}
          {error && (
            <div className="text-sm text-red-600">
              Σφάλμα φόρτωσης: {(error as any)?.message ?? 'Άγνωστο σφάλμα'}
            </div>
          )}
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
                      <div className="text-sm font-medium">{problem.contact_email || problem.contact_phone || 'Ανώνυμος'}</div>
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
