import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

const announcements = [
  {
    id: 1,
    title: "Διακοπή υδροδότησης στην περιοχή Κέντρου",
    date: "2024-01-15",
    category: "Διακοπές",
    content: "Λόγω εργασιών συντήρησης του δικτύου ύδρευσης, θα υπάρξει διακοπή υδροδότησης την Τετάρτη 17 Ιανουαρίου από τις 08:00 έως τις 14:00 στην περιοχή του Κέντρου. Παρακαλούμε τους κατοίκους να προμηθευτούν νερό για τις ανάγκες τους.",
  },
  {
    id: 2,
    title: "Νέα ηλεκτρονική υπηρεσία δήλωσης ένδειξης",
    date: "2024-01-10",
    category: "Ενημέρωση",
    content: "Πλέον μπορείτε να δηλώνετε την ένδειξη του μετρητή σας ηλεκτρονικά μέσω της ιστοσελίδας μας. Η υπηρεσία είναι διαθέσιμη 24 ώρες το 24ωρο και είναι εντελώς δωρεάν.",
  },
  {
    id: 3,
    title: "Συμβουλές εξοικονόμησης νερού",
    date: "2024-01-05",
    category: "Δελτίο Τύπου",
    content: "Η ΔΕΥΑΑ προτείνει απλούς τρόπους για να μειώσετε την κατανάλωση νερού στο σπίτι σας: Επισκευάστε τις διαρροές, χρησιμοποιήστε ντους αντί για μπανιέρα, μην αφήνετε τη βρύση να τρέχει κατά το βούρτσισμα των δοντιών.",
  },
  {
    id: 4,
    title: "Αναβάθμιση δικτύου αποχέτευσης",
    date: "2024-01-02",
    category: "Έργα",
    content: "Ξεκινούν έργα αναβάθμισης του δικτύου αποχέτευσης στη Βόρεια Περιοχή. Τα έργα θα διαρκέσουν περίπου 3 μήνες και θα βελτιώσουν σημαντικά την παροχή υπηρεσιών.",
  },
  {
    id: 5,
    title: "Ωράριο λειτουργίας εορτών",
    date: "2023-12-20",
    category: "Ενημέρωση",
    content: "Κατά τη διάρκεια των εορτών, τα γραφεία της ΔΕΥΑΑ θα παραμείνουν κλειστά από 24 Δεκεμβρίου έως 2 Ιανουαρίου. Για επείγοντα καλέστε στο τηλέφωνο βλαβών.",
  },
];

const categories = ["Όλες", "Διακοπές", "Ενημέρωση", "Δελτίο Τύπου", "Έργα"];

export default function Announcements() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Όλες");

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Όλες" || announcement.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="bg-primary py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">Ανακοινώσεις</h1>
          <p className="text-primary-foreground/80 mt-2">Νέα και ενημερώσεις από τη ΔΕΥΑΑ</p>
        </div>
      </div>

      <div className="container py-12">
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
          {filteredAnnouncements.map((announcement) => (
            <Card key={announcement.id} className="card-hover">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(announcement.date).toLocaleDateString("el-GR", {
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

          {filteredAnnouncements.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Δεν βρέθηκαν ανακοινώσεις με τα κριτήρια αναζήτησης.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
