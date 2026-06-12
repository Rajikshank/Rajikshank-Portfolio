type SectionHeadingProps = {
  index: string;
  title: string;
  note?: string;
};

export const SectionHeading = ({ index, title, note }: SectionHeadingProps) => {
  return (
    <div className="section-head reveal-item">
      <span className="section-index">{index}</span>
      <h2>{title}</h2>
      {note ? <p className="section-note">{note}</p> : null}
    </div>
  );
};
