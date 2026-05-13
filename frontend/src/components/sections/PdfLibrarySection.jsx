import { useEffect, useState } from 'react';

import api from '../../api/client';
import EmptyState from '../ui/EmptyState';
import ResourceCard from '../ui/ResourceCard';
import SectionTitle from '../ui/SectionTitle';

function PdfLibrarySection({ endpoint, title, description, compact = false }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get(endpoint)
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data.results || [];
        setItems(compact ? list.slice(0, 6) : list);
        setSelected((prev) => prev || list[0] || null);
      })
      .finally(() => setLoading(false));
  }, [endpoint, compact]);

  return (
    <section className={compact ? 'container-shell py-20' : 'container-shell py-10'}>
      <SectionTitle eyebrow="PDF Library" title={title} description={description} />

      {loading ? (
        <div className="mt-8 text-sm text-slate-500">Yuklanmoqda...</div>
      ) : items.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="Material topilmadi" description="Hozircha bu bo‘limda PDF mavjud emas." />
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <ResourceCard key={`${endpoint}-${item.file_name}`} item={item} onView={setSelected} />
            ))}
          </div>
          <div className="glass rounded-3xl p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Inline preview</p>
                <h3 className="text-xl font-semibold">{selected?.title || 'Tanlangan PDF'}</h3>
              </div>
              {selected?.download_url ? (
                <a href={selected.download_url} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
                  Yuklab olish
                </a>
              ) : null}
            </div>
            {selected?.view_url ? (
              <iframe
                src={selected.view_url}
                title={selected.title}
                className="h-[520px] w-full rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900"
              />
            ) : (
              <EmptyState title="PDF tanlanmagan" description="Chap tomondagi kartalardan birini tanlang." />
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default PdfLibrarySection;
