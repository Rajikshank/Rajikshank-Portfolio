import { TextScramble } from "../lib/useScramble";

const experiences = [
  {
    position: "Intern Full Stack Developer",
    organization: "SPM Technologies(2025)",
    desc: "Contributed to the Saas Apps developed with Nextjs ,nestjs",
  },
];

function ExperienceElement({
  position,
  organization,
  desc,
}: {
  position: string;
  organization: string;
  desc: string;
}) {
  return (
    <div>
      <h1 className="text-gray-200">{position}</h1>
      <h3 className="text-md text-gray-400">{organization}</h3>
      <p className="text-gray-200">{desc}</p>
    </div>
  );
}

const Experience = () => {
  return (
    <div className="font-Intel my-20">
      <TextScramble
        speed={0.4}
        text="Experience"
        textsize="text-lg"
        font="font-Intel"
      />
      {/* <h1 className='text-orange-500  font-semibold text-lg'>Experience</h1> */}

      <div className="px-2 mt-4   lg:text-base text-sm">
        {experiences.map((item, idx) => (
          <ExperienceElement
            key={idx}
            desc={item.desc}
            organization={item.organization}
            position={item.position}
          />
        ))}
      </div>
    </div>
  );
};

export default Experience;
