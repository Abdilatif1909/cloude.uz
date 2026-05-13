import { useMemo } from 'react';
import { FiActivity, FiClipboard, FiTrendingUp, FiUsers } from 'react-icons/fi';

import DashboardCard from '../../components/DashboardCard';
import { formatDate } from '../../utils/format';

function TeacherDashboard({ tests, results }) {
  const averageScore = useMemo(() => {
    if (!results.length) return 0;
    return (results.reduce((sum, item) => sum + item.score, 0) / results.length).toFixed(1);
  }, [results]);

  const groupedStudents = useMemo(() => {
    const map = new Map();
    results.forEach((item) => {
      const current = map.get(item.student_name) || { student: item.student_name, attempts: 0, total: 0 };
      current.attempts += 1;
      current.total += item.score;
      map.set(item.student_name, current);
    });
    return Array.from(map.values()).map((item) => ({ ...item, average: (item.total / item.attempts).toFixed(1) }));
  }, [results]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Managed tests" value={tests.length} subtitle="Created by teacher" icon={FiClipboard} />
        <DashboardCard title="Student results" value={results.length} subtitle="Submitted answers" icon={FiUsers} />
        <DashboardCard title="Average score" value={averageScore} subtitle="Across all results" icon={FiTrendingUp} />
        <DashboardCard title="Active students" value={groupedStudents.length} subtitle="Unique participants" icon={FiActivity} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="glass-panel rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-[#0f172a]">Student scores</h3>
          <div className="mt-5 space-y-3">
            {groupedStudents.map((student) => (
              <div key={student.student} className="soft-card">
                <p className="font-medium text-[#0f172a]">{student.student}</p>
                <p className="mt-1 text-sm text-[#64748b]">Attempts: {student.attempts} • Average score: {student.average}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-[#0f172a]">Recent analytics</h3>
          <div className="mt-5 space-y-3">
            {results.slice(0, 8).map((item) => (
              <div key={item.id} className="soft-card">
                <p className="font-medium text-[#0f172a]">{item.student_name}</p>
                <p className="mt-1 text-sm text-[#64748b]">{item.test_title} • Score: {item.score} • {formatDate(item.created_at)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
