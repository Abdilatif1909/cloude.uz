import { motion } from 'framer-motion';

function StatCard({ title, value, description, icon: Icon }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="glass rounded-3xl p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="mt-3 text-3xl font-bold">{value}</h3>
          {description ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
        </div>
        {Icon ? (
          <div className="rounded-2xl bg-gradient-to-r from-violet-600/20 to-cyan-500/20 p-3 text-xl text-violet-500">
            <Icon />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

export default StatCard;
