type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  summary?: string;
};

export const SectionHeading = ({ eyebrow, title, summary }: SectionHeadingProps) => {
  return (
    <div className="gsap-reveal mb-8 flex flex-col gap-3 md:mb-10">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-amber-300">
        {eyebrow}
      </p>
      <div className="grid gap-4 md:grid-cols-[0.85fr_1fr] md:items-end">
        <h2 className="font-display text-3xl font-semibold text-stone-50 md:text-5xl">
          {title}
        </h2>
        {summary ? (
          <p className="max-w-2xl text-sm leading-7 text-stone-400 md:text-base">
            {summary}
          </p>
        ) : null}
      </div>
    </div>
  );
};
