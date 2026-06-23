import { useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/dashboard/RichTextEditor';
import { FeaturedImageField } from '@/components/dashboard/FeaturedImageField';
import { normalizeEditorHtml } from '@/lib/sanitizeHtml';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCreatePost, useDeletePost, usePosts, useUpdatePost } from '@/hooks/usePosts';
import {
  announcementCategoryOptions,
  deyaaSeedAnnouncements,
  deyaaSeedAnnouncementsExtra,
} from '@/data/deyaaSeedAnnouncements';

const allSeedAnnouncements = [...deyaaSeedAnnouncements, ...deyaaSeedAnnouncementsExtra];

const defaultFormData = {
  title: '',
  content: '',
  excerpt: '',
  category: 'Ανακοινώσεις',
  status: 'draft',
  featured_image: '',
};

export default function PostsManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: posts = [], isLoading, error } = usePosts();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [editingPost, setEditingPost] = useState<(typeof posts)[number] | null>(null);
  const [formData, setFormData] = useState(defaultFormData);

  const filteredPosts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return posts;
    return posts.filter((post) => {
      const title = post.title?.toLowerCase() || '';
      const excerpt = post.excerpt?.toLowerCase() || '';
      const content = post.content?.toLowerCase() || '';
      return title.includes(term) || excerpt.includes(term) || content.includes(term);
    });
  }, [posts, searchTerm]);

  const handleCreatePost = async () => {
    try {
      const now = new Date().toISOString();
      await createPost.mutateAsync({
        title: formData.title,
        content: normalizeEditorHtml(formData.content),
        excerpt: formData.excerpt || null,
        category: formData.category,
        status: formData.status,
        author_id: user?.id ?? null,
        published_at: formData.status === 'published' ? now : null,
        featured_image: formData.featured_image || null,
      });
      toast({ title: 'Επιτυχία', description: 'Η ανακοίνωση αποθηκεύτηκε.' });
      setFormData(defaultFormData);
      setIsCreateDialogOpen(false);
    } catch (e: any) {
      toast({
        title: 'Σφάλμα',
        description: e?.message || 'Δεν ήταν δυνατή η αποθήκευση της ανακοίνωσης.',
        variant: 'destructive',
      });
    }
  };

  const handleSeedAnnouncements = async () => {
    if (!user) {
      toast({
        title: 'Σφάλμα',
        description: 'Πρέπει να είστε συνδεδεμένοι στο dashboard.',
        variant: 'destructive',
      });
      return;
    }

    setIsSeeding(true);
    let created = 0;
    let skipped = 0;

    try {
      for (const item of allSeedAnnouncements) {
        const exists = posts.some((post) => post.title === item.title);
        if (exists) {
          skipped += 1;
          continue;
        }

        await createPost.mutateAsync({
          title: item.title,
          content: item.content,
          excerpt: item.excerpt,
          category: item.category,
          status: 'published',
          author_id: user.id,
          published_at: item.published_at,
          featured_image: item.featured_image,
        });
        created += 1;
      }

      toast({
        title: 'Ολοκληρώθηκε',
        description:
          created > 0
            ? `Προστέθηκαν ${created} ανακοινώσεις στο Supabase${skipped ? ` (${skipped} υπήρχαν ήδη)` : ''}.`
            : 'Όλες οι ανακοινώσεις υπάρχουν ήδη στη βάση.',
      });
    } catch (e: any) {
      toast({
        title: 'Σφάλμα',
        description: e?.message || 'Αποτυχία εισαγωγής δοκιμαστικών ανακοινώσεων.',
        variant: 'destructive',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleEditPost = (post: (typeof posts)[number]) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content || '',
      excerpt: post.excerpt || '',
      category: post.category,
      status: post.status,
      featured_image: post.featured_image || '',
    });
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;
    try {
      const now = new Date().toISOString();
      const nextPublishedAt =
        formData.status === 'published'
          ? editingPost.published_at ?? now
          : null;

      await updatePost.mutateAsync({
        id: editingPost.id,
        updates: {
          title: formData.title,
          content: normalizeEditorHtml(formData.content),
          excerpt: formData.excerpt || null,
          category: formData.category,
          status: formData.status,
          published_at: nextPublishedAt,
          featured_image: formData.featured_image || null,
        },
      });
      toast({ title: 'Επιτυχία', description: 'Η ανακοίνωση ενημερώθηκε.' });
      setEditingPost(null);
      setFormData(defaultFormData);
    } catch (e: any) {
      toast({
        title: 'Σφάλμα',
        description: e?.message || 'Δεν ήταν δυνατή η ενημέρωση της ανακοίνωσης.',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    const ok = confirm('Θέλετε σίγουρα να διαγράψετε αυτή την ανακοίνωση;');
    if (!ok) return;
    try {
      await deletePost.mutateAsync(postId);
      toast({ title: 'Επιτυχία', description: 'Η ανακοίνωση διαγράφηκε.' });
    } catch (e: any) {
      toast({
        title: 'Σφάλμα',
        description: e?.message || 'Δεν ήταν δυνατή η διαγραφή της ανακοίνωσης.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Δημοσιευμένο</Badge>;
      case 'draft':
        return <Badge variant="secondary">Πρόχειρο</Badge>;
      case 'archived':
        return <Badge variant="outline">Αρχειοθετημένο</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => (
    <Badge variant="outline">{category}</Badge>
  );

  const categorySelect = (
    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {announcementCategoryOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Διαχείριση Ανακοινώσεων</h1>
          <p className="text-gray-600">Δημιουργήστε και διαχειριστείτε τις ανακοινώσεις της ιστοσελίδας</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleSeedAnnouncements}
            disabled={isSeeding || createPost.isPending}
          >
            <Database className="mr-2 h-4 w-4" />
            {isSeeding ? 'Εισαγωγή…' : 'Εισαγωγή ανακοινώσεων'}
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Νέα Ανακοίνωση
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Δημιουργία Νέας Ανακοίνωσης</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Τίτλος</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Εισάγετε τον τίτλο της ανακοίνωσης"
                />
              </div>
              <div>
                <Label htmlFor="excerpt">Περίληψη</Label>
                <Input
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Σύντομη περιγραφή"
                />
              </div>
              <div>
                <Label htmlFor="content">Περιεχόμενο</Label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Πλήρες κείμενο της ανακοίνωσης"
                />
              </div>
              <FeaturedImageField
                id="featured_image"
                value={formData.featured_image}
                onChange={(featured_image) => setFormData({ ...formData, featured_image })}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Κατηγορία</Label>
                  {categorySelect}
                </div>
                <div>
                  <Label htmlFor="status">Κατάσταση</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Πρόχειρο</SelectItem>
                      <SelectItem value="published">Δημοσιευμένο</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Ακύρωση
                </Button>
                <Button onClick={handleCreatePost}>
                  Δημιουργία
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Αναζήτηση ανακοινώσεων..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Όλες οι Ανακοινώσεις</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-sm text-red-600 mb-4">
              Σφάλμα φόρτωσης: {String((error as any)?.message || error)}
            </div>
          )}
          {isLoading ? (
            <div className="py-10 text-center text-muted-foreground">Φόρτωση...</div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Τίτλος</TableHead>
                <TableHead>Κατάσταση</TableHead>
                <TableHead>Κατηγορία</TableHead>
                <TableHead>Ημερομηνία Δημιουργίας</TableHead>
                <TableHead>Ενέργειες</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{post.title}</div>
                      {post.excerpt && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">{post.excerpt}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(post.status)}</TableCell>
                  <TableCell>{getCategoryBadge(post.category)}</TableCell>
                  <TableCell>{new Date(post.created_at).toLocaleDateString('el-GR')}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {post.status === "published" ? (
                        <Button variant="ghost" size="sm" asChild>
                          <a
                            href={`/announcements/${post.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Προεπισκόπηση"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" disabled aria-label="Προεπισκόπηση">
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPost(post)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
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
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Επεξεργασία Ανακοίνωσης</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Τίτλος</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-excerpt">Περίληψη</Label>
              <Input
                id="edit-excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-content">Περιεχόμενο</Label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
              />
            </div>
            <FeaturedImageField
              id="edit-featured_image"
              value={formData.featured_image}
              onChange={(featured_image) => setFormData({ ...formData, featured_image })}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category">Κατηγορία</Label>
                {categorySelect}
              </div>
              <div>
                <Label htmlFor="edit-status">Κατάσταση</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Πρόχειρο</SelectItem>
                    <SelectItem value="published">Δημοσιευμένο</SelectItem>
                    <SelectItem value="archived">Αρχειοθετημένο</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingPost(null)}>
                Ακύρωση
              </Button>
              <Button onClick={handleUpdatePost}>
                Αποθήκευση
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
