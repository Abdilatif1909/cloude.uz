import { FiCalendar, FiClock, FiPieChart, FiUser } from 'react-icons/fi';

import { formatDate, formatDuration } from '../../utils/format';

function TeacherResultTable({ results }) {
  return (
    <div className="glass-panel overflow-hidden rounded-[2rem] p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-eyebrow">Teacher analytics</p>
          <h2 className="text-h3 mt-2">Student natijalari</h2>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-[rgba(219,228,240,0.8)] bg-white/60 px-6 py-10 text-center">
          <p className="text-card-title">Hozircha natijalar yo‘q</p>
          <p className="text-muted mt-2">Talabalar test ishlagandan so‘ng analytics shu yerda ko‘rinadi.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-[rgba(219,228,240,0.8)]">
                <th className="text-table-head pb-4 pr-4">Student</th>
                <th className="text-table-head pb-4 pr-4">Test</th>
                <th className="text-table-head pb-4 pr-4">Score</th>
                <th className="text-table-head pb-4 pr-4">Completion</th>
                <th className="text-table-head pb-4 pr-4">Time</th>
                <th className="text-table-head pb-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item) => (
                <tr key={item.id} className="border-b border-[rgba(219,228,240,0.55)] last:border-b-0">
                  <td className="py-4 pr-4">
                    <div className="inline-flex items-center gap-2">
                      <FiUser className="text-[var(--color-link)]" />
                      <span className="text-body font-medium">{item.student_name}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4"><span className="text-body">{item.test_title}</span></td>
                  <td className="py-4 pr-4">
                    <span className="rounded-full bg-[#eff6ff] px-3 py-1 text-sm font-semibold text-[#2563eb]">
                      {item.score}/{item.total_questions}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="inline-flex items-center gap-2 text-body">
                      <FiPieChart className="text-[var(--color-accent)]" />
                      {item.completion_percent}%
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="inline-flex items-center gap-2 text-body">
                      <FiClock className="text-[var(--color-link)]" />
                      {formatDuration(item.time_spent_seconds)}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-2 text-muted">
                      <FiCalendar />
                      {formatDate(item.created_at)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TeacherResultTable;
