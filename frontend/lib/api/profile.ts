import { createClient } from '../supabase/client';
import type { DbUser } from '../types/database';
import type { ProfileUpdate } from '../types/app';

export async function getProfile(userId: string): Promise<DbUser | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;
  return data as DbUser;
}

export async function updateProfile(
  userId: string,
  updates: ProfileUpdate
): Promise<{ error: string | null }> {
  const supabase = createClient();

  const { error } = await supabase
    .from('users')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId);

  return { error: error?.message ?? null };
}

export async function uploadAvatar(
  userId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  const supabase = createClient();

  if (file.size > 2 * 1024 * 1024) {
    return { url: null, error: 'File size must be under 2MB' };
  }

  const ext = file.name.split('.').pop();
  const filePath = `${userId}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    return { url: null, error: uploadError.message };
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
  const publicUrl = `${data.publicUrl}?t=${Date.now()}`; // cache-bust

  // Save URL to users table
  await supabase
    .from('users')
    .update({ avatar_url: publicUrl })
    .eq('id', userId);

  return { url: publicUrl, error: null };
}
