'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, Loader2 } from 'lucide-react';
import { uploadAvatar } from '@/lib/api/profile';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { cn } from '@/lib/utils';

interface AvatarUploadProps {
  currentUrl: string | null;
  name: string | null;
}

export function AvatarUpload({ currentUrl, name }: AvatarUploadProps) {
  const user = useAuthStore((s) => s.user);
  const setProfile = useAuthStore((s) => s.setProfile);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setError(null);
    setIsUploading(true);

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    const supabase = createClient();
    const { url, error: uploadError } = await uploadAvatar(supabase, user.id, file);

    if (uploadError) {
      setError(uploadError);
      setPreviewUrl(currentUrl); // revert
    } else if (url) {
      setPreviewUrl(url);
    }

    setIsUploading(false);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={() => inputRef.current?.click()}
        className="relative group w-24 h-24 rounded-full overflow-hidden ring-2 ring-offset-2 ring-slate-200 hover:ring-slate-400 transition-all"
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={name ?? 'Avatar'}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-2xl font-semibold text-slate-500">
            {initials}
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {isUploading ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : (
            <Camera className="w-5 h-5 text-white" />
          )}
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <p className="text-xs text-slate-400">Click to upload · Max 2MB · JPG, PNG, WEBP</p>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
