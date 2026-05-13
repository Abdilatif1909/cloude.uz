import { useMemo, useState } from 'react';
import { FiDownload, FiFileText, FiTrendingUp, FiUser } from 'react-icons/fi';

import DashboardCard from '../../components/DashboardCard';
import { formatDate } from '../../utils/format';

function StudentDashboard({ profile, results, downloads, onSaveProfile }) {
  const [form, setForm] = useState({ full_name: profile?.full_name || '', email: profile?.email || '' });
  const averageScore = useMemo(() => {
    if (!results.length) return 0;
    return (results.reduce((sum, item) => sum + item.score, 0) / results.length).toFixed(1);
  }, [results]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Test results" value={results.length} subtitle="Completed assessments" icon={FiTrendingUp} />
        <DashboardCard title="Average score" value={averageScore} subtitle="Across all submitted tests" icon={FiFileText} />
        <DashboardCard title="Downloads" value={downloads.length} subtitle="Tracked learning files" icon={FiDownload} />
        <DashboardCard title="Role" value={profile?.role || 'student'} subtitle="Current account type" icon={FiUser} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-panel rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-[#0f172a]">Profile</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSaveProfile(form);
            }}
            className="mt-5 space-y-4"
          >
            <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="input-shell" />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" className="input-shell" />
            <button type="submit" className="brand-primary rounded-2xl px-5 py-3 text-sm font-semibold">Save profile</button>
          </form>
        </div>

        <div className="glass-panel rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-[#0f172a]">Latest test results</h3>
          <div className="mt-5 space-y-3">
            {results.map((item) => (
              <div key={item.id} className="soft-card">
                <p className="font-medium text-[#0f172a]">{item.test_title}</p>
                <p className="mt-1 text-sm text-[#64748b]">Score: {item.score} • {formatDate(item.created_at)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6">
        <h3 className="text-xl font-semibold text-[#0f172a]">Downloaded files</h3>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {downloads.map((item) => (
            <div key={item.id} className="soft-card">
              <p className="font-medium text-[#0f172a]">{item.title}</p>
              <p className="mt-1 text-sm text-[#64748b]">{item.type} • {formatDate(item.downloadedAt)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
