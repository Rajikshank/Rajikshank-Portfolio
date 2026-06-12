import { skillGroups } from "../data/portfolio";
import { SectionHeading } from "./SectionHeading";
import { TechLogo } from "./TechLogo";

export const AboutMe = () => {
  return (
    <section id="stack" className="section reveal-section">
      <SectionHeading
        index="02"
        title="Stack"
        note="Tools I've actually shipped with — the ones I'd reach for on day one."
      />

      <div className="skills-grid">
        {skillGroups.map((group) => (
          <div key={group.title} className="skill-group reveal-item">
            <h3>{group.title}</h3>
            <div className="skill-chips">
              {group.items.map((item) => (
                <span key={item.name} className="skill-chip">
                  <TechLogo slug={item.logo} label={item.name} />
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
