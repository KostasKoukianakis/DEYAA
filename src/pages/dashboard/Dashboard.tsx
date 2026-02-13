import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertTriangle, Users, Bell, TrendingUp, TrendingDown } from 'lucide-react';
import { useMemo } from 'react';
import { usePosts } from '@/hooks/usePosts';
import { useProblems } from '@/hooks/useProblems';
import { useSubscribers } from '@/hooks/useSubscribers';
import { useNotifications } from '@/hooks/useNotifications';

export default function Dashboard() {
  const { data: posts = [] } = usePosts();
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
    { title: 'Total Posts', value: String(posts.length), change: '—', changeType: 'increase' as const, icon: FileText },
    {
      title: 'Active Problems',
      value: String(activeProblemsCount),
      change: '—',
      changeType: 'decrease' as const,
      icon: AlertTriangle,
    },
    {
      title: 'Subscribers',
      value: String(activeSubscribersCount),
      change: '—',
      changeType: 'increase' as const,
      icon: Users,
    },
    {
      title: 'Notifications Sent',
      value: String(sentNotificationsCount),
      change: '—',
      changeType: 'increase' as const,
      icon: Bell,
    },
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
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.changeType === 'increase' ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span className={stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>
                <span className="ml-1">από δεδομένα Supabase</span>
              </div>
            </CardContent>
          </Card>
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
                <div key={post.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{post.title}</p>
                    <p className="text-xs text-gray-500">{post.date}</p>
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
                <div key={problem.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{problem.title}</p>
                    <p className="text-xs text-gray-500">{problem.date}</p>
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <FileText className="h-6 w-6 text-blue-500 mb-2" />
              <h3 className="font-medium text-gray-900">Νέα Ανακοίνωση</h3>
              <p className="text-sm text-gray-500">Δημιουργήστε νέα ανακοίνωση</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <AlertTriangle className="h-6 w-6 text-red-500 mb-2" />
              <h3 className="font-medium text-gray-900">Αναφορά Προβλήματος</h3>
              <p className="text-sm text-gray-500">Καταγράψτε νέο πρόβλημα</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Bell className="h-6 w-6 text-green-500 mb-2" />
              <h3 className="font-medium text-gray-900">Αποστολή Ειδοποίησης</h3>
              <p className="text-sm text-gray-500">Στείλτε email ειδοποίηση</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Users className="h-6 w-6 text-purple-500 mb-2" />
              <h3 className="font-medium text-gray-900">Διαχείριση Συνδρομητών</h3>
              <p className="text-sm text-gray-500">Δείτε τους συνδρομητές</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
