import { useState } from "react";
import { Plus, Edit, Trash2, Search, Download, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  WATER_QUALITY_CATEGORIES,
  type WaterQualityCategory,
} from "@/data/deyaaWaterQuality";
import {
  useCreateWaterQualityRecord,
  useDeleteWaterQualityRecord,
  useUpdateWaterQualityRecord,
  useWaterQualityRecords,
} from "@/hooks/useWaterQuality";
import { useToast } from "@/hooks/use-toast";
import { generateFilePath, getPublicUrl, STORAGE_BUCKETS, uploadFile, deleteFile } from "@/lib/storage";
import type { Tables } from "@/integrations/supabase/types";

type WaterQualityRow = Tables<"water_quality_records">;

const CATEGORY_LABELS: Record<WaterQualityCategory, string> = {
  analysis: "Αναλύσεις",
  monitoring: "Παρακολούθηση",
  statistics: "Στατιστικά",
  lab_report: "Εκθέσεις εργαστηρίων",
  education: "Ενημερωτικό υλικό",
};

const emptyForm = {
  title: "",
  summary: "",
  category: "analysis" as WaterQualityCategory,
  location: "",
  sampling_date: "",
  published_at: "",
  display_order: 0,
  is_published: true,
  file: null as File | null,
};

function toDatetimeLocalValue(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function WaterQualityManagement() {
  const { data: records = [], isLoading, error } = useWaterQualityRecords();
  const createRecord = useCreateWaterQualityRecord();
  const updateRecord = useUpdateWaterQualityRecord();
  const deleteRecord = useDeleteWaterQualityRecord();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<WaterQualityRow | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const filtered = records.filter((record) => {
    const q = searchTerm.toLowerCase();
    return (
      record.title.toLowerCase().includes(q) ||
      record.summary.toLowerCase().includes(q) ||
      (record.location ?? "").toLowerCase().includes(q) ||
      CATEGORY_LABELS[record.category as WaterQualityCategory]?.toLowerCase().includes(q)
    );
  });

  const resetForm = () => {
    setFormData(emptyForm);
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (record: WaterQualityRow) => {
    setEditing(record);
    setFormData({
      title: record.title,
      summary: record.summary,
      category: record.category as WaterQualityCategory,
      location: record.location ?? "",
      sampling_date: record.sampling_date ?? "",
      published_at: toDatetimeLocalValue(record.published_at),
      display_order: record.display_order ?? 0,
      is_published: record.is_published,
      file: null,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({ title: "Σφάλμα", description: "Ο τίτλος είναι υποχρεωτικός", variant: "destructive" });
      return;
    }

    try {
      let filePath = editing?.file_path ?? null;
      let fileName = editing?.file_name ?? null;
      let fileSize = editing?.file_size ?? null;
      let fileType = editing?.file_type ?? null;

      if (formData.file) {
        if (editing?.file_path) {
          await deleteFile(STORAGE_BUCKETS.WATER_QUALITY, editing.file_path);
        }
        const path = generateFilePath("records", formData.file.name);
        const { path: uploadedPath, error: uploadError } = await uploadFile(
          STORAGE_BUCKETS.WATER_QUALITY,
          formData.file,
          path,
        );
        if (uploadError) throw uploadError;
        filePath = uploadedPath;
        fileName = formData.file.name;
        fileSize = formData.file.size;
        fileType = formData.file.type;
      }

      const payload = {
        title: formData.title.trim(),
        summary: formData.summary.trim(),
        category: formData.category,
        location: formData.location.trim() || null,
        sampling_date: formData.sampling_date || null,
        published_at: formData.published_at
          ? new Date(formData.published_at).toISOString()
          : new Date().toISOString(),
        display_order: formData.display_order,
        is_published: formData.is_published,
        file_path: filePath,
        file_name: fileName,
        file_size: fileSize,
        file_type: fileType,
      };

      if (editing) {
        await updateRecord.mutateAsync({ id: editing.id, updates: payload });
        toast({ title: "Επιτυχία", description: "Η εγγραφή ενημερώθηκε" });
      } else {
        await createRecord.mutateAsync(payload);
        toast({ title: "Επιτυχία", description: "Η εγγραφή δημιουργήθηκε" });
      }

      setDialogOpen(false);
      resetForm();
    } catch (err: unknown) {
      toast({
        title: "Σφάλμα",
        description: err instanceof Error ? err.message : "Δεν αποθηκεύτηκε η εγγραφή",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (record: WaterQualityRow) => {
    if (!confirm("Διαγραφή αυτής της εγγραφής ποιότητας νερού;")) return;
    try {
      await deleteRecord.mutateAsync(record.id);
      toast({ title: "Επιτυχία", description: "Η εγγραφή διαγράφηκε" });
    } catch (err: unknown) {
      toast({
        title: "Σφάλμα",
        description: err instanceof Error ? err.message : "Δεν διαγράφηκε η εγγραφή",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Φόρτωση...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ποιότητα νερού</h1>
          <p className="text-gray-600">
            Αναλύσεις, προγράμματα παρακολούθησης, στατιστικά και εκθέσεις εργαστηρίων για τη δημόσια σελίδα.
          </p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Νέα εγγραφή
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Επεξεργασία εγγραφής" : "Νέα εγγραφή ποιότητας νερού"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="wq-title">Τίτλος *</Label>
                <Input
                  id="wq-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="π.χ. Μικροβιολογικός έλεγχος — Βάμος"
                />
              </div>
              <div>
                <Label htmlFor="wq-summary">Περίληψη</Label>
                <Textarea
                  id="wq-summary"
                  rows={3}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label>Κατηγορία *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: WaterQualityCategory) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WATER_QUALITY_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {CATEGORY_LABELS[category]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="wq-location">Περιοχή / δίκτυο</Label>
                  <Input
                    id="wq-location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="π.χ. Βάμος"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="wq-sampling">Ημ/νία δειγματοληψίας</Label>
                  <Input
                    id="wq-sampling"
                    type="date"
                    value={formData.sampling_date}
                    onChange={(e) => setFormData({ ...formData, sampling_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="wq-published">Ημ/νία ανάρτησης</Label>
                  <Input
                    id="wq-published"
                    type="datetime-local"
                    value={formData.published_at}
                    onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="wq-file">Αρχείο PDF</Label>
                <Input
                  id="wq-file"
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                />
                {editing?.file_name && !formData.file ? (
                  <p className="mt-1 text-sm text-gray-500">Τρέχον αρχείο: {editing.file_name}</p>
                ) : null}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="wq-order">Σειρά εμφάνισης</Label>
                  <Input
                    id="wq-order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 0 })
                    }
                  />
                </div>
                <label className="flex items-center gap-2 pt-8">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="h-4 w-4"
                  />
                  Δημοσιευμένο στη σελίδα
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Ακύρωση
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={createRecord.isPending || updateRecord.isPending}
                >
                  {createRecord.isPending || updateRecord.isPending ? "Αποθήκευση..." : "Αποθήκευση"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error ? (
        <p className="text-sm text-red-600">
          Δεν φορτώθηκε ο πίνακας ποιότητας νερού. Ελέγξτε ότι το Supabase migration έχει εφαρμοστεί.
        </p>
      ) : null}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Αναζήτηση εγγραφών..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            Εγγραφές ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Τίτλος</TableHead>
                <TableHead>Κατηγορία</TableHead>
                <TableHead>Περιοχή</TableHead>
                <TableHead>Κατάσταση</TableHead>
                <TableHead className="text-right">Ενέργειες</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {CATEGORY_LABELS[record.category as WaterQualityCategory] ?? record.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.location || "—"}</TableCell>
                  <TableCell>
                    {record.is_published ? (
                      <Badge className="bg-green-100 text-green-800">Δημοσιευμένο</Badge>
                    ) : (
                      <Badge variant="secondary">Πρόχειρο</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {record.file_path ? (
                        <a
                          href={getPublicUrl(STORAGE_BUCKETS.WATER_QUALITY, record.file_path)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </a>
                      ) : null}
                      <Button variant="ghost" size="sm" onClick={() => openEdit(record)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(record)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
