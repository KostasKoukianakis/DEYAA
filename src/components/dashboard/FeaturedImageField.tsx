import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  generateFilePath,
  getPublicUrl,
  STORAGE_BUCKETS,
  uploadFile,
} from "@/lib/storage";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

interface FeaturedImageFieldProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (url: string) => void;
}

export function FeaturedImageField({
  id = "featured-image",
  label = "Εικόνα ανακοίνωσης",
  value,
  onChange,
}: FeaturedImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Μη έγκυρο αρχείο",
        description: "Επιλέξτε εικόνα (JPG, PNG, WebP ή GIF).",
        variant: "destructive",
      });
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      toast({
        title: "Πολύ μεγάλο αρχείο",
        description: "Η εικόνα πρέπει να είναι έως 5 MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const path = generateFilePath("featured", file.name);
      const { path: uploadedPath, error } = await uploadFile(
        STORAGE_BUCKETS.ANNOUNCEMENTS,
        file,
        path,
      );

      if (error) throw error;

      onChange(getPublicUrl(STORAGE_BUCKETS.ANNOUNCEMENTS, uploadedPath));
      toast({
        title: "Επιτυχία",
        description: "Η εικόνα ανέβηκε.",
      });
    } catch (e: unknown) {
      toast({
        title: "Σφάλμα ανεβάσματος",
        description: e instanceof Error ? e.message : "Δοκιμάστε ξανά.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor={id}>{label}</Label>

      {value ? (
        <div className="relative max-w-md overflow-hidden rounded-lg border border-input bg-muted/30">
          <img
            src={value}
            alt="Προεπισκόπηση εικόνας"
            className="aspect-video w-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8"
            onClick={() => onChange("")}
            aria-label="Αφαίρεση εικόνας"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex w-full max-w-md flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input bg-muted/20 px-6 py-10 text-center transition-colors hover:border-primary/40 hover:bg-muted/40 disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
          )}
          <span className="text-sm font-medium text-gray-900">
            {uploading ? "Ανέβασμα…" : "Κάντε κλικ για ανέβασμα εικόνας"}
          </span>
          <span className="text-xs text-muted-foreground">JPG, PNG, WebP · έως 5 MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />

      {value ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Ανέβασμα…
            </>
          ) : (
            "Αλλαγή εικόνας"
          )}
        </Button>
      ) : null}
    </div>
  );
}
