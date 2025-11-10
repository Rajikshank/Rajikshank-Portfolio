import { Copyright } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="font-Intel">
      <div className="flex items-center justify-center py-4 px-4 text-sm sm:text-base text-white">
        <Copyright className="w-4 h-4 mr-2" />
        <span>Developed by Rajikshan</span>
      </div>
    </footer>
  );
};
