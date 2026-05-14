import { AnimatePresence, motion } from 'framer-motion';
import { FiDownload, FiX } from 'react-icons/fi';

function PdfViewerModal({ item, open, onClose, onDownload }) {
  const pdfUrl = item?.pdf_url || item?.file_url || item?.download_url;
  const downloadUrl = item?.download_url || pdfUrl;

  return (
    <AnimatePresence>
      {open && item ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="glass-panel relative flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem]"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#9ec0ff]">PDF ko‘ruvchi</p>
                <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                {downloadUrl ? (
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => onDownload?.(item)}
                    className="glass-button rounded-2xl px-4 py-2 text-sm font-semibold"
                  >
                    <span className="inline-flex items-center gap-2"><FiDownload /> Yuklab olish</span>
                  </a>
                ) : null}
                <button type="button" onClick={onClose} className="glass-button rounded-2xl p-3">
                  <FiX />
                </button>
              </div>
            </div>
            {pdfUrl ? (
              <iframe src={pdfUrl} title={item.title} className="h-full w-full bg-white" />
            ) : (
              <div className="flex h-full items-center justify-center bg-white text-slate-500">
                PDF URL topilmadi.
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default PdfViewerModal;
