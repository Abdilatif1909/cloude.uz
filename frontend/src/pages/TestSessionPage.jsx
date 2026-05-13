import { useEffect, useMemo, useState } from 'react';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';

import EmptyState from '../components/shared/EmptyState';
import ProgressTracker from '../components/tests/ProgressTracker';
import QuestionCard from '../components/tests/QuestionCard';
import { useAuth } from '../contexts/AuthContext';
import { testService } from '../services/testService';
import { testResultStorage, testSessionStorage } from '../utils/storage';

function TestSessionPage() {
  const navigate = useNavigate();
  const { testId } = useParams();
  const { user } = useAuth();
  const [session, setSession] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'student') {
      navigate('/tests', { replace: true });
      return;
    }

    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await testService.getTestStart(testId);
        const draft = testSessionStorage.getSession(testId);
        setSession(data);
        setAnswers(draft?.answers || {});
        setCurrentIndex(draft?.currentIndex || 0);
        setElapsedSeconds(draft?.elapsedSeconds || 0);
      } catch {
        setError('Test session yuklanmadi. Keyinroq qayta urinib ko‘ring.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [navigate, testId, user?.role]);

  useEffect(() => {
    if (!session || isSubmitting) return undefined;

    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [session, isSubmitting]);

  useEffect(() => {
    if (!session) return;
    testSessionStorage.setSession(testId, {
      answers,
      currentIndex,
      elapsedSeconds,
      testTitle: session.title,
    });
  }, [answers, currentIndex, elapsedSeconds, session, testId]);

  const questions = session?.questions || [];
  const currentQuestion = questions[currentIndex];
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  const handleSelectAnswer = (value) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleSubmit = async () => {
    if (!session) return;
    setIsSubmitting(true);
    setError('');
    try {
      const result = await testService.submitTest(session.id, {
        answers: Object.entries(answers).map(([questionId, answer]) => ({ question_id: Number(questionId), answer })),
        elapsed_seconds: elapsedSeconds,
      });
      testResultStorage.setResult(result.id, result);
      testSessionStorage.clearSession(testId);
      navigate(`/tests/result/${result.id}`, { state: { result, test: session } });
    } catch {
      setError('Testni yuborishda xatolik yuz berdi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <section className="container-shell py-10">
        <div className="glass-panel animate-pulse rounded-[2rem] p-8">
          <div className="h-8 w-48 rounded-full bg-[#e8eef7]" />
          <div className="mt-6 h-5 w-72 rounded-full bg-[#eef3f9]" />
          <div className="mt-8 h-72 rounded-[2rem] bg-[#eef3f9]" />
        </div>
      </section>
    );
  }

  if (error && !session) {
    return (
      <section className="container-shell py-10">
        <EmptyState title="Test session topilmadi" description={error} />
      </section>
    );
  }

  if (!session || !currentQuestion) {
    return (
      <section className="container-shell py-10">
        <EmptyState title="Savollar topilmadi" description="Teacher tomonidan savollar qo‘shilgandan keyin yana urinib ko‘ring." />
      </section>
    );
  }

  return (
    <section className="container-shell py-10">
      <div className="space-y-6">
        <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-eyebrow">Student test session</p>
              <h1 className="text-h2 mt-3">{session.title}</h1>
              <p className="text-body mt-3 max-w-3xl">{session.description || 'Har bir savol alohida bosqichda chiqadi. Autosave, timer va progress bar orqali testni qulay tarzda yakunlang.'}</p>
            </div>
            <div className="soft-card rounded-2xl px-4 py-3">
              <p className="text-muted">Difficulty</p>
              <p className="mt-1 text-base font-semibold capitalize text-[var(--color-heading-3)]">{session.difficulty}</p>
            </div>
          </div>
        </div>

        <ProgressTracker
          currentStep={currentIndex + 1}
          totalSteps={questions.length}
          answeredCount={answeredCount}
          elapsedSeconds={elapsedSeconds}
        />

        {answeredCount > 0 ? (
          <div className="glass-panel flex flex-wrap items-center justify-between gap-3 rounded-3xl px-5 py-4">
            <p className="text-muted inline-flex items-center gap-2"><FiCheckCircle className="text-[#15803d]" /> Autosave faol. Javoblaringiz lokal saqlanmoqda.</p>
            <p className="text-muted">{answeredCount}/{questions.length} answered</p>
          </div>
        ) : (
          <div className="glass-panel rounded-3xl px-5 py-4">
            <p className="text-muted inline-flex items-center gap-2"><FiAlertCircle className="text-[var(--color-link)]" /> Savollar bo‘yicha oldinga va orqaga erkin o‘ting. Yakunda natija darhol hisoblanadi.</p>
          </div>
        )}

        {error ? <div className="rounded-3xl bg-[#fff1f2] px-5 py-4 text-sm font-medium text-[#be123c]">{error}</div> : null}

        <QuestionCard
          question={currentQuestion}
          index={currentIndex}
          total={questions.length}
          selectedAnswer={answers[currentQuestion.id]}
          onSelectAnswer={handleSelectAnswer}
          onPrev={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          onNext={() => setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))}
          canPrev={currentIndex > 0}
          canNext={currentIndex < questions.length - 1}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </section>
  );
}

export default TestSessionPage;
