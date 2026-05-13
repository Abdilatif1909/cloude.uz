import { useEffect, useMemo, useState } from 'react';

import PdfCard from '../components/PdfCard';
import PdfViewerModal from '../components/PdfViewerModal';
import SearchBar from '../components/SearchBar';
import SectionHeading from '../components/shared/SectionHeading';
import EmptyState from '../components/shared/EmptyState';
import { contentService } from '../services/contentService';
import { normalizePaginated } from '../utils/format';
import { downloadStorage } from '../utils/storage';

function LecturesPage() {
  const [lectures, setLectures] = useState([]);
  const [query, setQuery] = useState('');
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    contentService.getLectures().then((data) => setLectures(normalizePaginated(data)));
  }, []);

  const filteredLectures = useMemo(
    () => lectures.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())),
    [lectures, query]
  );

  return (
    <section className="container-shell py-10">
      <SectionHeading eyebrow="Lectures" title="Lecture PDF kutubxonasi" description="Har bir lecture card, preview, ko‘rish va yuklab olish funksiyasi bilan taqdim etiladi." />
      <div className="mt-8 max-w-xl">
        <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} onSubmit={(e) => e.preventDefault()} placeholder="Lecture qidirish" />
      </div>
      {filteredLectures.length === 0 ? (
        <div className="mt-8"><EmptyState title="Lecture topilmadi" description="Qidiruvni o‘zgartirib qayta urinib ko‘ring." /></div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredLectures.map((item) => (
            <PdfCard
              key={item.id}
              item={item}
              type="Lecture"
              onPreview={setActiveItem}
              onDownload={(pdf) => downloadStorage.trackDownload({ ...pdf, type: 'lecture' })}
            />
          ))}
        </div>
      )}
      <PdfViewerModal
        item={activeItem}
        open={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
        onDownload={(pdf) => downloadStorage.trackDownload({ ...pdf, type: 'lecture' })}
      />
    </section>
  );
}

export default LecturesPage;
