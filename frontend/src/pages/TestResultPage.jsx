import { useEffect, useState } from 'react';
import { FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import EmptyState from '../components/shared/EmptyState';
import ResultSummary from '../components/tests/ResultSummary';
import { useAuth } from '../contexts/AuthContext';
import { testService } from '../services/testService';
import { testResultStorage } from '../utils/storage';

function TestResultPage() {
  const { resultId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [result, setResult] = useState(location.state?.result || testResultStorage.getResult(resultId));
  const [loading, setLoading] = useState(!location.state?.result && !testResultStorage.getResult(resultId));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    if (result) return;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await testService.getResultById(resultId);
        setResult(data);
        testResultStorage.setResult(resultId, data);
      } catch {
        setError('Natija topilmadi yoki sizda unga kirish huquqi yo‘q.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate, result, resultId, user]);

  if (loading) {
    return (
      <section className="container-shell py-10">
        <div className="glass-panel animate-pulse rounded-[2rem] p-8">
          <div className="h-12 w-1/2 rounded-full bg-[#e8eef7]" />
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 rounded-3xl bg-[#eef3f9]" />
            ))}
          </div>
          <div className="mt-8 h-80 rounded-[2rem] bg-[#eef3f9]" />
        </div>
      </section>
    );
  }

  if (error || !result) {
    return (
      <section className="container-shell py-10">
        <EmptyState title="Natija topilmadi" description={error || 'Test natijasi mavjud emas.'} />
      </section>
    );
  }

  return (
    <section className="container-shell py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/tests" className="glass-button inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold">
          <FiArrowLeft /> Barcha testlarga qaytish
        </Link>
        {user?.role === 'student' ? (
          <Link to={`/tests/session/${result.test}`} className="brand-primary inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold">
            Qayta ishlash <FiRefreshCw />
          </Link>
        ) : null}
      </div>

      <ResultSummary result={result} />
    </section>
  );
}

export default TestResultPage;
