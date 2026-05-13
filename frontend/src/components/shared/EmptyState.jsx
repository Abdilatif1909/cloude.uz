function EmptyState({ title, description }) {
  return (
    <div className="glass-panel rounded-3xl p-8 text-center">
      <h3 className="text-xl font-semibold text-[#0f172a]">{title}</h3>
      <p className="mt-3 text-sm text-[#64748b]">{description}</p>
    </div>
  );
}

export default EmptyState;
