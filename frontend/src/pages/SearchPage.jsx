import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import SearchBar from '../components/SearchBar';
import EmptyState from '../components/shared/EmptyState';
import SectionHeading from '../components/shared/SectionHeading';
import { useDebounce } from '../hooks/useDebounce';
import { searchService } from '../services/searchService';

function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [results, setResults] = useState(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(null);
      return;
    }

    setParams({ q: debouncedQuery });

    searchService.search(debouncedQuery).then(setResults);
  }, [debouncedQuery, setParams]);

  const groups = results?.results || {};

  const total = Object.values(groups).reduce(
    (sum, items) => sum + (items?.length || 0),
    0
  );

  return (
    <section className="container-shell py-10">
      <SectionHeading
        eyebrow="Realtime search"
        title="Lecture, practical va books bo‘ylab qidiring"
        description="Debounced va real-time qidiruv service layer orqali ishlaydi."
      />

      <div className="mt-8 max-w-2xl">
        <SearchBar
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onSubmit={(e) => e.preventDefault()}
          placeholder="Kalit so‘z kiriting"
        />
      </div>

      {results && total === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Natija topilmadi"
            description="Boshqa kalit so‘z bilan yana urinib ko‘ring."
          />
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {['lectures', 'practicals', 'books'].map((key) => (
          <div
            key={key}
            className="glass-panel rounded-3xl p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-card-title capitalize">
                {key}
              </h3>

              <span className="brand-badge">
                {(groups[key] || []).length}
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {(groups[key] || []).length === 0 ? (
                <div className="soft-card-subtle">
                  <p className="text-muted text-sm">
                    No results found
                  </p>
                </div>
              ) : (
                groups[key].map((item) => (
                  <div
                    key={`${key}-${item.id}`}
                    className="soft-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(15,23,42,0.05)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-body font-semibold leading-relaxed text-heading">
                          {item.title}
                        </p>

                        <p className="text-muted mt-2 text-sm leading-relaxed">
                          {item.author ||
                            item.file_url?.split('/').pop() ||
                            'Material'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SearchPage;