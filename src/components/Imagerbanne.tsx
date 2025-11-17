import React from "react";

export const Imagebanner = () => {
  return (
    <div className="flex gap-2">
      <img src="/profile.png" className="md:w-48 rounded-xl " />
      {/* <img src="/profile.png" className="w-48 md:block hidden rounded-xl" />
         <img src="/profile.png" className="w-48 hidden md:block rounded-xl" />
         <img src="/profile.png" className="w-48 hidden md:block rounded-xl " /> */}
    </div>
  );
};
