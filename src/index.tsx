 
import Header from "./components/Header";
// import Navbar from "./components/Navbar";
import AboutMe from "./components/AboutMe";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Education from "./components/Education"; 
import { Footer } from "./components/Footer"; 

const Index = () => {
  return (
    <div className="max-w-4xl mx-auto my-6">
      <Header />
      {/* <Navbar /> */}
      <AboutMe />
      <Experience />
      <Projects />
      <Education />
      <Footer />
    </div>
  );
};

export default Index;
