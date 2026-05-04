import { ArrowUpRight, GitBranch, Globe, PlayCircle } from "lucide-react";
import { motion } from "motion/react";
import { projects } from "../data/portfolio";
import { SectionHeading } from "./SectionHeading";

function ProjectElement({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const actions = [
    { label: "Live", href: project.live, Icon: Globe },
    { label: "Code", href: project.github, Icon: GitBranch },
    { label: "Demo", href: project.demo, Icon: PlayCircle },
  ].filter((item) => item.href);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="project-card motion-item retro-panel grid overflow-hidden rounded-lg lg:grid-cols-[0.88fr_1.12fr]"
    >
      <div className="relative min-h-[240px] overflow-hidden border-b border-white/10 bg-stone-950 lg:border-b-0 lg:border-r">
        <img
          src={project.thumbnail}
          alt={`${project.title} project preview`}
          loading="lazy"
          decoding="async"
          className="h-full min-h-[240px] w-full object-cover transition duration-700 hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/55 px-3 py-1 font-mono text-xs uppercase tracking-[0.16em] text-stone-200 backdrop-blur">
          0{index + 1}
        </div>
      </div>

      <div className="relative z-10 flex flex-col justify-between p-6 md:p-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-orange-200">
            {project.subtitle}
          </p>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <h3 className="font-display text-3xl font-semibold text-stone-50 md:text-4xl">
              {project.title}
            </h3>
            <div className="flex gap-2">
              {actions.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${project.title} ${label}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-stone-300 transition hover:border-amber-300/60 hover:text-amber-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <p className="mt-5 text-sm leading-7 text-stone-300 md:text-base">
            {project.description}
          </p>
          <p className="mt-5 border-l border-amber-300/50 pl-4 text-sm leading-7 text-amber-100">
            {project.impact}
          </p>
        </div>

        <div className="mt-7 flex flex-wrap gap-2">
          {project.technology.map((item) => (
            <span
              key={item}
              className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-xs text-stone-300"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

const Projects = () => {
  return (
    <section id="projects" className="motion-section scroll-mt-24">
      <SectionHeading
        eyebrow="Selected Projects"
        title="Proof that the stack can carry product weight."
        summary="A sharper project section with context, impact, visuals, and direct action links. The screenshots stay visible because the work should be inspectable."
      />

      <div className="grid gap-5">
        {projects.map((project, index) => (
          <ProjectElement key={project.title} project={project} index={index} />
        ))}
      </div>

      <a
        href="https://github.com/Rajikshank"
        target="_blank"
        rel="noreferrer"
        className="spark-button motion-item mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-stone-100 transition hover:border-orange-300/60 hover:text-orange-100"
      >
        More on GitHub
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </section>
  );
};

export default Projects;
