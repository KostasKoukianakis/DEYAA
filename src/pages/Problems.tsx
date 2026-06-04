import { useMemo, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Calendar, AlertCircle, Search, Filter } from 'lucide-react';
import { useProblems } from '@/hooks/useProblems';

const STATUS_LABELS: Record<string, string> = {
  reported: 'Αναφέρθηκε',
  investigating: 'Ερευνάται',
  in_progress: 'Σε Εξέλιξη',
  resolved: 'Επιλύθηκε',
  closed: 'Κλειστό',
};

const PRIORITY_LABELS: Record<string, string> = {
  low: 'Χαμηλή',
  medium: 'Μεσαία',
  high: 'Υψηλή',
  critical: 'Κρίσιμη',
};

const CATEGORY_LABELS: Record<string, string> = {
  maintenance: 'Συντήρηση',
  meter: 'Μετρητής',
  billing: 'Χρέωση',
};

export default function Problems() {
  const { data: problems = [], isLoading } = useProblems();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

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
  }, [problems, searchTerm, statusFilter, priorityFilter]);

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      reported: 'bg-blue-100 text-blue-800',
      investigating: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-orange-100 text-orange-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
        {STATUS_LABELS[status] || status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
      critical: 'bg-red-200 text-red-900',
    };
    return (
      <Badge className={colors[priority] || 'bg-gray-100 text-gray-800'}>
        {PRIORITY_LABELS[priority] || priority}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Φόρτωση προβλημάτων...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHero
        title="Αναφερθέντα Προβλήματα"
        description="Παρακολούθηση και ενημέρωση για προβλήματα ύδρευσης και αποχέτευσης"
        breadcrumbs={[{ label: 'Αρχική', href: '/' }, { label: 'Προβλήματα' }]}
      />
      <div className="container page-section">
        <div className="max-w-7xl mx-auto">

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Αναζήτηση..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Κατάσταση" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Όλες οι Καταστάσεις</SelectItem>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Προτεραιότητα" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Όλες οι Προτεραιότητες</SelectItem>
                    {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Problems List */}
          {filteredProblems.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                    ? 'Δεν βρέθηκαν προβλήματα με τα επιλεγμένα κριτήρια'
                    : 'Δεν υπάρχουν αναφερθέντα προβλήματα'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProblems.map((problem: any) => (
                <Card key={problem.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{problem.title}</CardTitle>
                      {getStatusBadge(problem.status)}
                    </div>
                    <div className="flex gap-2 mt-2">
                      {getPriorityBadge(problem.priority)}
                      <Badge variant="outline">
                        {CATEGORY_LABELS[problem.category] || problem.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {problem.description}
                    </p>
                    {problem.location && (
                      <div className="flex items-start text-sm text-gray-500 mb-2">
                        <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                        <span>{problem.location}</span>
                      </div>
                    )}
                    <div className="flex items-center text-xs text-gray-400 mt-4 pt-4 border-t">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>
                        {new Date(problem.created_at).toLocaleDateString('el-GR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
