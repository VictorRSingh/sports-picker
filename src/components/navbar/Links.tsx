"use client";

import React from "react";
import { Links as links } from "../../../public/data/NavLinks";
import { useRouter } from "next/navigation";
import { IoMenu } from "react-icons/io5";
const Links = () => {
  const router = useRouter();

  return (
    <div className="flex gap-x-4">
      <div className="hidden md:flex gap-x-4">
        {links.map((link, index) => (
          <button
            key={index}
            className="px-5 py-1 border rounded"
            onClick={() => router.push(link.path)}
          >
            {link.name}
          </button>
        ))}
      </div>
      <div className="block md:hidden border-2 rounded">
        <IoMenu className="text-3xl"/>
      </div>
    </div>
  );
};

export default Links;
