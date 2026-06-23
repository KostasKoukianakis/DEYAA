import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, Download, Eye, MousePointerClick } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { el } from 'date-fns/locale';

export default function Analytics() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['analytics', 'stats'],
    queryFn: async () => {
      const sevenDaysAgo = subDays(new Date(), 7).toISOString();

      // Get event counts
      const { data: events } = await supabase
        .from('analytics')
        .select('event_type, entity_type, created_at')
        .gte('created_at', sevenDaysAgo);

      // Get top posts by views
      const { data: topPosts } = await supabase
        .from('posts')
        .select('id, title, view_count')
        .order('view_count', { ascending: false })
        .limit(5);

      // Get top tenders by views
      const { data: topTenders } = await supabase
        .from('tenders')
        .select('id, title, view_count')
        .order('view_count', { ascending: false })
        .limit(5);

      // Get top documents by downloads
      const { data: topDocuments } = await supabase
        .from('documents')
        .select('id, title, download_count')
        .order('download_count', { ascending: false })
        .limit(5);

      const views = events?.filter(e => e.event_type === 'view').length || 0;
      const downloads = events?.filter(e => e.event_type === 'download').length || 0;
      const clicks = events?.filter(e => e.event_type === 'click').length || 0;

      return {
        views,
        downloads,
        clicks,
        topPosts: topPosts || [],
        topTenders: topTenders || [],
        topDocuments: topDocuments || [],
      };
    },
  });

  if (isLoading) {
    return <div>Φόρτωση...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Στατιστικά</h1>
        <p className="text-gray-600">Στατιστικά και μετρήσεις για το περιεχόμενο</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Views (7 ημέρες)</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.views || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads (7 ημέρες)</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.downloads || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clicks (7 ημέρες)</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.clicks || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Content */}
      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="posts">Top Ανακοινώσεις</TabsTrigger>
          <TabsTrigger value="tenders">Top Διαγωνισμοί</TabsTrigger>
          <TabsTrigger value="documents">Top Έγγραφα</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Ανακοινώσεις (Views)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.topPosts.map((post, index) => (
                  <div key={post.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                      <div>
                        <p className="font-medium">{post.title}</p>
                        <p className="text-sm text-gray-500">{post.view_count || 0} views</p>
                      </div>
                    </div>
                  </div>
                ))}
                {(!stats?.topPosts || stats.topPosts.length === 0) && (
                  <p className="text-center text-gray-500 py-4">Δεν υπάρχουν δεδομένα</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenders">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Διαγωνισμοί (Views)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.topTenders.map((tender, index) => (
                  <div key={tender.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                      <div>
                        <p className="font-medium">{tender.title}</p>
                        <p className="text-sm text-gray-500">{tender.view_count || 0} views</p>
                      </div>
                    </div>
                  </div>
                ))}
                {(!stats?.topTenders || stats.topTenders.length === 0) && (
                  <p className="text-center text-gray-500 py-4">Δεν υπάρχουν δεδομένα</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Έγγραφα (Downloads)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.topDocuments.map((doc, index) => (
                  <div key={doc.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-sm text-gray-500">{doc.download_count || 0} downloads</p>
                      </div>
                    </div>
                  </div>
                ))}
                {(!stats?.topDocuments || stats.topDocuments.length === 0) && (
                  <p className="text-center text-gray-500 py-4">Δεν υπάρχουν δεδομένα</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
