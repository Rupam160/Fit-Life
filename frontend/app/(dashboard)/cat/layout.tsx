import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CatMobileTabs } from '@/components/cat/CatMobileTabs';

export default async function CatLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email?.toLowerCase() !== 'rupambarat18@gmail.com') {
    redirect('/dashboard');
  }

  return (
    <>
      <CatMobileTabs />
      {children}
    </>
  );
}
