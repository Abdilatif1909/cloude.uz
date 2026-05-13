import { FiBookOpen, FiFileText, FiGrid, FiSettings, FiUsers } from 'react-icons/fi';

const items = [
  { icon: FiGrid, label: 'Overview' },
  { icon: FiFileText, label: 'Resources' },
  { icon: FiBookOpen, label: 'Tests' },
  { icon: FiUsers, label: 'Users' },
  { icon: FiSettings, label: 'Settings' },
];

function DashboardSidebar({ role }) {
  return (
    <aside className="glass h-fit rounded-3xl p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-500">{role} panel</p>
      <h3 className="mt-3 text-xl font-semibold">Dashboard Navigation</h3>
      <div className="mt-6 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
              <Icon className="text-violet-500" />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default DashboardSidebar;
