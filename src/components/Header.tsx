import { TextScramble } from "../lib/useScramble";
import AboutMe from "./AboutMe";
import Social from "./Social";

const Header = () => {
  return (
    <div className=" py-1 space-y-2 border--2 pl-2 border-orange-400 p-1  ">
      
    <div className="flex gap-2">
      <img src="/profile.png" className="w-48"/>
         <img src="/profile.png" className="w-48"/>
         <img src="/profile.png" className="w-48"/>
         <img src="/profile.png" className="w-48"/>
    </div>
      <TextScramble
        speed={0.45}
        text="Rajikshan K"
        textsize="md:text-4xl text-2xl"
        font="font-PressStart"
      />

      {/* <h1 className='text-4xl font-semibold font-PressStart text-orange-500'>Rajikshan K</h1> */}

      <AboutMe />

      <Social/>

      
    </div>
  );
};

export default Header;
