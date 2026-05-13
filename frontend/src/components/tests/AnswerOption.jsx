function AnswerOption({ optionKey, label, selected, disabled, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(optionKey)}
      disabled={disabled}
      className={`w-full rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${
        selected
          ? 'border-[#2563eb] bg-[#eef4ff] shadow-[0_10px_24px_rgba(37,99,235,0.12)]'
          : 'border-[rgba(219,228,240,0.9)] bg-white/80 hover:border-[#93c5fd] hover:bg-[#f8fbff]'
      } ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${
            selected ? 'bg-[#2563eb] text-white' : 'bg-[#edf3f9] text-[var(--color-heading-3)]'
          }`}
        >
          {optionKey}
        </div>
        <p className="text-body flex-1">{label}</p>
      </div>
    </button>
  );
}

export default AnswerOption;
