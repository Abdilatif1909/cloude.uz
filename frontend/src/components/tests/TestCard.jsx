import { FiArrowRight, FiBarChart2, FiClock, FiLayers, FiPlayCircle } from 'react-icons/fi';

const difficultyMap = {
  beginner: { label: 'Beginner', className: 'bg-[#ecfdf5] text-[#15803d]' },
  intermediate: { label: 'Intermediate', className: 'bg-[#eff6ff] text-[#2563eb]' },
  advanced: { label: 'Advanced', className: 'bg-[#fff7ed] text-[#c2410c]' },
};

function TestCard({ test, progressLabel, onStart, actionLabel = 'Testni boshlash' }) {
  const difficulty = difficultyMap[test.difficulty] || difficultyMap.intermediate;

  return (
    <article className="glass-panel group rounded-[2rem] p-6 transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div className="icon-chip text-xl"><FiPlayCircle /></div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${difficulty.className}`}>
          {difficulty.label}
        </span>
      </div>

      <div className="mt-5">
        <h3 className="text-card-title text-xl">{test.title}</h3>
        <p className="text-body mt-3 line-clamp-2">{test.description || 'Interactive test session with step-by-step questions and instant submission.'}</p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="soft-card rounded-2xl px-4 py-3">
          <p className="text-muted inline-flex items-center gap-2"><FiLayers /> Questions</p>
          <p className="mt-1 text-lg font-semibold text-[var(--color-heading)]">{test.question_count || 15}</p>
        </div>
        <div className="soft-card rounded-2xl px-4 py-3">
          <p className="text-muted inline-flex items-center gap-2"><FiClock /> Estimated time</p>
          <p className="mt-1 text-lg font-semibold text-[var(--color-heading)]">{test.estimated_time || 15} min</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl bg-[rgba(237,243,249,0.7)] px-4 py-3">
        <div>
          <p className="text-muted">Teacher</p>
          <p className="text-sm font-semibold text-[var(--color-heading-3)]">{test.created_by_name || 'Instructor'}</p>
        </div>
        <div className="text-right">
          <p className="text-muted">Progress</p>
          <p className="text-sm font-semibold text-[var(--color-link)]">{progressLabel}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="brand-primary mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold"
      >
        {actionLabel} <FiArrowRight />
      </button>

      <div className="mt-4 flex items-center gap-2 text-muted">
        <FiBarChart2 /> Responsive, autosave, timer, result analytics
      </div>
    </article>
  );
}

export default TestCard;
