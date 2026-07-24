import { SupabaseClient } from '@supabase/supabase-js';
import type { DbUser, GenderType, BloodGroupType, GoalType } from '../types/database';
import type { ProfileUpdate } from '../types/app';

export interface ProfileUpdateInput extends ProfileUpdate {
  gender?: GenderType;
  blood_group?: BloodGroupType;
  age?: number;
  onboarded?: boolean;
}

export async function getProfile(supabase: SupabaseClient, userId: string): Promise<DbUser | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    // Fallback to user metadata if users table fetch fails
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const meta = user.user_metadata || {};
    return {
      id: userId,
      email: user.email || '',
      name: meta.name || user.email?.split('@')[0] || 'User',
      avatar_url: meta.avatar_url || null,
      current_weight: meta.current_weight || null,
      target_weight: meta.target_weight || null,
      goal: meta.goal || null,
      gender: meta.gender || null,
      blood_group: meta.blood_group || null,
      age: meta.age || null,
      onboarded: meta.onboarded ?? false,
      created_at: user.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  return data as DbUser;
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: ProfileUpdate
): Promise<{ error: string | null }> {
  try {
    await supabase.auth.updateUser({ data: updates });

    const { error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId);

    return { error: error?.message || null };
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
  if (profile) return profile;

  const { data: { user } } = await supabase.auth.getUser();
  const meta = user?.user_metadata || {};

  return {
    id: userId,
    email: user?.email || '',
    name: meta.name || user?.email?.split('@')[0] || 'User',
    gender: meta.gender || null,
    blood_group: meta.blood_group || null,
    age: meta.age || null,
    target_weight: meta.target_weight || null,
    current_weight: meta.current_weight || null,
    onboarded: meta.onboarded ?? false,
  };
}

export async function updateUserProfile(
  supabase: SupabaseClient,
  userId: string,
  input: ProfileUpdateInput
): Promise<{ success: boolean; error?: string }> {
  const res = await updateProfile(supabase, userId, input);
  return { success: !res.error, error: res.error || undefined };
}
