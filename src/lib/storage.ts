import { supabase } from '@/integrations/supabase/client';

export const STORAGE_BUCKETS = {
  TENDERS: 'tenders',
  DOCUMENTS: 'documents',
  ANNOUNCEMENTS: 'announcements',
} as const;

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  bucket: string,
  file: File,
  path: string
): Promise<{ path: string; error: Error | null }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { path: '', error };
    }

    return { path: data.path, error: null };
  } catch (error) {
    return { path: '', error: error as Error };
  }
}

/**
 * Get a browser URL for a stored file.
 * Absolute http(s) URLs and site-root paths (e.g. /documents/form.pdf) are returned as-is.
 */
export function getPublicUrl(bucket: string, path: string): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path) || path.startsWith("/")) {
    return path;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/** Extract a storage object path from a public URL, or null for local/static paths. */
export function storagePathFromPublicUrl(
  bucket: string,
  url: string | null | undefined,
): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(marker);
  if (index < 0) return null;
  return decodeURIComponent(url.slice(index + marker.length).split("?")[0]);
}

/** Remove a stored public file when the URL belongs to this bucket. */
export async function deleteStoredPublicFile(
  bucket: string,
  url: string | null | undefined,
): Promise<void> {
  const path = storagePathFromPublicUrl(bucket, url);
  if (!path) return;
  await deleteFile(bucket, path);
}

/**
 * Download a file from storage
 */
export async function downloadFile(
  bucket: string,
  path: string
): Promise<{ blob: Blob | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);

    if (error) {
      return { blob: null, error };
    }

    return { blob: data, error: null };
  } catch (error) {
    return { blob: null, error: error as Error };
  }
}

/**
 * Delete a file from storage
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      return { error };
    }

    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

/**
 * Generate a unique file path
 */
export function generateFilePath(prefix: string, fileName: string): string {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${prefix}/${timestamp}_${sanitizedFileName}`;
}
