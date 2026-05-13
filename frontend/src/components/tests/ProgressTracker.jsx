import { FiClock } from 'react-icons/fi';

import { formatDuration, toPercent } from '../../utils/format';

function ProgressTracker({ currentStep, totalSteps, answeredCount, elapsedSeconds }) {
  const progressPercent = toPercent(currentStep, totalSteps);

  return (
    <div className="glass-panel rounded-[2rem] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-eyebrow">Test progress</p>
          <h2 className="text-h3 mt-2">{currentStep} / {totalSteps} bosqich</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="soft-card rounded-2xl px-4 py-3">
            <p className="text-muted">Answered</p>
            <p className="mt-1 text-lg font-semibold text-[var(--color-heading)]">{answeredCount}/{totalSteps}</p>
          </div>
          <div className="soft-card rounded-2xl px-4 py-3">
            <p className="text-muted inline-flex items-center gap-2"><FiClock /> Timer</p>
            <p className="mt-1 text-lg font-semibold text-[var(--color-heading)]">{formatDuration(elapsedSeconds)}</p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="h-3 overflow-hidden rounded-full bg-[#e8eef7]">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#2563eb_0%,#0ea5a4_100%)] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-muted">
          <span>Start</span>
          <span>{progressPercent}% completed</span>
          <span>Finish</span>
        </div>
      </div>
    </div>
  );
}

export default ProgressTracker;
