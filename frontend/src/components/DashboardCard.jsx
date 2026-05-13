import { motion } from 'framer-motion';

function DashboardCard({ title, value, subtitle, icon: Icon }) {
  return (
    <motion.div whileHover={{ y: -5 }} className="glass-panel rounded-3xl p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-muted">{title}</p>
          <h3 className="mt-3 text-[1.75rem] font-bold leading-none tracking-[-0.025em] text-[var(--color-heading-2)]">{value}</h3>
          {subtitle ? <p className="text-muted mt-2">{subtitle}</p> : null}
        </div>
        {Icon ? <div className="icon-chip"><Icon /></div> : null}
      </div>
    </motion.div>
  );
}

export default DashboardCard;
