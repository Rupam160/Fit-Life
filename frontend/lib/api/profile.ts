import { SupabaseClient } from '@supabase/supabase-js';
import type { DbUser, GenderType, BloodGroupType, GoalType } from '../types/database';

export interface ProfileUpdateInput {
  name?: string | null;
  current_weight?: number | null;
  target_weight?: number | null;
  goal?: GoalType | null;
  avatar_url?: string | null;
  gender?: GenderType | null;
  blood_group?: BloodGroupType | null;
  age?: number | null;
  onboarded?: boolean;
}

export async function getProfile(supabase: SupabaseClient, userId: string): Promise<DbUser | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const meta = user.user_metadata || {};

  // Try fetching from users table
  const { data: dbUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  return {
    id: userId,
    email: user.email || '',
    name: dbUser?.name || meta.name || user.email?.split('@')[0] || 'User',
    avatar_url: dbUser?.avatar_url || meta.avatar_url || null,
    current_weight: dbUser?.current_weight ?? meta.current_weight ?? null,
    target_weight: dbUser?.target_weight ?? meta.target_weight ?? null,
    goal: dbUser?.goal ?? meta.goal ?? null,
    gender: meta.gender ?? null,
    blood_group: meta.blood_group ?? null,
    age: meta.age ?? null,
    onboarded: meta.onboarded ?? false,
    created_at: user.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: ProfileUpdateInput
): Promise<{ error: string | null }> {
  try {
    // 1. Update user_metadata in Supabase Auth (always works safely)
    const { error: authError } = await supabase.auth.updateUser({ data: updates });
    if (authError) {
      return { error: authError.message };
    }

    // 2. Safely attempt to update standard columns in 'users' table if present
    try {
      const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.current_weight !== undefined) dbUpdates.current_weight = updates.current_weight;
      if (updates.target_weight !== undefined) dbUpdates.target_weight = updates.target_weight;
      if (updates.goal !== undefined) dbUpdates.goal = updates.goal;
      if (updates.avatar_url !== undefined) dbUpdates.avatar_url = updates.avatar_url;

      await supabase
        .from('users')
        .update(dbUpdates)
        .eq('id', userId);
    } catch (e) {
      // Catch and swallow table schema mismatch errors gracefully
    }

    return { error: null };
  } catch (err: any) {
    return { error: err?.message || 'Failed to update profile' };
  }
}

export async function uploadAvatar(
  supabase: SupabaseClient,
  userId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  if (file.size > 2 * 1024 * 1024) {
    return { url: null, error: 'File size must be under 2MB' };
  }

  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    return { url: null, error: uploadError.message };
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
  const avatarUrl = data.publicUrl;

  await updateProfile(supabase, userId, { avatar_url: avatarUrl });
  return { url: avatarUrl, error: null };
}

export async function getUserProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Partial<DbUser>> {
  const profile = await getProfile(supabase, userId);
  return profile || {};
}

export async function updateUserProfile(
  supabase: SupabaseClient,
  userId: string,
  input: ProfileUpdateInput
): Promise<{ success: boolean; error?: string }> {
  const res = await updateProfile(supabase, userId, input);
  return { success: !res.error, error: res.error || undefined };
}
