import { motion } from 'framer-motion';

function StatsCard({ icon: Icon, label, value, description }) {
  return (
    <motion.div whileHover={{ y: -6 }} className="glass-panel rounded-3xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-muted">{label}</p>
          <h3 className="mt-3 text-[2rem] font-extrabold leading-none tracking-[-0.03em] text-[var(--color-heading)]">{value}</h3>
          {description ? <p className="text-muted mt-2">{description}</p> : null}
        </div>
        {Icon ? <div className="icon-chip"><Icon /></div> : null}
      </div>
    </motion.div>
  );
}

export default StatsCard;
