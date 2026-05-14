import { motion } from 'framer-motion';
import { FiDownload, FiEye, FiFileText } from 'react-icons/fi';

function PdfCard({ item, type, onPreview, onDownload }) {
  const pdfUrl = item.pdf_url || item.file_url || item.download_url;
  const downloadUrl = item.download_url || pdfUrl;
  const fileName = item.file_name || item.source_path?.split(/[\\/]/).pop() || pdfUrl?.split('/').pop() || 'PDF file';

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
      <p className="mt-2 text-sm text-[#64748b]">{fileName}</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => onPreview(item)} disabled={!pdfUrl} className="glass-button rounded-2xl px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50">
          <span className="inline-flex items-center gap-2"><FiEye /> Ko‘rish</span>
        </button>
        {downloadUrl ? (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => onDownload?.(item)}
            className="brand-primary rounded-2xl px-4 py-3 text-center text-sm font-semibold"
          >
            <span className="inline-flex items-center gap-2"><FiDownload /> Yuklab olish</span>
          </a>
        ) : (
          <button type="button" disabled className="brand-primary rounded-2xl px-4 py-3 text-center text-sm font-semibold opacity-50">
            <span className="inline-flex items-center gap-2"><FiDownload /> Yuklab olish</span>
          </button>
        )}
      </div>
    </motion.article>
  );
}

export default PdfCard;
