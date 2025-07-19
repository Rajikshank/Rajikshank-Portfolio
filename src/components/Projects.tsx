import { Github, Globe, PlayCircle } from "lucide-react";

import { TextScramble } from "../lib/useScramble";

const projectsList = [
  {
    Title: "Resume Automation using Github Webhook",
    Technology: "Nextjs,Postgresql,Prisma,Gemini",
    Desc: `Developed a Resume Automation platform using github webhook api
            which generated Resumes using github project using google gemini LLm
            in realtime using webhook events`,
  },

  {
    Title: "Hive Hub -Ai Powered job Portal",
    Technology: "Nextjs,Postgresql,Drizzle,Gemini,inngest",
    Desc: `Developed a Resume Automation platform using github webhook api
            which generated Resumes using github project using google gemini LLm
            in realtime using webhook events`,
  },
  {
    Title: "Zaylo– Scalable E-Commerce Platform",
    Technology: "Nextjs,Postgresql,Drizzle",
    Desc: `Developed a Resume Automation platform using github webhook api
            which generated Resumes using github project using google gemini LLm
            in realtime using webhook events`,
  },
];

function ProjectElement({
  Title,
  Technology,
  Desc,
}: {
  Title: string;
  Technology: string;
  Desc: string;
}) {
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-gray-200">{Title}</h1>
        <div className="flex gap-4">
          <a href="">
            <Globe className="text-orange-500" />
          </a>
          <a href="">
            <Github className="text-orange-500" />
          </a>
          <a href="">
            <PlayCircle className="text-orange-500" />
          </a>
        </div>
      </div>
      <h3 className="text-md text-gray-400 mt-2">{Technology}</h3>
      <p className="text-gray-200 ">{Desc}</p>
    </div>
  );
}

const Projects = () => {
  return (
    <div className="font-Intel my-20">
      <TextScramble speed={0.35} text="Projects" textsize="text-lg"  font="font-Intel"/>
      {/* <h1 className="text-orange-500  font-semibold text-lg">Projects</h1> */}

      <div className="px-2 mt-4 flex flex-col gap-14">
        {projectsList.map((elem) => (
          <ProjectElement
            Desc={elem.Desc}
            Technology={elem.Technology}
            Title={elem.Title}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;
