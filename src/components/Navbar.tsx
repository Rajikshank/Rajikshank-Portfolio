

const Navbar = () => {
  return (
    <nav className="flex justify-between gap-2 max-w-[450px] font-Intel ">
      <a className="text-gray-200 inline-flex gap-2">
        {" "}
        <p className="text-orange-500"> ◆</p> Projects
      </a>
      <a className="text-gray-200 inline-flex gap-2">
        {" "}
        <p className="text-orange-500"> ◆</p> Education
      </a>
      <a className="text-gray-200 inline-flex gap-2">
        {" "}
        <p className="text-orange-500"> ◆</p> Contact Me
      </a>
    </nav>
  );
};

export default Navbar;
