import { useEffect, useMemo, useState } from 'react';
import { FiArrowRight, FiCheckCircle, FiPlayCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { downloadStorage } from '../utils/storage';
import { countPaginated, normalizePaginated } from '../utils/format';
import { contentService } from '../services/contentService';
import { testService } from '../services/testService';
import FeatureSection from '../components/home/FeatureSection';
import HeroSection from '../components/home/HeroSection';
import PreviewSection from '../components/home/PreviewSection';
import SectionHeading from '../components/shared/SectionHeading';

function HomePage() {
  const [stats, setStats] = useState({ lectures: 0, practicals: 0, tests: 0, books: 0 });
  const [lectures, setLectures] = useState([]);
  const [practicals, setPracticals] = useState([]);

  useEffect(() => {
    Promise.all([
      contentService.getLectures(),
      contentService.getPracticals(),
      contentService.getBooks(),
      testService.getTests(),
    ]).then(([lectureData, practicalData, bookData, testData]) => {
      setLectures(normalizePaginated(lectureData).slice(0, 3));
      setPracticals(normalizePaginated(practicalData).slice(0, 3));
      setStats({
        lectures: countPaginated(lectureData),
        practicals: countPaginated(practicalData),
        books: countPaginated(bookData),
        tests: countPaginated(testData),
      });
    });
  }, []);

  const highlights = useMemo(
    () => [
      'JWT authentication + protected routes',
      'Responsive education-focused dashboard',
      'Automatic PDF library integration',
    ],
    []
  );

  return (
    <div className="space-y-8">
      <HeroSection stats={stats} />
      <FeatureSection />

      <section className="container-shell py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="glass-panel rounded-[2rem] p-8 sm:p-10">
            <SectionHeading
              eyebrow="Fan imkoniyatlari"
              title="Web dasturlashni bosqichma-bosqich va amaliy ko‘rinishda o‘rganing"
              description="Platforma nazariya, amaliy topshiriqlar, testlar va role-based analytics orqali o‘quv jarayonini yagona ekotizimga birlashtiradi."
            />
            <div className="mt-8 grid gap-4">
              {highlights.map((item) => (
                <div key={item} className="glass-button flex items-center gap-3 rounded-2xl px-4 py-4 text-sm font-medium">
                  <FiCheckCircle className="text-[#2563eb]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="brand-dark-panel overflow-hidden rounded-[2rem] p-8 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/72">Education platform UI</p>
            <h3 className="mt-4 text-3xl font-black tracking-tight">Zamonaviy, responsive va animatsiyalangan learning experience</h3>
            <p className="mt-4 text-sm leading-7 text-white/75">
              Mobile, tablet va desktop uchun optimallashtirilgan interfeys. Glassmorphism, gradientlar va Framer Motion bilan premium ko‘rinish.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/tests" className="rounded-2xl bg-white px-5 py-3 font-semibold text-[#0f172a]">
                Testlarni ishlash
              </Link>
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 font-semibold text-white">
                Dashboard <FiArrowRight />
              </Link>
            </div>
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
              <div className="flex items-center gap-3 text-sm text-white/85">
                <FiPlayCircle /> Live PDF preview, upload management va analytics tayyor.
              </div>
            </div>
          </div>
        </div>
      </section>

      <PreviewSection
        title="Lecture library preview"
        description="Backend API dan olingan lecture materiallar card ko‘rinishida, preview va download bilan." 
        items={lectures}
        type="Lecture"
        onTrackDownload={(item) => downloadStorage.trackDownload({ ...item, type: 'lecture' })}
      />

      <PreviewSection
        title="Practical library preview"
        description="Amaliy mashg‘ulotlar uchun PDF kolleksiya, zamonaviy modal viewer bilan." 
        items={practicals}
        type="Practical"
        onTrackDownload={(item) => downloadStorage.trackDownload({ ...item, type: 'practical' })}
      />

      <section className="container-shell py-14">
        <div className="brand-dark-panel overflow-hidden rounded-[2rem] p-8 sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/75">CTA</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Web dasturlash fanini bugundan professional tarzda o‘rganishni boshlang.</h2>
              <p className="mt-4 max-w-2xl text-white/80">
                Student, teacher va admin uchun alohida flow, test results va learning resources bitta joyda.
              </p>
            </div>
            <Link to="/register" className="rounded-2xl bg-white px-6 py-4 text-center font-semibold text-[#0f172a]">
              Platformaga qo‘shilish
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
