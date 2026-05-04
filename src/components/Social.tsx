import { BriefcaseBusiness, GitBranch, X } from "lucide-react";
import { motion } from "motion/react";
import { socials } from "../data/portfolio";

const links = [
  { label: "LinkedIn", href: socials.linkedin, Icon: BriefcaseBusiness },
  { label: "GitHub", href: socials.github, Icon: GitBranch },
  { label: "X", href: socials.x, Icon: X },
];

const Social = () => {
  return (
    <motion.div className="flex items-center gap-2">
      {links.map(({ label, href, Icon }, index) => (
        <motion.a
          key={label}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.46 + index * 0.06, duration: 0.35 }}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className="spark-button inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-stone-300 transition hover:border-orange-300/60 hover:bg-orange-300/10 hover:text-orange-100"
        >
          <Icon className="h-4 w-4" />
        </motion.a>
      ))}
    </motion.div>
  );
};

export default Social;
