import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDocuments, useCreateDocument, useUpdateDocument, useDeleteDocument } from '@/hooks/useDocuments';
import { uploadFile, getPublicUrl, deleteFile, generateFilePath, STORAGE_BUCKETS } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import * as Icons from 'lucide-react';

const ICON_OPTIONS = [
  'Droplets',
  'Waves',
  'FileEdit',
  'FileX',
  'Gauge',
  'DollarSign',
  'FileText',
  'FileCheck',
  'FileQuestion',
] as const;

const CATEGORIES = ['Ύδρευση', 'Αποχέτευση', 'Γενικά', 'Οικονομικά'] as const;

export default function DocumentsManagement() {
  const { data: documents = [], isLoading } = useDocuments();
  const createDocument = useCreateDocument();
  const updateDocument = useUpdateDocument();
  const deleteDocument = useDeleteDocument();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Ύδρευση' as typeof CATEGORIES[number],
    icon_name: 'FileText' as typeof ICON_OPTIONS[number],
    file: null as File | null,
    display_order: 0,
    is_active: true,
  });

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleCreateDocument = async () => {
    try {
      if (!formData.file) {
        toast({
          title: 'Σφάλμα',
          description: 'Παρακαλώ επιλέξτε αρχείο',
          variant: 'destructive',
        });
        return;
      }

      const path = generateFilePath('forms', formData.file.name);
      const { path: uploadedPath, error } = await uploadFile(
        STORAGE_BUCKETS.DOCUMENTS,
        formData.file,
        path
      );

      if (error) throw error;

      await createDocument.mutateAsync({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        icon_name: formData.icon_name,
        file_path: uploadedPath,
        file_name: formData.file.name,
        file_size: formData.file.size,
        file_type: formData.file.type,
        display_order: formData.display_order,
        is_active: formData.is_active,
      });

      toast({
        title: 'Επιτυχία',
        description: 'Το έγγραφο δημιουργήθηκε επιτυχώς',
      });

      setFormData({
        title: '',
        description: '',
        category: 'Ύδρευση',
        icon_name: 'FileText',
        file: null,
        display_order: 0,
        is_active: true,
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

  const handleEditDocument = (doc: any) => {
    setEditingDocument(doc);
    setFormData({
      title: doc.title,
      description: doc.description,
      category: doc.category,
      icon_name: doc.icon_name || 'FileText',
      file: null,
      display_order: doc.display_order || 0,
      is_active: doc.is_active,
    });
  };

  const handleUpdateDocument = async () => {
    try {
      let filePath = editingDocument.file_path;
      let fileName = editingDocument.file_name;
      let fileSize = editingDocument.file_size;
      let fileType = editingDocument.file_type;

      // Upload new file if provided
      if (formData.file) {
        // Delete old file
        await deleteFile(STORAGE_BUCKETS.DOCUMENTS, filePath);

        const path = generateFilePath('forms', formData.file.name);
        const { path: uploadedPath, error } = await uploadFile(
          STORAGE_BUCKETS.DOCUMENTS,
          formData.file,
          path
        );

        if (error) throw error;

        filePath = uploadedPath;
        fileName = formData.file.name;
        fileSize = formData.file.size;
        fileType = formData.file.type;
      }

      await updateDocument.mutateAsync({
        id: editingDocument.id,
        updates: {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          icon_name: formData.icon_name,
          file_path: filePath,
          file_name: fileName,
          file_size: fileSize,
          file_type: fileType,
          display_order: formData.display_order,
          is_active: formData.is_active,
        },
      });

      toast({
        title: 'Επιτυχία',
        description: 'Το έγγραφο ενημερώθηκε επιτυχώς',
      });

      setEditingDocument(null);
      setFormData({
        title: '',
        description: '',
        category: 'Ύδρευση',
        icon_name: 'FileText',
        file: null,
        display_order: 0,
        is_active: true,
      });
    } catch (error: any) {
      toast({
        title: 'Σφάλμα',
        description: error.message || 'Προέκυψε σφάλμα κατά την ενημέρωση',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το έγγραφο;')) return;

    try {
      const doc = documents.find(d => d.id === id);
      if (doc?.file_path) {
        await deleteFile(STORAGE_BUCKETS.DOCUMENTS, doc.file_path);
      }

      await deleteDocument.mutateAsync(id);
      toast({
        title: 'Επιτυχία',
        description: 'Το έγγραφο διαγράφηκε επιτυχώς',
      });
    } catch (error: any) {
      toast({
        title: 'Σφάλμα',
        description: error.message || 'Προέκυψε σφάλμα κατά τη διαγραφή',
        variant: 'destructive',
      });
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      'Ύδρευση': 'bg-blue-100 text-blue-800',
      'Αποχέτευση': 'bg-green-100 text-green-800',
      'Γενικά': 'bg-gray-100 text-gray-800',
      'Οικονομικά': 'bg-purple-100 text-purple-800',
    };
    return <Badge className={colors[category] || 'bg-gray-100 text-gray-800'}>{category}</Badge>;
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.FileText;
    return <IconComponent className="h-4 w-4" />;
  };

  if (isLoading) {
    return <div>Φόρτωση...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Διαχείριση Δικαιολογητικών</h1>
          <p className="text-gray-600">Δημιουργήστε και διαχειριστείτε τα δικαιολογητικά και έντυπα</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Νέο Έγγραφο
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Δημιουργία Νέου Εγγράφου</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Τίτλος *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="π.χ. Αίτηση Νέας Σύνδεσης Ύδρευσης"
                />
              </div>
              <div>
                <Label htmlFor="description">Περιγραφή *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Σύντομη περιγραφή του εγγράφου..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Κατηγορία *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="icon">Εικονίδιο</Label>
                  <Select
                    value={formData.icon_name}
                    onValueChange={(value: any) => setFormData({ ...formData, icon_name: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="file">Αρχείο (PDF) *</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="display_order">Σειρά Εμφάνισης</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center gap-2 pt-8">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="is_active">Ενεργό</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Ακύρωση
                </Button>
                <Button onClick={handleCreateDocument} disabled={createDocument.isPending}>
                  {createDocument.isPending ? 'Αποθήκευση...' : 'Δημιουργία'}
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
          placeholder="Αναζήτηση εγγράφων..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Έγγραφα ({filteredDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Εικονίδιο</TableHead>
                <TableHead>Τίτλος</TableHead>
                <TableHead>Κατηγορία</TableHead>
                <TableHead>Μέγεθος</TableHead>
                <TableHead>Λήψεις</TableHead>
                <TableHead>Κατάσταση</TableHead>
                <TableHead className="text-right">Ενέργειες</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    {getIconComponent(doc.icon_name || 'FileText')}
                  </TableCell>
                  <TableCell className="font-medium">{doc.title}</TableCell>
                  <TableCell>{getCategoryBadge(doc.category)}</TableCell>
                  <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                  <TableCell>{doc.download_count || 0}</TableCell>
                  <TableCell>
                    {doc.is_active ? (
                      <Badge className="bg-green-100 text-green-800">Ενεργό</Badge>
                    ) : (
                      <Badge variant="secondary">Ανενεργό</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <a
                        href={getPublicUrl(STORAGE_BUCKETS.DOCUMENTS, doc.file_path)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditDocument(doc)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDocument(doc.id)}
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
      {editingDocument && (
        <Dialog open={!!editingDocument} onOpenChange={() => setEditingDocument(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Επεξεργασία Εγγράφου</DialogTitle>
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
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category">Κατηγορία *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-icon">Εικονίδιο</Label>
                  <Select
                    value={formData.icon_name}
                    onValueChange={(value: any) => setFormData({ ...formData, icon_name: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-file">Νέο Αρχείο (PDF) - Αφήστε κενό για να διατηρήσετε το υπάρχον</Label>
                <Input
                  id="edit-file"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                />
                {editingDocument.file_name && (
                  <p className="text-sm text-gray-500 mt-1">Τρέχον αρχείο: {editingDocument.file_name}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-display_order">Σειρά Εμφάνισης</Label>
                  <Input
                    id="edit-display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center gap-2 pt-8">
                  <input
                    type="checkbox"
                    id="edit-is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="edit-is_active">Ενεργό</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingDocument(null)}>
                  Ακύρωση
                </Button>
                <Button onClick={handleUpdateDocument} disabled={updateDocument.isPending}>
                  {updateDocument.isPending ? 'Αποθήκευση...' : 'Αποθήκευση'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
