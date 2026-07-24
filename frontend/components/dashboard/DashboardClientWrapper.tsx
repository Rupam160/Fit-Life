'use client';

import { useState, useEffect } from 'react';
import { OnboardingModal } from '../onboarding/OnboardingModal';
import { getUserProfile } from '@/lib/api/profile';
import { createClient } from '@/lib/supabase/client';
import type { GenderType } from '@/lib/types/database';

interface Props {
  userId: string;
  userGender?: GenderType | null;
  isOnboarded?: boolean;
}

export function DashboardClientWrapper({ userId, userGender: initialGender, isOnboarded: initialOnboarded }: Props) {
  const [isOnboarded, setIsOnboarded] = useState<boolean>(initialOnboarded ?? true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function checkProfile() {
      const supabase = createClient();
      const profile = await getUserProfile(supabase, userId);
      const onboarded = profile.onboarded ?? false;
      setIsOnboarded(onboarded);
      if (!onboarded) {
        setIsModalOpen(true);
      }
    }

    checkProfile();
  }, [userId]);

  return (
    <OnboardingModal
      isOpen={isModalOpen}
      userId={userId}
      onComplete={() => {
        setIsModalOpen(false);
        window.location.reload();
      }}
    />
  );
}
