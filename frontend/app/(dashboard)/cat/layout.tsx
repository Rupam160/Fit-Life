import { CatMobileTabs } from '@/components/cat/CatMobileTabs';

export default function CatLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CatMobileTabs />
      {children}
    </>
  );
}
