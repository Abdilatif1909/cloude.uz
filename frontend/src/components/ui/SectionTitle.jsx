function SectionTitle({ eyebrow, title, description, align = 'left' }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">{eyebrow}</p> : null}
      <h2 className="section-title mt-4">{title}</h2>
      {description ? <p className="mt-4 text-base text-slate-600 dark:text-slate-400">{description}</p> : null}
    </div>
  );
}

export default SectionTitle;
