function EmptyState({ title, description }) {
  return (
    <div className="glass rounded-3xl p-8 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}

export default EmptyState;
