"use client";

import { useParams } from "next/navigation";
import React from "react";

const GamePage = () => {
  const params = useParams();

  // These are typed as string | string[] | undefined — so cast if needed
  const sport = params.sport as string;
  const webUrl = params.game as string;

  return (
    <div className="w-full lg:px-20"> 
      <div className="flex flex-col items-center justify-center h-full w-full">
        <h1 className="text-2xl font-bold">Game Page: {webUrl}</h1>
        <p className="text-lg">Sport: {sport}</p>
      </div>
    </div>
  );
};

export default GamePage;
