import { useEffect, useMemo, useState } from 'react';
import { FiArrowRight, FiShield, FiZap } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

import SearchBar from '../components/SearchBar';
import SectionHeading from '../components/shared/SectionHeading';
import EmptyState from '../components/shared/EmptyState';
import TestCard from '../components/tests/TestCard';
import TestStatsCards from '../components/tests/TestStatsCards';
import { useAuth } from '../contexts/AuthContext';
import { testService } from '../services/testService';
import { countPaginated, normalizePaginated } from '../utils/format';
import { testSessionStorage } from '../utils/storage';

function TestsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [testsData, resultsData] = await Promise.all([
          testService.getTests(),
          isAuthenticated && user?.role === 'student' ? testService.getResults() : Promise.resolve([]),
        ]);
        setTests(normalizePaginated(testsData));
        setResults(normalizePaginated(resultsData));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isAuthenticated, user?.role]);

  const filteredTests = useMemo(
    () => tests.filter((item) => item.title.toLowerCase().includes(search.toLowerCase())),
    [tests, search]
  );

  const stats = useMemo(() => {
    const totalQuestionCount = tests.reduce((sum, item) => sum + (item.question_count || 0), 0);
    const averageScore = results.length
      ? (results.reduce((sum, item) => sum + item.score, 0) / results.length).toFixed(1)
      : '0.0';

    return [
      { title: 'Available tests', value: countPaginated(tests), subtitle: 'Professional assessment modules' },
      { title: 'Question bank', value: totalQuestionCount, subtitle: 'Step-by-step learning checkpoints' },
      { title: 'My attempts', value: results.length, subtitle: 'Saved student submissions' },
      { title: 'Average score', value: averageScore, subtitle: 'Across completed tests' },
    ];
  }, [results, tests]);

  const getProgressLabel = (testId) => {
    const draft = testSessionStorage.getSession(testId);
    if (draft?.answers && Object.keys(draft.answers).length) {
      return `${Object.keys(draft.answers).length} ta javob saqlangan`;
    }
    const completed = results.find((item) => item.test === testId);
    if (completed) {
      return `${completed.score}/${completed.total_questions} yakunlangan`;
    }
    return 'Ready to start';
  };

  const handlePrimaryAction = (testId) => {
    if (user?.role === 'teacher' || user?.role === 'admin') {
      navigate('/teacher/tests');
      return;
    }

    navigate(`/tests/session/${testId}`);
  };

  return (
    <section className="container-shell py-10">
      <div className="brand-dark-panel overflow-hidden rounded-[2rem] p-8 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-eyebrow !text-white/75">Professional test module</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">Talabalar uchun interaktiv test sessiyalari, teacher uchun analytics.</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-white/80 sm:text-lg">
              Bosqichma-bosqich test flow, autosave, timer, elegant cards va completion analytics bilan zamonaviy education SaaS tajribasi.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/80">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2"><FiShield /> JWT protected</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2"><FiZap /> Glassmorphism UX</span>
            </div>
          </div>
          {(user?.role === 'teacher' || user?.role === 'admin') ? (
            <Link to="/teacher/tests" className="rounded-2xl bg-white px-6 py-4 font-semibold text-[#0f172a] shadow-lg">
              Teacher analytics <FiArrowRight className="ml-2 inline-flex" />
            </Link>
          ) : null}
        </div>
      </div>

      <div className="mt-8">
        <TestStatsCards items={stats} />
      </div>

      <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Available tests"
          title="Mavjud testlar"
          description="Har bir test 15 bosqichlik card-based session, progress tracker va natija tahlili bilan ishlaydi."
        />
        <div className="w-full max-w-xl">
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} onSubmit={(e) => e.preventDefault()} placeholder="Test nomi bo‘yicha qidiring" />
        </div>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="glass-panel animate-pulse rounded-[2rem] p-6">
              <div className="h-12 w-12 rounded-2xl bg-[#e8eef7]" />
              <div className="mt-5 h-6 w-2/3 rounded-full bg-[#e8eef7]" />
              <div className="mt-3 h-4 w-full rounded-full bg-[#eef3f9]" />
              <div className="mt-2 h-4 w-4/5 rounded-full bg-[#eef3f9]" />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="h-20 rounded-2xl bg-[#eef3f9]" />
                <div className="h-20 rounded-2xl bg-[#eef3f9]" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="Test topilmadi" description="Qidiruvni o‘zgartirib qayta urinib ko‘ring yoki teacher tomonidan yangi test yaratilishini kuting." />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredTests.map((test) => (
            <TestCard
              key={test.id}
              test={test}
              progressLabel={getProgressLabel(test.id)}
              actionLabel={user?.role === 'teacher' || user?.role === 'admin' ? 'Teacher panel' : 'Testni boshlash'}
              onStart={() => handlePrimaryAction(test.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default TestsPage;
