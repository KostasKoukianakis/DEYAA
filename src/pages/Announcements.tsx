import { useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/layout/PageHero";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePublishedPosts } from "@/hooks/usePosts";

export default function Announcements() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Όλες");

  const { data: posts = [], isLoading, error } = usePublishedPosts();

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => set.add(p.category));
    return ["Όλες", ...Array.from(set)];
  }, [posts]);

  const filteredAnnouncements = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return posts.filter((p) => {
      const matchesSearch =
        !term ||
        p.title.toLowerCase().includes(term) ||
        (p.excerpt?.toLowerCase().includes(term) ?? false) ||
        p.content.toLowerCase().includes(term);
      const matchesCategory = selectedCategory === "Όλες" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, selectedCategory]);

  return (
    <Layout>
      <PageHero
        title="Ανακοινώσεις"
        description="Νέα και ενημερώσεις από τη ΔΕΥΑΑ"
        breadcrumbs={[{ label: "Αρχική", href: "/" }, { label: "Ανακοινώσεις" }]}
      />

      <div className="container page-section">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Αναζήτηση ανακοινώσεων..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-6">
          {error && (
            <div className="text-center py-6 text-red-600">
              Σφάλμα φόρτωσης ανακοινώσεων: {String((error as any)?.message || error)}
            </div>
          )}
          {isLoading && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Φόρτωση...</p>
            </div>
          )}
          {filteredAnnouncements.map((announcement) => (
            <Card key={announcement.id} className="card-hover">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(announcement.published_at ?? announcement.created_at).toLocaleDateString("el-GR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">
                      {announcement.category}
                    </span>
                  </span>
                </div>
                <CardTitle className="text-xl">{announcement.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {announcement.content}
                </CardDescription>
              </CardContent>
            </Card>
          ))}

          {!isLoading && filteredAnnouncements.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Δεν βρέθηκαν ανακοινώσεις με τα κριτήρια αναζήτησης.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
