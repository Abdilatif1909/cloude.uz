import { FiBook, FiFileText, FiPieChart, FiUsers } from 'react-icons/fi';

import StatCard from '../ui/StatCard';

function StatsSection({ stats }) {
  const items = [
    { title: 'Ma’ruzalar', value: stats.lectures ?? 0, description: 'Auto-scanned PDF resources', icon: FiFileText },
    { title: 'Amaliy mashg‘ulotlar', value: stats.practicals ?? 0, description: 'Hands-on materials', icon: FiBook },
    { title: 'Testlar', value: stats.tests ?? 0, description: 'Interactive assessments', icon: FiPieChart },
    { title: 'Kitoblar', value: stats.books ?? 0, description: 'Recommended reading', icon: FiUsers },
  ];

  return (
    <section className="container-shell py-20">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}

export default StatsSection;
