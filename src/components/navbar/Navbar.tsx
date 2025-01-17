import React from "react";
import Logo from "./Logo";
import Links from "./Links";
import SearchBar from "./SearchBar";

const Navbar = () => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <Logo />
        <SearchBar />
        <Links />
      </div>
    </div>
  );
};

export default Navbar;
