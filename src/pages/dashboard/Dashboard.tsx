import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertTriangle, Users, Bell, TrendingUp, TrendingDown } from 'lucide-react';

export default function Dashboard() {
  // Mock data - θα αντικατασταθεί με πραγματικά δεδομένα από Supabase
  const stats = [
    {
      title: 'Total Posts',
      value: '24',
      change: '+12%',
      changeType: 'increase' as const,
      icon: FileText,
    },
    {
      title: 'Active Problems',
      value: '8',
      change: '-3',
      changeType: 'decrease' as const,
      icon: AlertTriangle,
    },
    {
      title: 'Subscribers',
      value: '1,247',
      change: '+8%',
      changeType: 'increase' as const,
      icon: Users,
    },
    {
      title: 'Notifications Sent',
      value: '156',
      change: '+23%',
      changeType: 'increase' as const,
      icon: Bell,
    },
  ];

  const recentPosts = [
    { id: 1, title: 'Νέα ανακοίνωση για το νερό', status: 'published', date: '2024-12-14' },
    { id: 2, title: 'Προγραμματισμένη συντήρηση', status: 'draft', date: '2024-12-13' },
    { id: 3, title: 'Αλλαγές στα τιμολόγια', status: 'published', date: '2024-12-12' },
  ];

  const recentProblems = [
    { id: 1, title: 'Βλάβη στο δίκτυο Κέντρου', status: 'in_progress', priority: 'high', date: '2024-12-14' },
    { id: 2, title: 'Διαρροή νερού στην οδό Αθηνών', status: 'reported', priority: 'medium', date: '2024-12-13' },
    { id: 3, title: 'Πρόβλημα μετρητή', status: 'resolved', priority: 'low', date: '2024-12-12' },
  ];

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
                <span className="ml-1">from last month</span>
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
