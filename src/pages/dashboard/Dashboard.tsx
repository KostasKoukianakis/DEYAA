import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertTriangle, Users, Bell } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '@/hooks/usePosts';
import { useProblems } from '@/hooks/useProblems';
import { useSubscribers } from '@/hooks/useSubscribers';
import { useNotifications } from '@/hooks/useNotifications';

export default function Dashboard() {
  const navigate = useNavigate();  const { data: posts = [] } = usePosts();
  const { data: problems = [] } = useProblems();
  const { data: subscribers = [] } = useSubscribers();
  const { data: notifications = [] } = useNotifications();

  const activeProblemsCount = useMemo(() => {
    return problems.filter((p: any) => p.status !== 'resolved' && p.status !== 'closed').length;
  }, [problems]);

  const activeSubscribersCount = useMemo(() => {
    return subscribers.filter((s: any) => s.is_active).length;
  }, [subscribers]);

  const sentNotificationsCount = useMemo(() => {
    return notifications.filter((n: any) => n.status === 'sent').length;
  }, [notifications]);

  const stats = [
    { title: 'Ανακοινώσεις', value: String(posts.length), icon: FileText },
    { title: 'Ενεργά προβλήματα', value: String(activeProblemsCount), icon: AlertTriangle },
    { title: 'Συνδρομητές', value: String(activeSubscribersCount), icon: Users },
    { title: 'Αποσταλμένες ειδοποιήσεις', value: String(sentNotificationsCount), icon: Bell },
  ];
  const recentPosts = useMemo(() => {
    return posts.slice(0, 3).map((p: any) => ({
      id: p.id,
      title: p.title,
      status: p.status,
      date: (p.published_at ?? p.created_at ?? '').slice(0, 10),
    }));
  }, [posts]);

  const recentProblems = useMemo(() => {
    return problems.slice(0, 3).map((p: any) => ({
      id: p.id,
      title: p.title,
      status: p.status,
      priority: p.priority,
      date: (p.created_at ?? '').slice(0, 10),
    }));
  }, [problems]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Πρόσφατες Ανακοινώσεις</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="dashboard-shell__list-row">
                  <div className="flex-1">
                    <p className="dashboard-shell__list-title">{post.title}</p>
                    <p className="dashboard-shell__list-meta">{post.date}</p>
                  </div>
                  <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                    {post.status === 'published' ? 'Δημοσιευμένο' : 'Πρόχειρο'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Problems */}
        <Card>
          <CardHeader>
            <CardTitle>Πρόσφατα Προβλήματα</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProblems.map((problem) => (
                <div key={problem.id} className="dashboard-shell__list-row">
                  <div className="flex-1">
                    <p className="dashboard-shell__list-title">{problem.title}</p>
                    <p className="dashboard-shell__list-meta">{problem.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        problem.priority === 'high'
                          ? 'destructive'
                          : problem.priority === 'medium'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {problem.priority === 'high' ? 'Υψηλή' :
                       problem.priority === 'medium' ? 'Μεσαία' : 'Χαμηλή'}
                    </Badge>
                    <Badge variant="outline">
                      {problem.status === 'in_progress' ? 'Σε εξέλιξη' :
                       problem.status === 'reported' ? 'Αναφέρθηκε' : 'Επιλύθηκε'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Γρήγορες Ενέργειες</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="dashboard-shell__quick-grid">
            <button
              type="button"
              className="dashboard-shell__quick-action"
              onClick={() => navigate('/dashboard/posts')}
            >
              <FileText className="dashboard-shell__quick-icon dashboard-shell__quick-icon--blue" aria-hidden />
              <h3 className="dashboard-shell__quick-title">Νέα Ανακοίνωση</h3>
              <p className="dashboard-shell__quick-desc">Δημιουργήστε νέα ανακοίνωση</p>
            </button>
            <button
              type="button"
              className="dashboard-shell__quick-action"
              onClick={() => navigate('/dashboard/problems')}
            >
              <AlertTriangle className="dashboard-shell__quick-icon dashboard-shell__quick-icon--red" aria-hidden />
              <h3 className="dashboard-shell__quick-title">Προβλήματα</h3>
              <p className="dashboard-shell__quick-desc">Δείτε και διαχειριστείτε αναφορές</p>
            </button>
            <button
              type="button"
              className="dashboard-shell__quick-action"
              onClick={() => navigate('/dashboard/email-notifications')}
            >
              <Bell className="dashboard-shell__quick-icon dashboard-shell__quick-icon--green" aria-hidden />
              <h3 className="dashboard-shell__quick-title">Αποστολή Ειδοποίησης</h3>
              <p className="dashboard-shell__quick-desc">Στείλτε email ειδοποίηση</p>
            </button>
            <button
              type="button"
              className="dashboard-shell__quick-action"
              onClick={() => navigate('/dashboard/subscribers')}
            >
              <Users className="dashboard-shell__quick-icon dashboard-shell__quick-icon--violet" aria-hidden />
              <h3 className="dashboard-shell__quick-title">Διαχείριση Συνδρομητών</h3>
              <p className="dashboard-shell__quick-desc">Δείτε τους συνδρομητές</p>
            </button>
          </div>        </CardContent>
      </Card>
    </div>
  );
}
