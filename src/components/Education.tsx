
import { TextScramble } from "../lib/useScramble";

const education = [
  {
    Title: "Bsc(Hons) Software engineering",
    Period: "2021-2025",
    institute: "Sri Lanka Technological Campus",
  },
];

function EducationElement({
  Title,
  Period,
  institute,
 
}: {
  Title: string;
  Period: string;
  institute: string;
 
}) {
  return (
    <div>
      <h1 className="text-gray-200">{Title}</h1>
      <h3 className="text-md text-gray-400 mt-2">
        {institute} - ({Period})
      </h3>
    </div>
  );
}

const Education = () => {
  return (
    <div className="font-Intel my-20">
              <TextScramble speed={0.40} text='Education' textsize='text-lg' font="font-Intel"/>
      {/* <h1 className="text-orange-500  font-semibold text-lg">Education</h1> */}

      <div className="px-2 mt-4 flex flex-col gap-14">
        {education.map((item, idx) => (
          <EducationElement
            key={idx}
            Period={item.Period}
            Title={item.Title}
            institute={item.institute}
          />
        ))}
      </div>

      <div className="px-2 mt-4 flex flex-col gap-14"></div>
    </div>
  );
};

export default Education;
