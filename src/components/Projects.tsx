import { ArrowUpRight } from "lucide-react";
import { projects } from "../data/portfolio";
import { SectionHeading } from "./SectionHeading";
import { TechLogo } from "./TechLogo";

export const Projects = () => {
  return (
    <section id="projects" className="section reveal-section">
      <SectionHeading
        index="03"
        title="Selected work"
        note="Three projects from the last year — what they do, and how they're built."
      />

      <div className="entry-list">
        {projects.map((project) => (
          <article key={project.title} className="entry reveal-item">
            <div className="entry-head">
              <h3>{project.title}</h3>
              <span>{project.subtitle}</span>
            </div>
            <p>{project.description}</p>
            <div className="entry-links">
              {project.live ? (
                <a href={project.live} target="_blank" rel="noreferrer">
                  Live
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              ) : null}
              {project.github ? (
                <a href={project.github} target="_blank" rel="noreferrer">
                  Source
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              ) : null}
            </div>
            <div className="entry-tech">
              {project.logos.map((logo, index) => (
                <span key={`${project.title}-${logo}`}>
                  <TechLogo slug={logo} label={project.technology[index]} />
                  {project.technology[index]}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
