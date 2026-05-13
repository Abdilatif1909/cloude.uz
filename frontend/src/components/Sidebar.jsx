import { FiBookOpen, FiFileText, FiPieChart, FiSettings, FiUsers } from 'react-icons/fi';

const items = [
  { label: 'Overview', icon: FiPieChart },
  { label: 'Resources', icon: FiFileText },
  { label: 'Users', icon: FiUsers },
  { label: 'Books', icon: FiBookOpen },
  { label: 'Settings', icon: FiSettings },
];

function Sidebar({ role }) {
  return (
    <aside className="glass-panel h-fit rounded-[2rem] p-6">
      <p className="text-eyebrow">{role} dashboard</p>
      <h2 className="text-h3 mt-3">Control Center</h2>
      <div className="mt-6 space-y-2">
        {items.map(({ label, icon: Icon }) => (
          <div key={label} className="text-sidebar flex items-center gap-3 rounded-2xl px-4 py-3 hover:bg-[#eef6ff] hover:text-[var(--color-link-hover)]">
            <Icon className="text-[#2563eb]" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
