import { useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCreatePost, useDeletePost, usePosts, useUpdatePost } from '@/hooks/usePosts';

export default function PostsManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: posts = [], isLoading, error } = usePosts();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<(typeof posts)[number] | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'announcement',
    status: 'draft',
  });

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
        content: formData.content,
        excerpt: formData.excerpt || null,
        category: formData.category,
        status: formData.status,
        author_id: user?.id ?? null,
        published_at: formData.status === 'published' ? now : null,
      });
      toast({ title: 'Επιτυχία', description: 'Η ανακοίνωση αποθηκεύτηκε.' });
      setFormData({ title: '', content: '', excerpt: '', category: 'announcement', status: 'draft' });
      setIsCreateDialogOpen(false);
    } catch (e: any) {
      toast({
        title: 'Σφάλμα',
        description: e?.message || 'Δεν ήταν δυνατή η αποθήκευση της ανακοίνωσης.',
        variant: 'destructive',
      });
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
          content: formData.content,
          excerpt: formData.excerpt || null,
          category: formData.category,
          status: formData.status,
          published_at: nextPublishedAt,
        },
      });
      toast({ title: 'Επιτυχία', description: 'Η ανακοίνωση ενημερώθηκε.' });
      setEditingPost(null);
      setFormData({ title: '', content: '', excerpt: '', category: 'announcement', status: 'draft' });
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

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'announcement':
        return <Badge variant="outline">Ανακοίνωση</Badge>;
      case 'maintenance':
        return <Badge variant="outline" className="border-orange-200 text-orange-800">Συντήρηση</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Διαχείριση Ανακοινώσεων</h1>
          <p className="text-gray-600">Δημιουργήστε και διαχειριστείτε τις ανακοινώσεις της ιστοσελίδας</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Νέα Ανακοίνωση
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
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
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Πλήρες κείμενο της ανακοίνωσης"
                  rows={6}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Κατηγορία</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="announcement">Ανακοίνωση</SelectItem>
                      <SelectItem value="maintenance">Συντήρηση</SelectItem>
                      <SelectItem value="news">Νέα</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
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
        <DialogContent className="max-w-2xl">
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
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category">Κατηγορία</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">Ανακοίνωση</SelectItem>
                    <SelectItem value="maintenance">Συντήρηση</SelectItem>
                    <SelectItem value="news">Νέα</SelectItem>
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
