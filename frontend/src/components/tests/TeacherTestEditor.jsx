import { useEffect, useMemo, useState } from 'react';
import { FiCheckCircle, FiEdit3, FiPlusCircle, FiSave, FiTrash2 } from 'react-icons/fi';

import { testService } from '../../services/testService';

const emptyTestForm = {
  title: '',
  description: '',
  difficulty: 'intermediate',
  estimated_time: 15,
};

const emptyQuestionForm = {
  question: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_answer: 'A',
};

function TeacherTestEditor({ test, loading, onSaved, onDeleted }) {
  const [testForm, setTestForm] = useState(emptyTestForm);
  const [questionForm, setQuestionForm] = useState(emptyQuestionForm);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [testError, setTestError] = useState('');
  const [questionError, setQuestionError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [savingTest, setSavingTest] = useState(false);
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [deletingTest, setDeletingTest] = useState(false);
  const [deletingQuestionId, setDeletingQuestionId] = useState(null);

  useEffect(() => {
    if (test) {
      setTestForm({
        title: test.title || '',
        description: test.description || '',
        difficulty: test.difficulty || 'intermediate',
        estimated_time: test.estimated_time || 15,
      });
    } else {
      setTestForm(emptyTestForm);
    }
    setQuestionForm(emptyQuestionForm);
    setEditingQuestionId(null);
    setTestError('');
    setQuestionError('');
    setSuccessMessage('');
  }, [test]);

  const questionCount = test?.questions?.length || 0;
  const isCreateMode = !test?.id;
  const questionTitle = editingQuestionId ? 'Savolni tahrirlash' : 'Yangi savol qo‘shish';

  const difficultyOptions = useMemo(
    () => [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
    ],
    []
  );

  const handleTestChange = (field, value) => {
    setTestForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (field, value) => {
    setQuestionForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetQuestionBuilder = () => {
    setQuestionForm(emptyQuestionForm);
    setEditingQuestionId(null);
    setQuestionError('');
  };

  const handleSubmitTest = async (event) => {
    event.preventDefault();
    setTestError('');
    setSuccessMessage('');

    if (!testForm.title.trim()) {
      setTestError('Test nomini kiriting.');
      return;
    }

    setSavingTest(true);
    try {
      const payload = {
        title: testForm.title.trim(),
        description: testForm.description.trim(),
        difficulty: testForm.difficulty,
        estimated_time: Number(testForm.estimated_time) || 15,
      };

      const saved = isCreateMode
        ? await testService.createTest(payload)
        : await testService.updateTest(test.id, payload);

      setSuccessMessage(isCreateMode ? 'Test yaratildi. Endi savollar qo‘shishingiz mumkin.' : 'Test ma’lumotlari yangilandi.');
      await onSaved(saved.id);
    } catch {
      setTestError('Testni saqlashda xatolik yuz berdi.');
    } finally {
      setSavingTest(false);
    }
  };

  const handleDeleteTest = async () => {
    if (!test?.id) return;
    const confirmed = window.confirm('Ushbu testni va unga tegishli barcha savollarni o‘chirmoqchimisiz?');
    if (!confirmed) return;

    setDeletingTest(true);
    setTestError('');
    setSuccessMessage('');
    try {
      await testService.deleteTest(test.id);
      await onDeleted(test.id);
    } catch {
      setTestError('Testni o‘chirishning imkoni bo‘lmadi.');
    } finally {
      setDeletingTest(false);
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestionId(question.id);
    setQuestionForm({
      question: question.question || '',
      option_a: question.option_a || '',
      option_b: question.option_b || '',
      option_c: question.option_c || '',
      option_d: question.option_d || '',
      correct_answer: question.correct_answer || 'A',
    });
    setQuestionError('');
    setSuccessMessage('');
  };

  const handleSubmitQuestion = async (event) => {
    event.preventDefault();
    if (!test?.id) {
      setQuestionError('Avval testni yaratib oling.');
      return;
    }

    const values = Object.values(questionForm).map((item) => String(item).trim());
    if (values.some((item) => !item)) {
      setQuestionError('Savol va barcha variantlarni to‘liq kiriting.');
      return;
    }

    setSavingQuestion(true);
    setQuestionError('');
    setSuccessMessage('');
    try {
      const payload = {
        ...questionForm,
        test: test.id,
      };

      if (editingQuestionId) {
        await testService.updateQuestion(editingQuestionId, payload);
      } else {
        await testService.createQuestion(payload);
      }

      resetQuestionBuilder();
      setSuccessMessage(editingQuestionId ? 'Savol yangilandi.' : 'Yangi savol qo‘shildi.');
      await onSaved(test.id);
    } catch {
      setQuestionError('Savolni saqlashda xatolik yuz berdi.');
    } finally {
      setSavingQuestion(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    const confirmed = window.confirm('Ushbu savolni o‘chirmoqchimisiz?');
    if (!confirmed) return;

    setDeletingQuestionId(questionId);
    setQuestionError('');
    setSuccessMessage('');
    try {
      await testService.deleteQuestion(questionId);
      await onSaved(test.id);
      if (editingQuestionId === questionId) {
        resetQuestionBuilder();
      }
      setSuccessMessage('Savol o‘chirildi.');
    } catch {
      setQuestionError('Savolni o‘chirishda xatolik yuz berdi.');
    } finally {
      setDeletingQuestionId(null);
    }
  };

  return (
    <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-eyebrow">Assessment editor</p>
          <h2 className="text-h3 mt-2">{isCreateMode ? 'Yangi test yaratish' : 'Testni tahrirlash'}</h2>
          <p className="text-muted mt-2">
            {isCreateMode
              ? 'Avval test metadata qismini saqlang, keyin question builder orqali savollar qo‘shing.'
              : `${questionCount} ta savol bilan professional assessmentni boshqaring.`}
          </p>
        </div>
        {!isCreateMode ? (
          <button
            type="button"
            onClick={handleDeleteTest}
            disabled={deletingTest}
            className="inline-flex items-center gap-2 rounded-2xl border border-[rgba(244,63,94,0.18)] bg-[#fff1f2] px-4 py-3 text-sm font-semibold text-[#be123c] transition hover:bg-[#ffe4e6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiTrash2 /> {deletingTest ? 'Deleting...' : 'Testni o‘chirish'}
          </button>
        ) : null}
      </div>

      <form onSubmit={handleSubmitTest} className="mt-6 grid gap-4 md:grid-cols-2">
        <input
          value={testForm.title}
          onChange={(event) => handleTestChange('title', event.target.value)}
          placeholder="Test nomi"
          className="input-shell md:col-span-2"
          required
        />
        <textarea
          value={testForm.description}
          onChange={(event) => handleTestChange('description', event.target.value)}
          rows={4}
          placeholder="Test description"
          className="input-shell md:col-span-2"
        />
        <select
          value={testForm.difficulty}
          onChange={(event) => handleTestChange('difficulty', event.target.value)}
          className="input-shell"
        >
          {difficultyOptions.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          max="180"
          value={testForm.estimated_time}
          onChange={(event) => handleTestChange('estimated_time', event.target.value)}
          placeholder="Estimated time"
          className="input-shell"
        />

        {testError ? <div className="md:col-span-2 rounded-2xl bg-[#fff1f2] px-4 py-3 text-sm font-medium text-[#be123c]">{testError}</div> : null}
        {successMessage ? (
          <div className="md:col-span-2 rounded-2xl bg-[#ecfdf5] px-4 py-3 text-sm font-medium text-[#15803d] inline-flex items-center gap-2">
            <FiCheckCircle /> {successMessage}
          </div>
        ) : null}

        <div className="md:col-span-2 flex flex-wrap gap-3">
          <button type="submit" disabled={savingTest} className="brand-primary inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70">
            <FiSave /> {savingTest ? 'Saving...' : isCreateMode ? 'Testni yaratish' : 'O‘zgarishlarni saqlash'}
          </button>
        </div>
      </form>

      <div className="mt-8 border-t border-[rgba(219,228,240,0.8)] pt-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-eyebrow">Question builder</p>
            <h3 className="text-h3 mt-2">{questionTitle}</h3>
            <p className="text-muted mt-2">4 variantli savollarni yaratish, edit qilish va to‘g‘ri javobni belgilash mumkin.</p>
          </div>
          {!isCreateMode ? (
            <div className="rounded-2xl bg-[#eff6ff] px-4 py-3 text-sm font-semibold text-[var(--color-link)]">
              {questionCount} ta savol
            </div>
          ) : null}
        </div>

        {isCreateMode ? (
          <div className="mt-5 rounded-3xl border border-dashed border-[rgba(219,228,240,0.8)] bg-white/70 px-6 py-8 text-center">
            <p className="text-card-title">Avval testni yarating</p>
            <p className="text-muted mt-2">Question builder test yaratilgandan keyin faollashadi.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            <form onSubmit={handleSubmitQuestion} className="space-y-4 rounded-[1.75rem] bg-[rgba(248,251,255,0.88)] p-5">
              <textarea
                value={questionForm.question}
                onChange={(event) => handleQuestionChange('question', event.target.value)}
                rows={4}
                placeholder="Savol matni"
                className="input-shell"
              />
              <div className="grid gap-3 md:grid-cols-2">
                <input value={questionForm.option_a} onChange={(event) => handleQuestionChange('option_a', event.target.value)} placeholder="Option A" className="input-shell" />
                <input value={questionForm.option_b} onChange={(event) => handleQuestionChange('option_b', event.target.value)} placeholder="Option B" className="input-shell" />
                <input value={questionForm.option_c} onChange={(event) => handleQuestionChange('option_c', event.target.value)} placeholder="Option C" className="input-shell" />
                <input value={questionForm.option_d} onChange={(event) => handleQuestionChange('option_d', event.target.value)} placeholder="Option D" className="input-shell" />
              </div>
              <select value={questionForm.correct_answer} onChange={(event) => handleQuestionChange('correct_answer', event.target.value)} className="input-shell">
                {['A', 'B', 'C', 'D'].map((item) => (
                  <option key={item} value={item}>Correct answer: {item}</option>
                ))}
              </select>

              {questionError ? <div className="rounded-2xl bg-[#fff1f2] px-4 py-3 text-sm font-medium text-[#be123c]">{questionError}</div> : null}

              <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={savingQuestion} className="brand-primary inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70">
                  {editingQuestionId ? <FiEdit3 /> : <FiPlusCircle />}
                  {savingQuestion ? 'Saving...' : editingQuestionId ? 'Savolni yangilash' : 'Savol qo‘shish'}
                </button>
                {editingQuestionId ? (
                  <button type="button" onClick={resetQuestionBuilder} className="glass-button inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold">
                    Bekor qilish
                  </button>
                ) : null}
              </div>
            </form>

            <div className="space-y-4">
              {(test.questions || []).length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[rgba(219,228,240,0.8)] bg-white/70 px-6 py-8 text-center">
                  <p className="text-card-title">Savollar hali qo‘shilmagan</p>
                  <p className="text-muted mt-2">Chap paneldan birinchi savolni yarating.</p>
                </div>
              ) : (
                (test.questions || []).map((item, index) => (
                  <div key={item.id} className="rounded-[1.75rem] bg-[rgba(248,251,255,0.92)] p-5 shadow-[inset_0_0_0_1px_rgba(219,228,240,0.65)]">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-muted">Question {index + 1}</p>
                        <h4 className="text-card-title mt-2">{item.question}</h4>
                      </div>
                      <span className="rounded-full bg-[#ecfdf5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#15803d]">
                        Correct: {item.correct_answer}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {['A', 'B', 'C', 'D'].map((key) => {
                        const field = `option_${key.toLowerCase()}`;
                        const isCorrect = item.correct_answer === key;
                        return (
                          <div key={key} className={`rounded-2xl px-4 py-3 text-sm ${isCorrect ? 'bg-[#ecfdf5] text-[#166534]' : 'bg-white text-[var(--color-body)]'}`}>
                            <span className="font-semibold">{key}:</span> {item[field]}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button type="button" onClick={() => handleEditQuestion(item)} className="glass-button inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold">
                        <FiEdit3 /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(item.id)}
                        disabled={deletingQuestionId === item.id}
                        className="inline-flex items-center gap-2 rounded-2xl border border-[rgba(244,63,94,0.18)] bg-[#fff1f2] px-4 py-3 text-sm font-semibold text-[#be123c] transition hover:bg-[#ffe4e6] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <FiTrash2 /> {deletingQuestionId === item.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {loading ? <div className="mt-6 rounded-3xl bg-[#eef3f9] p-8 text-center text-sm font-medium text-[var(--color-muted-text)]">Editor yuklanmoqda...</div> : null}
    </div>
  );
}

export default TeacherTestEditor;
