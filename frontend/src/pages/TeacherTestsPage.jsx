import { useEffect, useMemo, useState } from 'react';
import { FiArrowRight, FiBarChart2, FiClipboard, FiUsers } from 'react-icons/fi';
import { Link, Navigate } from 'react-router-dom';

import SearchBar from '../components/SearchBar';
import EmptyState from '../components/shared/EmptyState';
import SectionHeading from '../components/shared/SectionHeading';
import TeacherTestEditor from '../components/tests/TeacherTestEditor';
import TeacherTestLibrary from '../components/tests/TeacherTestLibrary';
import TeacherResultTable from '../components/tests/TeacherResultTable';
import TestStatsCards from '../components/tests/TestStatsCards';
import { useAuth } from '../contexts/AuthContext';
import { testService } from '../services/testService';
import { normalizePaginated } from '../utils/format';

function TeacherTestsPage() {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editorLoading, setEditorLoading] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    refreshOverview();
  }, []);

  useEffect(() => {
    if (!selectedTestId) {
      setSelectedTest(null);
      return;
    }

    const loadDetail = async () => {
      setEditorLoading(true);
      try {
        const detail = await testService.getTestById(selectedTestId);
        setSelectedTest(detail);
      } finally {
        setEditorLoading(false);
      }
    };

    loadDetail();
  }, [selectedTestId]);

  const refreshOverview = async (preferredSelectedId = selectedTestId) => {
    setLoading(true);
    try {
      const [testsData, resultsData] = await Promise.all([
        testService.getTests(),
        testService.getTeacherResults(),
      ]);
      const normalizedTests = normalizePaginated(testsData);
      const normalizedResults = normalizePaginated(resultsData);
      setTests(normalizedTests);
      setResults(normalizedResults);

      const fallbackId = normalizedTests[0]?.id || null;
      const resolvedId = preferredSelectedId && normalizedTests.some((item) => item.id === preferredSelectedId)
        ? preferredSelectedId
        : fallbackId;
      setSelectedTestId(resolvedId);
      if (!resolvedId) {
        setSelectedTest(null);
      }
      return resolvedId;
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedTestId(null);
    setSelectedTest(null);
    setEditorLoading(false);
  };

  const handleEditorSaved = async (testId) => {
    await refreshOverview(testId);
  };

  const handleEditorDeleted = async () => {
    await refreshOverview(null);
  };

  const filteredResults = useMemo(() => {
    const value = search.toLowerCase();
    if (!value) return results;
    return results.filter(
      (item) =>
        item.student_name?.toLowerCase().includes(value)
        || item.test_title?.toLowerCase().includes(value)
    );
  }, [results, search]);

  const stats = useMemo(() => {
    const averageScore = results.length
      ? (results.reduce((sum, item) => sum + (item.score || 0), 0) / results.length).toFixed(1)
      : '0.0';
    const averageCompletion = results.length
      ? Math.round(results.reduce((sum, item) => sum + (item.completion_percent || 0), 0) / results.length)
      : 0;
    const activeStudents = new Set(results.map((item) => item.student_name)).size;

    return [
      { title: 'Managed tests', value: tests.length, subtitle: 'Teacher-owned assessments' },
      { title: 'Student attempts', value: results.length, subtitle: 'Submitted test sessions' },
      { title: 'Average score', value: averageScore, subtitle: 'Across all attempts' },
      { title: 'Avg completion', value: `${averageCompletion}%`, subtitle: `${activeStudents} active students` },
    ];
  }, [results, tests.length]);

  const filteredTests = useMemo(() => {
    const value = search.toLowerCase();
    if (!value) return tests;
    return tests.filter(
      (item) => item.title?.toLowerCase().includes(value)
        || item.description?.toLowerCase().includes(value)
    );
  }, [search, tests]);

  if (user?.role !== 'teacher' && user?.role !== 'admin') {
    return <Navigate to="/tests" replace />;
  }

  return (
    <section className="container-shell py-10">
      <div className="space-y-8">
        <div className="brand-dark-panel rounded-[2rem] p-8 sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl">
              <p className="text-eyebrow !text-white/75">Teacher control center</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">Test analytics, student attempts va performance overview.</h1>
              <p className="mt-4 text-base leading-8 text-white/80 sm:text-lg">
                Bu sahifa teacher va admin uchun test moduli bo‘yicha yakuniy analytics paneli hisoblanadi.
              </p>
            </div>
            <Link to="/tests" className="rounded-2xl bg-white px-6 py-4 font-semibold text-[#0f172a] shadow-lg">
              Student view <FiArrowRight className="ml-2 inline-flex" />
            </Link>
          </div>
        </div>

        <TestStatsCards items={stats} />

        <div className="grid gap-6 xl:grid-cols-[0.4fr_1fr]">
          <div className="space-y-6">
            <TeacherTestLibrary
              tests={filteredTests}
              selectedTestId={selectedTestId}
              loading={loading}
              onSelect={setSelectedTestId}
              onCreateNew={handleCreateNew}
            />

            <div className="glass-panel rounded-[2rem] p-6">
              <div className="flex items-center gap-3">
                <div className="icon-chip"><FiBarChart2 /></div>
                <div>
                  <h2 className="text-h3">Insights</h2>
                  <p className="text-muted mt-1">Qisqa executive summary.</p>
                </div>
              </div>
              <div className="mt-5 space-y-4">
                <div className="soft-card rounded-3xl">
                  <p className="text-muted inline-flex items-center gap-2"><FiUsers /> Active learners</p>
                  <p className="mt-2 text-2xl font-bold text-[var(--color-heading)]">{new Set(results.map((item) => item.student_name)).size}</p>
                </div>
                <div className="soft-card rounded-3xl">
                  <p className="text-muted">Total submitted sessions</p>
                  <p className="mt-2 text-2xl font-bold text-[var(--color-heading)]">{results.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="Editor workspace"
                title="Create / edit test UI"
                description="Test metadata, difficulty, duration va question bank bitta professional workspace ichida boshqariladi."
              />
              <div className="w-full max-w-xl">
                <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} onSubmit={(e) => e.preventDefault()} placeholder="Test, description yoki natija bo‘yicha qidiring" />
              </div>
            </div>

            <TeacherTestEditor
              test={selectedTest}
              loading={editorLoading}
              onSaved={handleEditorSaved}
              onDeleted={handleEditorDeleted}
            />

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="Results database"
                title="Talabalar natijalari"
                description="Student yoki test nomi bo‘yicha qidirib, natijalarni tez tahlil qiling."
              />
            </div>

            {loading ? (
              <div className="glass-panel animate-pulse rounded-[2rem] p-8">
                <div className="h-8 w-52 rounded-full bg-[#e8eef7]" />
                <div className="mt-6 h-80 rounded-[2rem] bg-[#eef3f9]" />
              </div>
            ) : filteredResults.length === 0 ? (
              <EmptyState title="Natijalar topilmadi" description="Qidiruvni o‘zgartiring yoki talabalar test ishlashini kuting." />
            ) : (
              <TeacherResultTable results={filteredResults} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TeacherTestsPage;
