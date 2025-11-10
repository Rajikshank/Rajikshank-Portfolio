import { ArrowDownToLine, Github, Linkedin, X } from "lucide-react";
import { motion } from "motion/react";
const Social = () => {
  return (
    <motion.div className=" mt-6 flex space-x-14 md:space-x-24">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
        <Linkedin className="text-orange-500 bg-gray-700 ring-1 hover:ring-1 hover:cursor-pointer hover:scale-110 hover:ring-white rounded p-0.5  w-6 h-6" />
      </motion.div>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1, }}  >
        <Github className="text-orange-500 bg-gray-700 ring-1 hover:ring-1 hover:cursor-pointer hover:scale-110 hover:ring-white rounded p-0.5  w-6 h-6"  />
      </motion.div>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
        <X className="text-orange-500 bg-gray-700 ring-1 hover:ring-1 hover:cursor-pointer hover:scale-110 hover:ring-white rounded p-0.5  w-6 h-6"  />
      </motion.div>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
        {" "}
        <ArrowDownToLine className="text-orange-500 bg-gray-700 ring-1 hover:ring-1 hover:cursor-pointer hover:scale-110 hover:ring-white rounded p-0.5  w-6 h-6"  />
      </motion.div>
    </motion.div>
  );
};

export default Social;
