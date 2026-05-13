import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

import AnswerOption from './AnswerOption';

function QuestionCard({ question, index, total, selectedAnswer, onSelectAnswer, onPrev, onNext, canPrev, canNext, onSubmit, isSubmitting }) {
  return (
    <div className="glass-panel mx-auto max-w-4xl rounded-[2rem] p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-eyebrow">Question {index + 1}</p>
          <h3 className="text-h2 mt-2 max-w-3xl">{question.question}</h3>
        </div>
        {selectedAnswer ? (
          <div className="brand-secondary inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold">
            <FiCheckCircle /> Javob tanlangan
          </div>
        ) : null}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.22 }}
          className="mt-8 grid gap-4"
        >
          {[
            ['A', question.option_a],
            ['B', question.option_b],
            ['C', question.option_c],
            ['D', question.option_d],
          ].map(([key, value]) => (
            <AnswerOption
              key={key}
              optionKey={key}
              label={value}
              selected={selectedAnswer === key}
              onSelect={onSelectAnswer}
              disabled={isSubmitting}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev || isSubmitting}
          className="glass-button inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiArrowLeft /> Previous
        </button>

        {index + 1 === total ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="brand-primary inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Submitting...' : 'Testni yakunlash'}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={!canNext || isSubmitting}
            className="brand-primary inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70"
          >
            Next <FiArrowRight />
          </button>
        )}
      </div>
    </div>
  );
}

export default QuestionCard;
