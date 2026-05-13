import { useEffect, useMemo, useState } from 'react';

import PdfCard from '../components/PdfCard';
import PdfViewerModal from '../components/PdfViewerModal';
import SearchBar from '../components/SearchBar';
import SectionHeading from '../components/shared/SectionHeading';
import EmptyState from '../components/shared/EmptyState';
import { contentService } from '../services/contentService';
import { normalizePaginated } from '../utils/format';
import { downloadStorage } from '../utils/storage';

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    contentService.getBooks().then((data) => setBooks(normalizePaginated(data)));
  }, []);

  const filteredBooks = useMemo(
    () => books.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())),
    [books, query]
  );

  return (
    <section className="container-shell py-10">
      <SectionHeading eyebrow="Books" title="Kitob PDF kutubxonasi" description="Kitoblar lectures sahifasidagidek preview, ko‘rish va yuklab olish funksiyasi bilan chiqariladi." />
      <div className="mt-8 max-w-xl">
        <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} onSubmit={(e) => e.preventDefault()} placeholder="Kitob qidirish" />
      </div>
      {filteredBooks.length === 0 ? (
        <div className="mt-8"><EmptyState title="Kitob topilmadi" description="Qidiruvni o‘zgartirib qayta urinib ko‘ring yoki backendga kitoblarni import qiling." /></div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredBooks.map((item) => (
            <PdfCard
              key={item.id}
              item={item}
              type="Book"
              onPreview={setActiveItem}
              onDownload={(pdf) => downloadStorage.trackDownload({ ...pdf, type: 'book' })}
            />
          ))}
        </div>
      )}
      <PdfViewerModal
        item={activeItem}
        open={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
        onDownload={(pdf) => downloadStorage.trackDownload({ ...pdf, type: 'book' })}
      />
    </section>
  );
}

export default BooksPage;
