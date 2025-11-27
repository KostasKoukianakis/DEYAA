import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Calendar, Download, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const tenders = [
  {
    id: 1,
    title: "Προμήθεια υλικών ύδρευσης 2024",
    date: "2024-01-20",
    deadline: "2024-02-15",
    budget: "150.000€",
    status: "current",
    description: "Διαγωνισμός για την προμήθεια υλικών συντήρησης δικτύου ύδρευσης.",
  },
  {
    id: 2,
    title: "Κατασκευή αντλιοστασίου",
    date: "2024-01-10",
    deadline: "2024-02-28",
    budget: "500.000€",
    status: "current",
    description: "Ανοικτός διαγωνισμός για την κατασκευή νέου αντλιοστασίου στη Βόρεια Περιοχή.",
  },
  {
    id: 3,
    title: "Υπηρεσίες καθαρισμού αγωγών",
    date: "2024-01-05",
    deadline: "2024-01-25",
    budget: "80.000€",
    status: "current",
    description: "Διαγωνισμός για υπηρεσίες καθαρισμού και συντήρησης αγωγών αποχέτευσης.",
  },
  {
    id: 4,
    title: "Αναβάθμιση συστήματος SCADA",
    date: "2023-11-15",
    deadline: "2023-12-15",
    budget: "200.000€",
    status: "past",
    description: "Διαγωνισμός για την αναβάθμιση του συστήματος τηλεμετρίας και ελέγχου.",
  },
  {
    id: 5,
    title: "Προμήθεια υδρομέτρων",
    date: "2023-10-01",
    deadline: "2023-10-30",
    budget: "120.000€",
    status: "past",
    description: "Διαγωνισμός για την προμήθεια 5.000 νέων υδρομέτρων.",
  },
];

export default function Tenders() {
  const currentTenders = tenders.filter((t) => t.status === "current");
  const pastTenders = tenders.filter((t) => t.status === "past");

  return (
    <Layout>
      <div className="bg-primary py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">Διαγωνισμοί</h1>
          <p className="text-primary-foreground/80 mt-2">Προκηρύξεις και διαγωνισμοί ΔΕΥΑΑ</p>
        </div>
      </div>

      <div className="container py-12">
        <Tabs defaultValue="current" className="space-y-6">
          <TabsList>
            <TabsTrigger value="current">Τρέχοντες ({currentTenders.length})</TabsTrigger>
            <TabsTrigger value="past">Παλαιότεροι ({pastTenders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
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
          </TabsContent>

          <TabsContent value="past">
            <div className="space-y-6">
              {pastTenders.map((tender) => (
                <TenderCard key={tender.id} tender={tender} isPast />
              ))}
            </div>
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
  tender: (typeof tenders)[0];
  isPast?: boolean;
}) {
  return (
    <Card className={cn(isPast && "opacity-75")}>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Δημοσίευση: {new Date(tender.date).toLocaleDateString("el-GR")}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Λήξη: {new Date(tender.deadline).toLocaleDateString("el-GR")}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
            Προϋπολογισμός: {tender.budget}
          </span>
        </div>
        <CardTitle className="text-xl">{tender.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{tender.description}</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Διακήρυξη (PDF)
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Τεύχη Δημοπράτησης
          </Button>
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
