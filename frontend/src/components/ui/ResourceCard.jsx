import { motion } from 'framer-motion';
import { FiDownload, FiEye, FiFileText } from 'react-icons/fi';

function ResourceCard({ item, onView }) {
  return (
    <motion.article whileHover={{ y: -6 }} className="glass rounded-3xl p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600/20 to-cyan-500/20 text-2xl text-violet-500">
          <FiFileText />
        </div>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white dark:bg-white dark:text-slate-900">
          PDF
        </span>
      </div>
      <h3 className="mt-5 line-clamp-2 text-lg font-semibold">{item.title}</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.file_name}</p>
      <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">{item.size_kb} KB</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onView(item)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
        >
          <FiEye /> Ko‘rish
        </button>
        <a
          href={item.download_url}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white"
        >
          <FiDownload /> Yuklab olish
        </a>
      </div>
    </motion.article>
  );
}

export default ResourceCard;
