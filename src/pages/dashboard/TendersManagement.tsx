import { useState } from 'react';
import { Plus, Edit, Trash2, Search, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTenders, useCreateTender, useUpdateTender, useDeleteTender } from '@/hooks/useTenders';
import { uploadFile, getPublicUrl, deleteFile, generateFilePath, STORAGE_BUCKETS } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';

export default function TendersManagement() {
  const { data: tenders = [], isLoading } = useTenders();
  const createTender = useCreateTender();
  const updateTender = useUpdateTender();
  const deleteTender = useDeleteTender();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTender, setEditingTender] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    deadline: '',
    budget: '',
    status: 'current' as 'current' | 'past' | 'cancelled',
    announcement_pdf: null as File | null,
    tender_documents: null as File | null,
  });

  const filteredTenders = tenders.filter(tender =>
    tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tender.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTender = async () => {
    try {
      let announcementPdfPath = null;
      let tenderDocumentsPath = null;

      // Upload files if provided
      if (formData.announcement_pdf) {
        const path = generateFilePath('announcements', formData.announcement_pdf.name);
        const { path: uploadedPath, error } = await uploadFile(
          STORAGE_BUCKETS.TENDERS,
          formData.announcement_pdf,
          path
        );
        if (error) throw error;
        announcementPdfPath = uploadedPath;
      }

      if (formData.tender_documents) {
        const path = generateFilePath('documents', formData.tender_documents.name);
        const { path: uploadedPath, error } = await uploadFile(
          STORAGE_BUCKETS.TENDERS,
          formData.tender_documents,
          path
        );
        if (error) throw error;
        tenderDocumentsPath = uploadedPath;
      }

      await createTender.mutateAsync({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        deadline: formData.deadline,
        budget: formData.budget || null,
        status: formData.status,
        announcement_pdf_path: announcementPdfPath,
        tender_documents_path: tenderDocumentsPath,
      });

      toast({
        title: 'Επιτυχία',
        description: 'Ο διαγωνισμός δημιουργήθηκε επιτυχώς',
      });

      setFormData({
        title: '',
        description: '',
        date: '',
        deadline: '',
        budget: '',
        status: 'current',
        announcement_pdf: null,
        tender_documents: null,
      });
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Σφάλμα',
        description: error.message || 'Προέκυψε σφάλμα κατά τη δημιουργία',
        variant: 'destructive',
      });
    }
  };

  const handleEditTender = (tender: any) => {
    setEditingTender(tender);
    setFormData({
      title: tender.title,
      description: tender.description,
      date: tender.date,
      deadline: tender.deadline,
      budget: tender.budget || '',
      status: tender.status,
      announcement_pdf: null,
      tender_documents: null,
    });
  };

  const handleUpdateTender = async () => {
    try {
      let announcementPdfPath = editingTender.announcement_pdf_path;
      let tenderDocumentsPath = editingTender.tender_documents_path;

      // Upload new files if provided
      if (formData.announcement_pdf) {
        // Delete old file if exists
        if (announcementPdfPath) {
          await deleteFile(STORAGE_BUCKETS.TENDERS, announcementPdfPath);
        }
        const path = generateFilePath('announcements', formData.announcement_pdf.name);
        const { path: uploadedPath, error } = await uploadFile(
          STORAGE_BUCKETS.TENDERS,
          formData.announcement_pdf,
          path
        );
        if (error) throw error;
        announcementPdfPath = uploadedPath;
      }

      if (formData.tender_documents) {
        if (tenderDocumentsPath) {
          await deleteFile(STORAGE_BUCKETS.TENDERS, tenderDocumentsPath);
        }
        const path = generateFilePath('documents', formData.tender_documents.name);
        const { path: uploadedPath, error } = await uploadFile(
          STORAGE_BUCKETS.TENDERS,
          formData.tender_documents,
          path
        );
        if (error) throw error;
        tenderDocumentsPath = uploadedPath;
      }

      await updateTender.mutateAsync({
        id: editingTender.id,
        updates: {
          title: formData.title,
          description: formData.description,
          date: formData.date,
          deadline: formData.deadline,
          budget: formData.budget || null,
          status: formData.status,
          announcement_pdf_path: announcementPdfPath,
          tender_documents_path: tenderDocumentsPath,
        },
      });

      toast({
        title: 'Επιτυχία',
        description: 'Ο διαγωνισμός ενημερώθηκε επιτυχώς',
      });

      setEditingTender(null);
      setFormData({
        title: '',
        description: '',
        date: '',
        deadline: '',
        budget: '',
        status: 'current',
        announcement_pdf: null,
        tender_documents: null,
      });
    } catch (error: any) {
      toast({
        title: 'Σφάλμα',
        description: error.message || 'Προέκυψε σφάλμα κατά την ενημέρωση',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTender = async (id: string) => {
    if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτόν τον διαγωνισμό;')) return;

    try {
      const tender = tenders.find(t => t.id === id);
      if (tender?.announcement_pdf_path) {
        await deleteFile(STORAGE_BUCKETS.TENDERS, tender.announcement_pdf_path);
      }
      if (tender?.tender_documents_path) {
        await deleteFile(STORAGE_BUCKETS.TENDERS, tender.tender_documents_path);
      }

      await deleteTender.mutateAsync(id);
      toast({
        title: 'Επιτυχία',
        description: 'Ο διαγωνισμός διαγράφηκε επιτυχώς',
      });
    } catch (error: any) {
      toast({
        title: 'Σφάλμα',
        description: error.message || 'Προέκυψε σφάλμα κατά τη διαγραφή',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'current':
        return <Badge className="bg-green-100 text-green-800">Τρέχων</Badge>;
      case 'past':
        return <Badge variant="secondary">Παλαιότερος</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Ακυρωμένος</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return <div>Φόρτωση...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Διαχείριση Διαγωνισμών</h1>
          <p className="text-gray-600">Δημιουργήστε και διαχειριστείτε τους διαγωνισμούς</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Νέος Διαγωνισμός
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Δημιουργία Νέου Διαγωνισμού</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Τίτλος *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="π.χ. Προμήθεια υλικών ύδρευσης 2024"
                />
              </div>
              <div>
                <Label htmlFor="description">Περιγραφή *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Περιγραφή του διαγωνισμού..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Ημερομηνία Δημοσίευσης *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Ημερομηνία Λήξης *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="budget">Προϋπολογισμός</Label>
                <Input
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="π.χ. 150.000€"
                />
              </div>
              <div>
                <Label htmlFor="status">Κατάσταση</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Τρέχων</SelectItem>
                    <SelectItem value="past">Παλαιότερος</SelectItem>
                    <SelectItem value="cancelled">Ακυρωμένος</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="announcement_pdf">Διακήρυξη (PDF)</Label>
                <Input
                  id="announcement_pdf"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFormData({ ...formData, announcement_pdf: e.target.files?.[0] || null })}
                />
              </div>
              <div>
                <Label htmlFor="tender_documents">Τεύχη Δημοπράτησης</Label>
                <Input
                  id="tender_documents"
                  type="file"
                  accept=".pdf,.zip"
                  onChange={(e) => setFormData({ ...formData, tender_documents: e.target.files?.[0] || null })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Ακύρωση
                </Button>
                <Button onClick={handleCreateTender} disabled={createTender.isPending}>
                  {createTender.isPending ? 'Αποθήκευση...' : 'Δημιουργία'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Αναζήτηση διαγωνισμών..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Διαγωνισμοί ({filteredTenders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Τίτλος</TableHead>
                <TableHead>Ημερομηνία</TableHead>
                <TableHead>Λήξη</TableHead>
                <TableHead>Προϋπολογισμός</TableHead>
                <TableHead>Κατάσταση</TableHead>
                <TableHead>Αρχεία</TableHead>
                <TableHead className="text-right">Ενέργειες</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenders.map((tender) => (
                <TableRow key={tender.id}>
                  <TableCell className="font-medium">{tender.title}</TableCell>
                  <TableCell>{format(new Date(tender.date), 'dd/MM/yyyy', { locale: el })}</TableCell>
                  <TableCell>{format(new Date(tender.deadline), 'dd/MM/yyyy', { locale: el })}</TableCell>
                  <TableCell>{tender.budget || '-'}</TableCell>
                  <TableCell>{getStatusBadge(tender.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {tender.announcement_pdf_path && (
                        <a
                          href={getPublicUrl(STORAGE_BUCKETS.TENDERS, tender.announcement_pdf_path)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          <FileText className="h-4 w-4" />
                        </a>
                      )}
                      {tender.tender_documents_path && (
                        <a
                          href={getPublicUrl(STORAGE_BUCKETS.TENDERS, tender.tender_documents_path)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTender(tender)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTender(tender.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
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
      {editingTender && (
        <Dialog open={!!editingTender} onOpenChange={() => setEditingTender(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Επεξεργασία Διαγωνισμού</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Τίτλος *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Περιγραφή *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-date">Ημερομηνία Δημοσίευσης *</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-deadline">Ημερομηνία Λήξης *</Label>
                  <Input
                    id="edit-deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-budget">Προϋπολογισμός</Label>
                <Input
                  id="edit-budget"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Κατάσταση</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Τρέχων</SelectItem>
                    <SelectItem value="past">Παλαιότερος</SelectItem>
                    <SelectItem value="cancelled">Ακυρωμένος</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-announcement_pdf">Νέα Διακήρυξη (PDF) - Αφήστε κενό για να διατηρήσετε το υπάρχον</Label>
                <Input
                  id="edit-announcement_pdf"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFormData({ ...formData, announcement_pdf: e.target.files?.[0] || null })}
                />
              </div>
              <div>
                <Label htmlFor="edit-tender_documents">Νέα Τεύχη Δημοπράτησης - Αφήστε κενό για να διατηρήσετε το υπάρχον</Label>
                <Input
                  id="edit-tender_documents"
                  type="file"
                  accept=".pdf,.zip"
                  onChange={(e) => setFormData({ ...formData, tender_documents: e.target.files?.[0] || null })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingTender(null)}>
                  Ακύρωση
                </Button>
                <Button onClick={handleUpdateTender} disabled={updateTender.isPending}>
                  {updateTender.isPending ? 'Αποθήκευση...' : 'Αποθήκευση'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
