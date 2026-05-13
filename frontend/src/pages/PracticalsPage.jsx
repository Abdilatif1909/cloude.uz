import { useEffect, useMemo, useState } from 'react';

import PdfCard from '../components/PdfCard';
import PdfViewerModal from '../components/PdfViewerModal';
import SearchBar from '../components/SearchBar';
import SectionHeading from '../components/shared/SectionHeading';
import EmptyState from '../components/shared/EmptyState';
import { contentService } from '../services/contentService';
import { normalizePaginated } from '../utils/format';
import { downloadStorage } from '../utils/storage';

function PracticalsPage() {
  const [practicals, setPracticals] = useState([]);
  const [query, setQuery] = useState('');
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    contentService.getPracticals().then((data) => setPracticals(normalizePaginated(data)));
  }, []);

  const filtered = useMemo(
    () => practicals.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())),
    [practicals, query]
  );

  return (
    <section className="container-shell py-10">
      <SectionHeading eyebrow="Practicals" title="Amaliy mashg‘ulotlar PDF bo‘limi" description="Lecture sahifasi bilan bir xil professional dizayn, iframe viewer va download flow bilan." />
      <div className="mt-8 max-w-xl">
        <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} onSubmit={(e) => e.preventDefault()} placeholder="Amaliy mashg‘ulot qidirish" />
      </div>
      {filtered.length === 0 ? (
        <div className="mt-8"><EmptyState title="Amaliy material topilmadi" description="Qidiruv yoki import qilingan fayllarni tekshiring." /></div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <PdfCard
              key={item.id}
              item={item}
              type="Practical"
              onPreview={setActiveItem}
              onDownload={(pdf) => downloadStorage.trackDownload({ ...pdf, type: 'practical' })}
            />
          ))}
        </div>
      )}
      <PdfViewerModal
        item={activeItem}
        open={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
        onDownload={(pdf) => downloadStorage.trackDownload({ ...pdf, type: 'practical' })}
      />
    </section>
  );
}

export default PracticalsPage;
