import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/layout/PageHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Calendar, Download, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentTenders, usePastTenders } from "@/hooks/useTenders";
import { getPublicUrl, STORAGE_BUCKETS } from "@/lib/storage";
import { format } from "date-fns";
import { el } from "date-fns/locale";

export default function Tenders() {
  const { data: currentTenders = [], isLoading: isLoadingCurrent } = useCurrentTenders();
  const { data: pastTenders = [], isLoading: isLoadingPast } = usePastTenders();

  return (
    <Layout>
      <PageHero
        title="Διαγωνισμοί"
        description="Προκηρύξεις και διαγωνισμοί ΔΕΥΑΑ"
        icon={FileText}
        breadcrumbs={[{ label: "Αρχική", href: "/" }, { label: "Διαγωνισμοί" }]}
      />

      <div className="container page-section">
        <Tabs defaultValue="current" className="space-y-6">
          <TabsList>
            <TabsTrigger value="current">Τρέχοντες ({currentTenders.length})</TabsTrigger>
            <TabsTrigger value="past">Παλαιότεροι ({pastTenders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            {isLoadingCurrent ? (
              <p className="text-center py-12 text-muted-foreground">Φόρτωση...</p>
            ) : (
              <div className="space-y-6">
                {currentTenders.map((tender) => (
                  <TenderCard key={tender.id} tender={tender} />
                ))}
                {currentTenders.length === 0 && (
                  <p className="text-center py-12 text-muted-foreground">
                    Δεν υπάρχουν τρέχοντες διαγωνισμοί.
                  </p>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {isLoadingPast ? (
              <p className="text-center py-12 text-muted-foreground">Φόρτωση...</p>
            ) : (
              <div className="space-y-6">
                {pastTenders.map((tender) => (
                  <TenderCard key={tender.id} tender={tender} isPast />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

function TenderCard({
  tender,
  isPast = false,
}: {
  tender: any;
  isPast?: boolean;
}) {
  return (
    <Card className={cn(isPast && "opacity-75")}>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Δημοσίευση: {format(new Date(tender.date), 'dd/MM/yyyy', { locale: el })}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Λήξη: {format(new Date(tender.deadline), 'dd/MM/yyyy', { locale: el })}
          </span>
          {tender.budget && (
            <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
              Προϋπολογισμός: {tender.budget}
            </span>
          )}
        </div>
        <CardTitle className="text-xl">{tender.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{tender.description}</p>
        <div className="flex flex-wrap gap-3">
          {tender.announcement_pdf_path && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={getPublicUrl(STORAGE_BUCKETS.TENDERS, tender.announcement_pdf_path)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText className="h-4 w-4 mr-2" />
                Διακήρυξη (PDF)
              </a>
            </Button>
          )}
          {tender.tender_documents_path && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={getPublicUrl(STORAGE_BUCKETS.TENDERS, tender.tender_documents_path)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-4 w-4 mr-2" />
                Τεύχη Δημοπράτησης
              </a>
            </Button>
          )}
          {!isPast && (
            <Button size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Υποβολή Προσφοράς
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
