import { education } from "../data/portfolio";
import { SectionHeading } from "./SectionHeading";

export const Education = () => {
  return (
    <section id="education" className="section reveal-section">
      <SectionHeading index="05" title="Education" note="Where I studied, and what I left with." />

      <div className="entry-list">
        {education.map((item) => (
          <article key={item.title} className="entry reveal-item">
            <div className="entry-head">
              <h3>{item.title}</h3>
              <span>{item.period}</span>
            </div>
            <p className="entry-sub">{item.institute}</p>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
