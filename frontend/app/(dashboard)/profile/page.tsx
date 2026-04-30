import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/api/profile';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { AuthProvider } from '@/components/providers/AuthProvider';

export const metadata = {
  title: 'Profile — FitTrack Pro',
  description: 'Update your profile, weight, and fitness goals.',
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const profile = await getProfile(user.id);

  if (!profile) redirect('/login');

  return (
    <AuthProvider userId={user.id}>
      <div className="flex flex-col gap-6 animate-fade-in max-w-lg">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your personal info and goals</p>
        </div>

        {/* Avatar */}
        <div className="card-base p-6 flex flex-col items-center">
          <AvatarUpload
            currentUrl={profile.avatar_url}
            name={profile.name}
          />
          <p className="text-xs text-slate-500 mt-3">{profile.email}</p>
        </div>

        {/* Form */}
        <div className="card-base p-6">
          <h2 className="section-title mb-5">Personal Info</h2>
          <ProfileForm profile={profile} />
        </div>
      </div>
    </AuthProvider>
  );
}
