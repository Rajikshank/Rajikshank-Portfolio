import { GraduationCap } from "lucide-react";
import { education } from "../data/portfolio";
import { SectionHeading } from "./SectionHeading";

const Education = () => {
  return (
    <section className="motion-section scroll-mt-24">
      <SectionHeading
        eyebrow="Education"
        title="Software engineering foundation."
        summary="Formal software engineering study, paired with product building and modern full-stack practice."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {education.map((item) => (
          <article
            key={item.title}
            className="motion-item rounded-lg border border-white/10 bg-white/[0.035] p-6"
          >
            <div className="mb-8 inline-flex h-11 w-11 items-center justify-center rounded-md border border-amber-300/25 bg-amber-300/10 text-amber-200">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-stone-100">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-stone-400">{item.institute}</p>
            <p className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-orange-200">
              {item.period}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Education;
