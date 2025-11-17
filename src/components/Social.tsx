import { ArrowDownToLine, Github, Linkedin, X } from "lucide-react";
import { motion } from "motion/react";
const Social = () => {
 

  return (
    <motion.div className=" mt-4 flex space-x-14 md:space-x-24">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
        <a
          href="https://www.linkedin.com/in/krishnakumar-rajikshan-4853861a5/"
          target="__blank"
        >
          <Linkedin className="text-orange-500 bg-gray-700 ring-1 hover:ring-1 hover:cursor-pointer hover:scale-110 hover:ring-white rounded p-0.5  w-6 h-6" />
        </a>
      </motion.div>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
        <a href="https://github.com/Rajikshank" target="__blank">
          <Github className="text-orange-500 bg-gray-700 ring-1 hover:ring-1 hover:cursor-pointer hover:scale-110 hover:ring-white rounded p-0.5  w-6 h-6" />
        </a>
      </motion.div>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
        <a href="https://x.com/x399Shan" target="__blank">
          <X className="text-orange-500 bg-gray-700 ring-1 hover:ring-1 hover:cursor-pointer hover:scale-110 hover:ring-white rounded p-0.5  w-6 h-6" />
        </a>
      </motion.div>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
        {" "}

        <a href="https://drive.google.com/file/d/1zp91nbp8eCVzUQIpayRl1ModXrVnNlYl/view?usp=drive_link" target="__blank">
        <ArrowDownToLine
        
          className="text-orange-500 bg-gray-700 ring-1 hover:ring-1 hover:cursor-pointer hover:scale-110 hover:ring-white rounded p-0.5  w-6 h-6"
       
       />
       </a>
      </motion.div>
    </motion.div>
  );
};

export default Social;
