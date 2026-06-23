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
 * Get public URL for a file in storage
 */
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
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
