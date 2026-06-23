import { useMemo, useState } from "react";
import { Eye, Mail, Phone, Search, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  useContactMessages,
  useDeleteContactMessage,
  useUpdateContactMessage,
} from "@/hooks/useContactMessages";
import { getContactTopicLabel } from "@/data/deyaaContactTopics";

const STATUS_LABELS: Record<string, string> = {
  new: "Νέο",
  read: "Αναγνωσμένο",
  in_progress: "Σε εξέλιξη",
  resolved: "Ολοκληρωμένο",
  archived: "Αρχειοθετημένο",
};

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  new: "default",
  read: "secondary",
  in_progress: "outline",
  resolved: "secondary",
  archived: "outline",
};

export default function ContactMessagesManagement() {
  const { toast } = useToast();
  const { data: messages = [], isLoading, error } = useContactMessages();
  const updateMessage = useUpdateContactMessage();
  const deleteMessage = useDeleteContactMessage();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<(typeof messages)[number] | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [status, setStatus] = useState("new");

  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const haystack = [
        msg.first_name,
        msg.last_name,
        msg.email,
        msg.phone,
        msg.message,
        msg.supply_number,
        msg.address,
        getContactTopicLabel(msg.topic),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = haystack.includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || msg.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [messages, searchTerm, statusFilter]);

  const openMessage = (msg: (typeof messages)[number]) => {
    setSelectedMessage(msg);
    setAdminNotes(msg.admin_notes ?? "");
    setStatus(msg.status);

    if (msg.status === "new") {
      updateMessage.mutate({ id: msg.id, updates: { status: "read" } });
    }
  };

  const handleSave = async () => {
    if (!selectedMessage) return;

    try {
      await updateMessage.mutateAsync({
        id: selectedMessage.id,
        updates: { status, admin_notes: adminNotes.trim() || null },
      });
      toast({ title: "Αποθηκεύτηκε", description: "Το μήνυμα ενημερώθηκε." });
      setSelectedMessage(null);
    } catch (e: unknown) {
      toast({
        title: "Σφάλμα",
        description: e instanceof Error ? e.message : "Αποτυχία αποθήκευσης",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Διαγραφή αυτού του μηνύματος;")) return;

    try {
      await deleteMessage.mutateAsync(id);
      toast({ title: "Διαγράφηκε", description: "Το μήνυμα διαγράφηκε." });
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (e: unknown) {
      toast({
        title: "Σφάλμα",
        description: e instanceof Error ? e.message : "Αποτυχία διαγραφής",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-red-600">
          Σφάλμα φόρτωσης: {(error as Error).message}
          <p className="mt-2 text-sm text-gray-500">
            Βεβαιωθείτε ότι έχει τρέξει το migration{" "}
            <code>20260605120000_contact_messages.sql</code> στο Supabase.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Μηνύματα επικοινωνίας ({messages.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Αναζήτηση…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Κατάσταση" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Όλες οι καταστάσεις</SelectItem>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <p className="text-gray-500">Φόρτωση…</p>
          ) : filteredMessages.length === 0 ? (
            <p className="text-gray-500">Δεν υπάρχουν μηνύματα.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ημερομηνία</TableHead>
                  <TableHead>Αποστολέας</TableHead>
                  <TableHead>Θέμα</TableHead>
                  <TableHead>Κατάσταση</TableHead>
                  <TableHead className="text-right">Ενέργειες</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((msg) => (
                  <TableRow key={msg.id}>
                    <TableCell className="whitespace-nowrap text-sm">
                      {new Date(msg.created_at).toLocaleString("el-GR")}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {msg.first_name} {msg.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{msg.email}</div>
                    </TableCell>
                    <TableCell>{getContactTopicLabel(msg.topic)}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[msg.status] ?? "outline"}>
                        {STATUS_LABELS[msg.status] ?? msg.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openMessage(msg)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(msg.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Μήνυμα επικοινωνίας</DialogTitle>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Όνομα</span>
                  <p className="font-medium">
                    {selectedMessage.first_name} {selectedMessage.last_name}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Θέμα</span>
                  <p className="font-medium">{getContactTopicLabel(selectedMessage.topic)}</p>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a href={`tel:${selectedMessage.phone}`} className="text-blue-600 hover:underline">
                    {selectedMessage.phone}
                  </a>
                </div>
                {selectedMessage.supply_number && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Αρ. παροχής</span>
                    <p>{selectedMessage.supply_number}</p>
                  </div>
                )}
                {selectedMessage.address && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Διεύθυνση</span>
                    <p>{selectedMessage.address}</p>
                  </div>
                )}
              </div>

              <div>
                <Label>Μήνυμα</Label>
                <p className="mt-1 whitespace-pre-wrap rounded-md bg-gray-50 p-3 text-sm">
                  {selectedMessage.message}
                </p>
              </div>

              <div>
                <Label htmlFor="msg-status">Κατάσταση</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="msg-status" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="admin-notes">Σημειώσεις διαχειριστή</Label>
                <Textarea
                  id="admin-notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                  Κλείσιμο
                </Button>
                <Button onClick={handleSave} disabled={updateMessage.isPending}>
                  Αποθήκευση
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
