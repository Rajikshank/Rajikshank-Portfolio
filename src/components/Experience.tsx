import { BriefcaseBusiness } from "lucide-react";
import { experiences } from "../data/portfolio";
import { SectionHeading } from "./SectionHeading";

const Experience = () => {
  return (
    <section id="experience" className="motion-section scroll-mt-24">
      <SectionHeading
        eyebrow="Experience"
        title="Real product work, not resume filler."
        summary="A concise view of the professional work behind the stack, with the emphasis on practical delivery."
      />

      <div className="relative border-l border-white/10 pl-6">
        {experiences.map((item) => (
          <article key={`${item.organization}-${item.period}`} className="motion-item relative pb-2">
            <div className="absolute -left-[2.45rem] top-0 flex h-8 w-8 items-center justify-center rounded-full border border-amber-300/40 bg-black text-amber-200">
              <BriefcaseBusiness className="h-4 w-4" />
            </div>
            <div className="retro-panel rounded-lg p-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-stone-100">{item.position}</h3>
                  <p className="mt-1 font-mono text-sm text-stone-400">{item.organization}</p>
                </div>
                <span className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-xs text-amber-200">
                  {item.period}
                </span>
              </div>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-stone-300 md:text-base">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Experience;
