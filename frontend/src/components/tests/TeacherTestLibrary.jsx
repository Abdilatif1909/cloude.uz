import { FiClock, FiEdit3, FiLayers, FiPlusCircle } from 'react-icons/fi';

function TeacherTestLibrary({ tests, selectedTestId, loading, onSelect, onCreateNew }) {
  return (
    <div className="glass-panel rounded-[2rem] p-6 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-eyebrow">Assessment library</p>
          <h2 className="text-h3 mt-2">Teacher test manager</h2>
          <p className="text-muted mt-2">Yangi test yarating yoki mavjud assessmentni tahrir qiling.</p>
        </div>
        <button
          type="button"
          onClick={onCreateNew}
          className="brand-primary inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold"
        >
          <FiPlusCircle /> Yangi test
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-3xl bg-[#eef3f9] p-5">
              <div className="h-5 w-1/2 rounded-full bg-[#e1eaf5]" />
              <div className="mt-3 h-4 w-full rounded-full bg-[#e8eef7]" />
              <div className="mt-5 flex gap-3">
                <div className="h-8 w-24 rounded-full bg-[#e8eef7]" />
                <div className="h-8 w-24 rounded-full bg-[#e8eef7]" />
              </div>
            </div>
          ))
        ) : tests.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[rgba(219,228,240,0.8)] bg-white/70 px-5 py-8 text-center">
            <p className="text-card-title">Hozircha testlar yo‘q</p>
            <p className="text-muted mt-2">Birinchi assessmentni yaratish uchun yuqoridagi tugmadan foydalaning.</p>
          </div>
        ) : (
          tests.map((item) => {
            const isActive = selectedTestId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className={`w-full rounded-3xl border p-5 text-left transition-all duration-300 ${isActive ? 'border-[rgba(37,99,235,0.35)] bg-[rgba(239,246,255,0.9)] shadow-[0_16px_40px_rgba(37,99,235,0.10)]' : 'border-[rgba(219,228,240,0.8)] bg-white/70 hover:-translate-y-0.5 hover:bg-white'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-card-title truncate">{item.title}</h3>
                      <span className="rounded-full bg-[#f8fafc] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-link)]">
                        {item.difficulty}
                      </span>
                    </div>
                    <p className="text-body mt-2 line-clamp-2">{item.description || 'Professional test session with editable question bank.'}</p>
                  </div>
                  <div className="icon-chip h-11 w-11 shrink-0"><FiEdit3 /></div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-link)]">
                  <span className="rounded-full bg-[#eff6ff] px-3 py-1 inline-flex items-center gap-2"><FiLayers /> {item.question_count || 0} questions</span>
                  <span className="rounded-full bg-[#ecfeff] px-3 py-1 inline-flex items-center gap-2"><FiClock /> {item.estimated_time || 0} min</span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export default TeacherTestLibrary;
