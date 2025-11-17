import { Mail, MapPin } from "lucide-react";
import { TextScramble } from "../lib/useScramble";
import AboutMe from "./AboutMe";
import Social from "./Social";


const Header = () => {
  return (
    <>
    <div className=" py-1 space-y-2  border-orange-400 p-1  ">
      <div className="mt-8 flex">
      
        <TextScramble
          speed={0.45}
          text="Rajikshan K"
          textsize="md:text-4xl text-2xl"
          font="font-PressStart"
        />
      </div>

      <div className="flex space-x-8 ">
        <div className="flex items-center gap-1">
          <MapPin className="text-orange-400 w-4" />
          <h2 className="text-white font-Intel text-sm ">Sri Lanka</h2>
        </div>

        <div className="flex items-center gap-1">
          <Mail className="text-orange-400 w-4" />
          <h2 className="text-white font-Intel text-sm ">
            Krajikshan637@gmail.com
          </h2>
        </div>
      </div>

      {/* <h1 className='text-4xl font-semibold font-PressStart text-orange-500'>Rajikshan K</h1> */}

      <div className="mt-2">
        <AboutMe />
      </div>
      <Social />

     
    </div>
     <div className="my-4 rounded bg-gradient-to-r h-1 bg-orange-500 mask-r-to-transparent">

      </div>
    </>
  );
};

export default Header;
