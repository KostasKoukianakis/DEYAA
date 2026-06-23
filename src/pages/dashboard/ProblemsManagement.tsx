import { useMemo, useState } from 'react';
import { Plus, Search, MapPin, Phone, Mail, Calendar, Hash, CheckCircle2, FileText, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateProblem, useProblems, useUpdateProblem } from '@/hooks/useProblems';
import { useActiveSubscribers } from '@/hooks/useSubscribers';
import { notifySubscribers, formatProblemReportEmail } from '@/lib/email';
import { MapPicker } from '@/components/MapPicker';
import type { Tables } from '@/integrations/supabase/types';
import { cn } from '@/lib/utils';

type Problem = Tables<'problems'>;

const EMPTY_FORM = {
  title: '',
  description: '',
  location: '',
  latitude: null as number | null,
  longitude: null as number | null,
  priority: 'medium',
  category: 'maintenance',
  status: 'reported',
  contact_phone: '',
  contact_email: '',
  reported_by: '',
};

function getStatusBadge(status: string) {
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
}

function getPriorityBadge(priority: string) {
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
}

function getCategoryBadge(category: string) {
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
}

function formatDateTime(value: string) {
  const date = new Date(value);
  return {
    date: date.toLocaleDateString('el-GR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    time: date.toLocaleTimeString('el-GR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}

function isFromPublicUser(problem: Problem) {
  return !problem.reported_by;
}

function isResolvedStatus(status: string) {
  return status === 'resolved' || status === 'closed';
}

function ProblemDetailDialog({
  problem,
  open,
  onOpenChange,
  onMarkResolved,
  isResolving,
}: {
  problem: Problem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkResolved: (problem: Problem) => Promise<void>;
  isResolving: boolean;
}) {
  if (!problem) return null;

  const created = formatDateTime(problem.created_at);
  const updated = formatDateTime(problem.updated_at);
  const resolved = problem.resolved_at ? formatDateTime(problem.resolved_at) : null;
  const isResolved = isResolvedStatus(problem.status);
  const mapsUrl =
    problem.latitude != null && problem.longitude != null
      ? `https://www.google.com/maps?q=${problem.latitude},${problem.longitude}`
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dashboard-problem-detail sm:max-w-3xl max-h-[92vh] overflow-hidden p-0 gap-0">
        <div className="dashboard-problem-detail__hero">
          <div className="dashboard-problem-detail__hero-top">
            <div className="dashboard-problem-detail__protocol-chip">
              <Hash className="dashboard-problem-detail__protocol-icon" aria-hidden />
              <span>Πρωτόκολλο</span>
              <strong>#{problem.id.slice(0, 8).toUpperCase()}</strong>
            </div>
            <div className="dashboard-problem-detail__hero-status">{getStatusBadge(problem.status)}</div>
          </div>

          <DialogHeader className="dashboard-problem-detail__header">
            <DialogTitle className="dashboard-problem-detail__title">{problem.title}</DialogTitle>
            <DialogDescription className="dashboard-problem-detail__subtitle">
              Υποβλήθηκε {created.date} στις {created.time}
            </DialogDescription>
          </DialogHeader>

          <div className="dashboard-problem-detail__meta-row">
            {getPriorityBadge(problem.priority)}
            {getCategoryBadge(problem.category)}
            {isFromPublicUser(problem) ? (
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <User className="h-3 w-3 mr-1" aria-hidden />
                Από χρήστη
              </Badge>
            ) : (
              <Badge variant="outline">Από admin</Badge>
            )}
          </div>
        </div>

        <div className="dashboard-problem-detail__body">
          <section className="dashboard-problem-detail__panel dashboard-problem-detail__panel--primary">
            <div className="dashboard-problem-detail__panel-head">
              <FileText className="dashboard-problem-detail__panel-icon" aria-hidden />
              <h3 className="dashboard-problem-detail__panel-title">Περιγραφή προβλήματος</h3>
            </div>
            <p className="dashboard-problem-detail__description">{problem.description}</p>
          </section>

          <div className="dashboard-problem-detail__grid">
            <section className="dashboard-problem-detail__panel">
              <div className="dashboard-problem-detail__panel-head">
                <MapPin className="dashboard-problem-detail__panel-icon" aria-hidden />
                <h3 className="dashboard-problem-detail__panel-title">Τοποθεσία</h3>
              </div>
              <p className="dashboard-problem-detail__value">
                {problem.location || 'Δεν καθορίστηκε τοποθεσία'}
              </p>
              {problem.latitude != null && problem.longitude != null ? (
                <p className="dashboard-problem-detail__hint">
                  Συντεταγμένες: {problem.latitude.toFixed(6)}, {problem.longitude.toFixed(6)}
                </p>
              ) : null}
              {mapsUrl ? (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dashboard-problem-detail__link"
                >
                  Άνοιγμα στο Google Maps
                </a>
              ) : null}
            </section>

            <section className="dashboard-problem-detail__panel">
              <div className="dashboard-problem-detail__panel-head">
                <Phone className="dashboard-problem-detail__panel-icon" aria-hidden />
                <h3 className="dashboard-problem-detail__panel-title">Επικοινωνία</h3>
              </div>
              <dl className="dashboard-problem-detail__fields">
                <div className="dashboard-problem-detail__field">
                  <dt>
                    <Phone className="dashboard-problem-detail__field-icon" aria-hidden />
                    Τηλέφωνο
                  </dt>
                  <dd>
                    {problem.contact_phone ? (
                      <a href={`tel:${problem.contact_phone}`}>{problem.contact_phone}</a>
                    ) : (
                      '—'
                    )}
                  </dd>
                </div>
                <div className="dashboard-problem-detail__field">
                  <dt>
                    <Mail className="dashboard-problem-detail__field-icon" aria-hidden />
                    Email
                  </dt>
                  <dd>
                    {problem.contact_email ? (
                      <a href={`mailto:${problem.contact_email}`}>{problem.contact_email}</a>
                    ) : (
                      '—'
                    )}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="dashboard-problem-detail__panel dashboard-problem-detail__panel--wide">
              <div className="dashboard-problem-detail__panel-head">
                <Clock className="dashboard-problem-detail__panel-icon" aria-hidden />
                <h3 className="dashboard-problem-detail__panel-title">Χρονολόγιο</h3>
              </div>
              <dl className="dashboard-problem-detail__timeline">
                <div className="dashboard-problem-detail__timeline-item">
                  <dt>Υποβολή</dt>
                  <dd>
                    {created.date} · {created.time}
                  </dd>
                </div>
                <div className="dashboard-problem-detail__timeline-item">
                  <dt>Τελευταία ενημέρωση</dt>
                  <dd>
                    {updated.date} · {updated.time}
                  </dd>
                </div>
                {resolved ? (
                  <div className="dashboard-problem-detail__timeline-item dashboard-problem-detail__timeline-item--resolved">
                    <dt>Επίλυση</dt>
                    <dd>
                      {resolved.date} · {resolved.time}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </section>
          </div>
        </div>

        <DialogFooter className="dashboard-problem-detail__footer">
          {isResolved ? (
            <div className="dashboard-problem-detail__resolved-banner" role="status">
              <CheckCircle2 className="dashboard-problem-detail__resolved-icon" aria-hidden />
              <div>
                <p className="dashboard-problem-detail__resolved-title">Το πρόβλημα έχει επισημανθεί ως επιλυμένο</p>
                {resolved ? (
                  <p className="dashboard-problem-detail__resolved-date">
                    {resolved.date} · {resolved.time}
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
            <Button
              type="button"
              className="dashboard-problem-detail__resolve-btn"
              disabled={isResolving}
              onClick={() => onMarkResolved(problem)}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" aria-hidden />
              {isResolving ? 'Αποθήκευση…' : 'Σήμανση ως επιλυμένο'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ProblemsManagement() {
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: problems = [], isLoading, error } = useProblems();
  const createProblem = useCreateProblem();
  const updateProblem = useUpdateProblem();
  const { data: activeSubscribers = [] } = useActiveSubscribers();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewingProblem, setViewingProblem] = useState<Problem | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
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
    setFormData(EMPTY_FORM);
  };

  const handleMarkResolved = async (problem: Problem) => {
    if (isResolvedStatus(problem.status)) return;

    try {
      const updated = await updateProblem.mutateAsync({
        id: problem.id,
        updates: {
          status: 'resolved',
          resolved_at: new Date().toISOString(),
        },
      });

      setViewingProblem(updated);
      toast({
        title: 'Επιλύθηκε',
        description: 'Η αναφορά σημειώθηκε ως επιλυμένη.',
      });
    } catch (err) {
      toast({
        title: 'Σφάλμα',
        description: err instanceof Error ? err.message : 'Αποτυχία ενημέρωσης κατάστασης.',
        variant: 'destructive',
      });
    }
  };

  const handleCreateProblem = async () => {
    try {
      const descriptionWithReporter =
        formData.reported_by?.trim()
          ? `Αναφέρθηκε από: ${formData.reported_by.trim()}\n\n${formData.description}`
          : formData.description;

      const createdProblem = await createProblem.mutateAsync({
        title: formData.title,
        description: descriptionWithReporter,
        location: formData.location || null,
        latitude: formData.latitude,
        longitude: formData.longitude,
        status: formData.status,
        priority: formData.priority,
        category: formData.category,
        reported_by: user?.id ?? null,
        assigned_to: null,
        contact_phone: formData.contact_phone || null,
        contact_email: formData.contact_email || null,
        images: [],
        estimated_resolution: null,
      });

      const subscribersForProblems = activeSubscribers.filter((sub: { preferences?: { problems?: boolean } }) => {
        const prefs = sub.preferences || {};
        return prefs.problems !== false;
      });

      if (subscribersForProblems.length > 0) {
        try {
          const emailContent = formatProblemReportEmail({
            title: formData.title,
            description: descriptionWithReporter,
            location: formData.location || null,
            priority: formData.priority,
            category: formData.category,
            id: createdProblem.id,
          });

          const subscriberEmails = subscribersForProblems.map((s: { email: string }) => s.email);
          const result = await notifySubscribers(
            `Νέα Αναφορά Προβλήματος: ${formData.title}`,
            emailContent,
            subscriberEmails,
          );

          toast({
            title: 'Καταγράφηκε',
            description: `Το πρόβλημα δημιουργήθηκε. Στάλθηκαν emails σε ${result.sent} subscribers.`,
          });
        } catch {
          toast({
            title: 'Προειδοποίηση',
            description: 'Το πρόβλημα καταγράφηκε αλλά η αποστολή emails απέτυχε.',
            variant: 'destructive',
          });
        }
      } else {
        toast({ title: 'Καταγράφηκε', description: 'Το πρόβλημα δημιουργήθηκε επιτυχώς.' });
      }

      resetForm();
      setIsCreateDialogOpen(false);
    } catch (e: unknown) {
      toast({
        title: 'Σφάλμα',
        description: e instanceof Error ? e.message : 'Αποτυχία δημιουργίας προβλήματος.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Διαχείριση Προβλημάτων</h1>
          <p className="text-gray-600">Πατήστε μια αναφορά για να δείτε όλες τις λεπτομέρειες</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Νέο Πρόβλημα
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                <MapPicker
                  location={formData.location}
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  onLocationChange={(location, lat, lng) => {
                    setFormData({ ...formData, location, latitude: lat, longitude: lng });
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Προτεραιότητα</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
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
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
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
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
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
                <Button onClick={handleCreateProblem}>Καταγραφή</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4 flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
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

      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle>Όλα τα Προβλήματα ({filteredProblems.length})</CardTitle>
            <p className="text-sm text-muted-foreground w-full sm:w-auto">
              Χρησιμοποιήστε το κουμπί «Προβολή» για λεπτομέρειες και σήμανση επίλυσης.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded" />
                <span className="text-gray-600">Από χρήστη</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border border-gray-300 rounded" />
                <span className="text-gray-600">Από admin</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading && <div className="text-sm text-muted-foreground p-6">Φόρτωση...</div>}
          {error && (
            <div className="text-sm text-red-600 p-6">
              Σφάλμα φόρτωσης: {error instanceof Error ? error.message : 'Άγνωστο σφάλμα'}
            </div>
          )}
          {!isLoading && !error && filteredProblems.length === 0 ? (
            <div className="text-sm text-muted-foreground p-6">Δεν βρέθηκαν αναφορές.</div>
          ) : null}
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[28%]">Πρόβλημα</TableHead>
                <TableHead className="w-[10%]">Πηγή</TableHead>
                <TableHead className="w-[12%]">Κατάσταση</TableHead>
                <TableHead className="w-[12%]">Προτεραιότητα</TableHead>
                <TableHead className="w-[20%]">Τοποθεσία</TableHead>
                <TableHead className="w-[12%]">Ημερομηνία</TableHead>
                <TableHead className="w-[10%] text-right">Ενέργειες</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProblems.map((problem) => {
                const fromUser = isFromPublicUser(problem);
                const created = formatDateTime(problem.created_at);

                return (
                  <TableRow
                    key={problem.id}
                    className={cn(fromUser && 'dashboard-problems-row--user')}
                  >
                    <TableCell className="max-w-[320px]">
                      <div className="font-medium text-gray-900">{problem.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1 mt-1">{problem.description}</div>
                      <div className="flex items-center gap-2 mt-2">
                        {getCategoryBadge(problem.category)}
                        <span className="text-xs text-gray-400">#{problem.id.slice(0, 8).toUpperCase()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {fromUser ? (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">Από χρήστη</Badge>
                      ) : (
                        <Badge variant="outline">Από admin</Badge>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(problem.status)}</TableCell>
                    <TableCell>{getPriorityBadge(problem.priority)}</TableCell>
                    <TableCell className="max-w-[240px]">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" aria-hidden />
                        <span className="text-sm line-clamp-2">
                          {problem.location || 'Δεν καθορίστηκε'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-1.5 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" aria-hidden />
                        <div>
                          <div>{created.date}</div>
                          <div className="text-gray-500">{created.time}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingProblem(problem)}
                      >
                        Προβολή
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ProblemDetailDialog
        problem={viewingProblem}
        open={!!viewingProblem}
        onOpenChange={(open) => {
          if (!open) setViewingProblem(null);
        }}
        onMarkResolved={handleMarkResolved}
        isResolving={updateProblem.isPending}
      />
    </div>
  );
}
