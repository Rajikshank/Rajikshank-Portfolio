import { Github, Globe, PlayCircle } from "lucide-react";

import { TextScramble } from "../lib/useScramble";
import { motion } from "motion/react";
import Modal from "./Modal";
import { useState } from "react";

const projectsList = [
  {
    Title: "Resume Automation using Github Webhook",
    Technology: "Nextjs,Postgresql,Prisma,Gemini",
    Desc: `Developed a Resume Automation platform using github webhook api
            which generated Resumes using github project using google gemini LLm
            in realtime using webhook events`,
    github: "",
    live: "https://www.gizume.online/",
    demo: null,
    thumnail: "/gizume.png",
  },

  {
    Title: "Hive Hub -Ai Powered job Portal",
    Technology: "Nextjs,Postgresql,Drizzle,Gemini,inngest",
    Desc: ` AI-driven job recommendation system using  LangChain, Prisma, and Pinecone which recommends jobs based on the ATS score and keyword similarity from the resume`,

    github: "https://github.com/Rajikshank/Hive-Hub",
    live: "hive-hub-zeta.vercel.app",
    demo: "https://private-user-images.githubusercontent.com/80474719/413535690-ca913ca6-ffbe-426a-9c02-bdfcf4097c5d.mp4?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTMxMzUxODYsIm5iZiI6MTc1MzEzNDg4NiwicGF0aCI6Ii84MDQ3NDcxOS80MTM1MzU2OTAtY2E5MTNjYTYtZmZiZS00MjZhLTljMDItYmRmY2Y0MDk3YzVkLm1wND9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA3MjElMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNzIxVDIxNTQ0NlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWRkYTNkMDYyNThiZTg4OWQ0MjQ0MzI1ZmQ5ZTU2ZmEwZDJjZjE3YjgzMzJjZjZjNjNhZmRmOWEyZDlmMjJjYTQmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.QbyTZuRePIzilt33hrdBSgwPusQS13FqwHnKKmWP_u4",
    thumnail: "/hive-hub.png",
  },
  {
    Title: "Zaylo– Scalable E-Commerce Platform",
    Technology: "Nextjs,Postgresql,Drizzle",
    Desc: ` Simple e-commerce site using Next.js and Drizzle ORM, `,
    github: "https://github.com/Rajikshank/Zaylo-Store",
    live: "zaylo-uxl3.vercel.app",
    demo: null,
    thumnail: "/zaylo.png",
  },
];

function ProjectElement({
  Title,
  Technology,
  Desc,
  demo,
  github,
  live,
  idx,
  thumnail,
}: {
  Title: string;
  Technology: string;
  Desc: string;
  github: string;
  live: string;
  demo: string | null;
  idx: number;
  thumnail: string;
}) {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="lg:text-base text-sm ">
      <div className="flex flex-col md:flex-row md:gap-0 gap-4 justify-between md:items-center">
        <div>
          <h1 className="text-gray-200">{Title}</h1>

          <h3 className="text-md text-gray-400 mt-2">{Technology}</h3>
          <p className="text-gray-200  text-justify max-w-[700px] ">{Desc}</p>
        </div>
        <div className="flex gap-2 items-center  flex-col">
          <div className="w-[120px] relative hidden md:block">
            <motion.img
              onHoverStart={() => setShowModal(() => true)}
              onHoverEnd={() => setShowModal(() => false)}
              initial={{ y: -50, scale: 0 }}
              animate={{ y: 0, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              src={thumnail} 
              className="w-full hover:opacity-60 object-contain rounded-md ring-1 ring-orange-500  cursor-pointer"
              alt="project-thumnail"
            />
            {showModal && <Modal src={thumnail} />}
          </div>
          <div className="flex w-full gap-4">
            <motion.a
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.2 }}
              href={live}
              target="__blank"
            >
              <Globe className="text-orange-500" />
            </motion.a>
            <motion.a
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.25 }}
              href={github}
              target="__blank"
            >
              <Github className="text-orange-500" />
            </motion.a>
            {demo && (
              <motion.a
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.3 }}
                href={demo}
                target="__blank"
              >
                <PlayCircle className="text-orange-500" />
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const Projects = () => {
  return (
    <div className="font-Intel my-20 relative">
      <TextScramble
        speed={0.35}
        text="Projects"
        textsize="text-lg"
        font="font-Intel"
      />
      {/* <h1 className="text-orange-500  font-semibold text-lg">Projects</h1> */}

      <div className="px-2 mt-4 flex flex-col gap-14">
        {projectsList.map((elem, idx) => (
          <ProjectElement
          thumnail={elem.thumnail}
            idx={idx + 1}
            key={idx}
            demo={elem.demo}
            github={elem.github}
            live={elem.live}
            Desc={elem.Desc}
            Technology={elem.Technology}
            Title={elem.Title}
          />
        ))}
      </div>
      {/* {showModal && <Modal />} */}
    </div>
  );
};

export default Projects;
