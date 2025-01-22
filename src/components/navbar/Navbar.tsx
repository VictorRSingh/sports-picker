"use client";

import React from "react";
import Logo from "./Logo";
import Links from "./Links";
import SearchBar from "./SearchBar";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-center">
      <div className="flex w-full text-xs gap-x-8 py-2 font-semibold bg-neutral-600 px-4 p-y1">
        <button className="uppercase" onClick={() => router.push("/")}>sports picker</button>
        <button className="uppercase flex gap-x-1" ><a href="https://victorsingh.ca">victor singh</a> <FaExternalLinkAlt /></button>
      </div>
      <div className="flex justify-between items-center px-2 my-2">
        <Logo />
        <SearchBar />
        <Links />
      </div>
    </div>
  );
};

export default Navbar;
