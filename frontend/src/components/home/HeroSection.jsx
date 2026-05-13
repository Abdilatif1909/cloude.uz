import { motion } from 'framer-motion';
import { FiArrowRight, FiBarChart2, FiBookOpen, FiFileText, FiShield } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import StatsCard from '../StatsCard';

function HeroSection({ stats }) {
  const items = [
    { label: 'Lectures', value: stats.lectures, description: 'Auto imported PDF materials', icon: FiFileText },
    { label: 'Practicals', value: stats.practicals, description: 'Hands-on laboratory resources', icon: FiBookOpen },
    { label: 'Tests', value: stats.tests, description: 'Interactive assessment modules', icon: FiBarChart2 },
    { label: 'Books', value: stats.books, description: 'Recommended reading collection', icon: FiShield },
  ];

  return (
    <section className="container-shell grid gap-10 pt-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
          <span className="brand-secondary inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]">
            React + Vite Education Platform
          </span>
          <h1 className="text-hero mt-6">
            Web dasturlash fanini <span className="gradient-text">zamonaviy</span> platformada o‘rganing.
          </h1>
          <p className="text-body-lg mt-6 max-w-2xl">
            Ma’ruzalar, amaliy mashg‘ulotlar, testlar, kitoblar, real-time qidiruv va role-based dashboard bilan to‘liq ta’lim muhitini yarating.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/register" className="brand-primary inline-flex items-center gap-2 rounded-2xl px-6 py-4 font-semibold">
              Boshlash <FiArrowRight />
            </Link>
            <Link to="/lectures" className="glass-button rounded-2xl px-6 py-4 font-semibold">
              Lecture kutubxonasini ochish
            </Link>
          </div>
        </motion.div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <StatsCard key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
}

export default HeroSection;
