import { Code2, Cpu, Layers3 } from "lucide-react";
import { principles, profile, stack } from "../data/portfolio";
import { SectionHeading } from "./SectionHeading";

const icons = [Layers3, Code2, Cpu];

const AboutMe = () => {
  return (
    <section id="about" className="motion-section scroll-mt-24">
      <SectionHeading
        eyebrow="Profile"
        title="Focused, fast, and product-minded."
        summary="The portfolio stays minimal, but the work surface is upgraded: clearer positioning, sharper project storytelling, and motion that earns its place."
      />

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="motion-item retro-panel rounded-lg p-6">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-amber-300">
            About
          </p>
          <p className="mt-5 text-lg leading-8 text-stone-200">{profile.intro}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Full Stack Developer", "Generative AI", "SaaS Builder"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 font-mono text-xs text-amber-100"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {principles.map((item, index) => {
            const Icon = icons[index] ?? Layers3;

            return (
              <div
                key={item.title}
                className="motion-item rounded-lg border border-white/10 bg-white/[0.035] p-5"
              >
                <div className="mb-8 inline-flex h-10 w-10 items-center justify-center rounded-md border border-orange-300/25 bg-orange-300/10 text-orange-200">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-stone-100">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-400">{item.body}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="motion-item mt-4 rounded-lg border border-white/10 bg-black/30 p-4">
        <div className="flex flex-wrap gap-2">
          {stack.map((item) => (
            <span
              key={item}
              className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-stone-300"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
