import { Lightbulb, Target, Clock, BookOpen, TrendingUp, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Strategy | CAT Prep',
  description: 'CAT preparation strategy and study tips.',
};

interface StrategyCardProps {
  icon: React.ElementType;
  title: string;
  body: string;
  accent: string;
}

function StrategyCard({ icon: Icon, title, body, accent }: StrategyCardProps) {
  return (
    <div className={`card-base p-5 flex gap-4 border-l-2 ${accent}`}>
      <div className="shrink-0 mt-0.5">
        <Icon className="w-5 h-5 text-slate-600" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800 mb-1">{title}</p>
        <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

const strategies = [
  {
    icon: Target,
    title: 'Target: 99%ile Strategy',
    body: 'Aim for 40+ in VARC, 35+ in LRDI, 45+ in QUANT (scaled). Focus on accuracy over speed. Attempt only 65–70% of questions but with 90%+ accuracy.',
    accent: 'border-blue-400',
  },
  {
    icon: Clock,
    title: 'Time Management',
    body: 'VARC: 40 min (24 attempts), LRDI: 40 min (12–16 attempts), QUANT: 40 min (22 attempts). Never spend more than 3 minutes on a single question.',
    accent: 'border-amber-400',
  },
  {
    icon: BookOpen,
    title: 'VARC Approach',
    body: 'Read 2 editorials daily (Hindu/LiveMint). Practice RC passages daily. For VA, elimination strategy works best. Read full passage before answering.',
    accent: 'border-blue-300',
  },
  {
    icon: TrendingUp,
    title: 'LRDI Approach',
    body: 'Spend 2–3 min selecting sets. Prioritize grids and arrangements. Practice timed set selection. Always solve complete sets, not partial ones.',
    accent: 'border-purple-400',
  },
  {
    icon: CheckCircle,
    title: 'QUANT Approach',
    body: 'Cover 100% syllabus basics first. Focus on Arithmetic (40% weight), Algebra, Geometry. Maintain an error log. Spend last 2 months on mock analysis.',
    accent: 'border-emerald-400',
  },
  {
    icon: Lightbulb,
    title: 'Mock Analysis Protocol',
    body: 'After every mock: identify wrong answers, time-wasted questions, and unattempted questions. Spend 2x the mock time on analysis. Track patterns over 5 mocks.',
    accent: 'border-slate-400',
  },
];

const checklist = [
  'Complete NCERT Math (6–10) for QUANT fundamentals',
  'Read 2 quality editorial articles daily for VARC',
  'Solve 30+ LRDI sets per week in timed conditions',
  'Take at least 20 full mocks before the exam',
  'Spend 2 hours analyzing every mock',
  'Maintain a topic-wise error log and revisit weekly',
  'Practice with previous year CAT papers (2017–2023)',
  'Join a PW/TIME/IMS test series for quality mocks',
];

export default function CatStrategyPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Strategy</h1>
        <p className="text-sm text-slate-500 mt-1">Evidence-based CAT preparation framework for 99+ percentile.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {strategies.map((s) => (
          <StrategyCard key={s.title} {...s} />
        ))}
      </div>

      <div className="card-base p-5">
        <h2 className="section-title mb-4">Essential Checklist</h2>
        <div className="space-y-2.5">
          {checklist.map((item, i) => (
            <div key={i} className="flex items-start gap-3 text-sm text-slate-600">
              <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-slate-400">{i + 1}</span>
              </div>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="card-base p-5 border-l-2 border-slate-800">
        <h2 className="section-title mb-2">Realistic Timeline</h2>
        <div className="space-y-3 mt-4">
          {[
            { phase: 'Phase 1 (Months 1–3)', desc: 'Concept building — cover entire syllabus, 1 mock/week' },
            { phase: 'Phase 2 (Months 4–6)', desc: 'DPP intensive — daily practice, 2 mocks/week, error log' },
            { phase: 'Phase 3 (Months 7–8)', desc: 'Mock marathon — 3–4 mocks/week, deep analysis, weak chapter revision' },
            { phase: 'Phase 4 (Last 2 weeks)', desc: 'Revision only — no new topics, light practice, sleep routine' },
          ].map(({ phase, desc }) => (
            <div key={phase} className="flex gap-4 text-sm">
              <span className="font-semibold text-slate-700 w-48 shrink-0">{phase}</span>
              <span className="text-slate-500">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
