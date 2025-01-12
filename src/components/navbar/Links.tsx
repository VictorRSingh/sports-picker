"use client";

import React, { useState } from "react";
import { Links as links } from "../../../public/data/NavLinks";
import { useRouter } from "next/navigation";
import { IoMenu, IoClose } from "react-icons/io5";
const Links = () => {
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
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
        {showMobileMenu ? (
          <IoClose
            className="text-3xl"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          />
        ) : (
          <IoMenu
            className="text-3xl"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          />
        )}
        {showMobileMenu && (
          <div className="absolute top-20 left-0 flex flex-col items-center w-full p-4 gap-y-2 text-2xl bg-black border-b-2">
            {links.map((link, index) => (
              <button
                className="border w-full rounded"
                key={index}
                onClick={() => {
                  setShowMobileMenu(false);
                  router.push(link.path);
                }}
              >
                {link.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Links;
