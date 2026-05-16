import { DailyLogTracker } from '@/components/cat/DailyLogTracker';

export const metadata = {
  title: 'Daily Log | CAT Prep',
  description: 'Log your daily CAT study sessions by subject.',
};

export default function CatDailyLogPage() {
  return <DailyLogTracker />;
}
