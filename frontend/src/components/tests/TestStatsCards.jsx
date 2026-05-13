import { FiActivity, FiClock, FiLayers, FiTrendingUp } from 'react-icons/fi';

import DashboardCard from '../DashboardCard';

function TestStatsCards({ items }) {
  const icons = [FiLayers, FiTrendingUp, FiClock, FiActivity];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <DashboardCard
          key={item.title}
          title={item.title}
          value={item.value}
          subtitle={item.subtitle}
          icon={icons[index % icons.length]}
        />
      ))}
    </div>
  );
}

export default TestStatsCards;
