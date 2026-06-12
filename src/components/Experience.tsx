import { experiences } from "../data/portfolio";
import { SectionHeading } from "./SectionHeading";

export const Experience = () => {
  return (
    <section id="experience" className="section reveal-section">
      <SectionHeading
        index="04"
        title="Experience"
        note="One focused training period, four shipped products."
      />

      <div className="entry-list">
        {experiences.map((item) => (
          <article key={item.organization} className="entry reveal-item">
            <div className="entry-head">
              <h3>{item.position}</h3>
              <span>{item.period}</span>
            </div>
            <p className="entry-sub">
              {item.organization} · {item.location}
            </p>
            <ul>
              {item.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
};
