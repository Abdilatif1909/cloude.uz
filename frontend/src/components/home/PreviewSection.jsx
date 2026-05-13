import { useState } from 'react';

import PdfCard from '../PdfCard';
import PdfViewerModal from '../PdfViewerModal';
import SectionHeading from '../shared/SectionHeading';

function PreviewSection({ title, description, items, type, onTrackDownload }) {
  const [activeItem, setActiveItem] = useState(null);

  return (
    <section className="container-shell py-12">
      <SectionHeading eyebrow={type} title={title} description={description} />
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <PdfCard key={`${type}-${item.id}`} item={item} type={type} onPreview={setActiveItem} onDownload={onTrackDownload} />
        ))}
      </div>
      <PdfViewerModal item={activeItem} open={Boolean(activeItem)} onClose={() => setActiveItem(null)} onDownload={onTrackDownload} />
    </section>
  );
}

export default PreviewSection;
