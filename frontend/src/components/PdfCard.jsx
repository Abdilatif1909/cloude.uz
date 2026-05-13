import { motion } from 'framer-motion';
import { FiDownload, FiEye, FiFileText } from 'react-icons/fi';

function PdfCard({ item, type, onPreview, onDownload }) {
  return (
    <motion.article whileHover={{ y: -6 }} className="glass-panel rounded-3xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="icon-chip text-xl">
          <FiFileText />
        </div>
        <span className="brand-badge">
          {type}
        </span>
      </div>
      <h3 className="mt-5 line-clamp-2 text-lg font-semibold leading-7 text-[#0f172a]">{item.title}</h3>
      <p className="mt-2 text-sm text-[#64748b]">{item.file_url?.split('/').pop() || 'PDF file'}</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => onPreview(item)} className="glass-button rounded-2xl px-4 py-3 text-sm font-semibold">
          <span className="inline-flex items-center gap-2"><FiEye /> Ko‘rish</span>
        </button>
        <a
          href={item.file_url}
          target="_blank"
          rel="noreferrer"
          onClick={() => onDownload?.(item)}
          className="brand-primary rounded-2xl px-4 py-3 text-center text-sm font-semibold"
        >
          <span className="inline-flex items-center gap-2"><FiDownload /> Yuklab olish</span>
        </a>
      </div>
    </motion.article>
  );
}

export default PdfCard;
